"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

/**
 * CmsRealtimeProvider
 *
 * A single, robust client-side realtime hub for CMS content changes.
 *
 * How it works:
 *   1. The database trigger `cms_emit_refresh_event` (defined in
 *      `202607300004_cms_realtime_refresh.sql`) fires on every INSERT/UPDATE/DELETE
 *      to any CMS content table and inserts a row into the `cms_refresh_events`
 *      proxy table.
 *   2. This provider subscribes to INSERT events on `cms_refresh_events` via
 *      Supabase Realtime.
 *   3. On each event it calls `router.refresh()` (which re-runs server components
 *      that use `unstable_noStore()`) and also notifies any local subscribers
 *      registered via `useCmsChanges`.
 *
 * This design avoids per-table Realtime subscriptions (which require every
 * content table to be in the Realtime publication) and instead relies on a
 * single, reliable proxy-table subscription.
 */

type CmsTable =
  | "site_settings"
  | "safari_packages"
  | "destinations"
  | "experiences"
  | "reviews"
  | "pages"
  | "page_heroes"
  | "page_content_sections"
  | "homepage_sections"
  | "homepage_quick_links"
  | "homepage_trust_items"
  | "homepage_features"
  | "homepage_guide_articles"
  | "gallery_media"
  | "travel_guide_articles"
  | "faqs"
  | "partners"
  | "menus"
  | "menu_items"
  | "accommodations"
  | "transfer_services"
  | "redirects"
  | "inquiry_leads";

type CmsChangeHandler = (payload: {
  table: CmsTable;
  event: "INSERT" | "UPDATE" | "DELETE" | "*";
  payload?: unknown;
}) => void;

type RealtimeContextValue = {
  /** Subscribe to changes on one or more CMS tables. Returns an unsubscribe fn. */
  subscribe: (tables: CmsTable | CmsTable[], handler: CmsChangeHandler) => () => void;
  /** Manually broadcast a synthetic change event (e.g. after an admin save). */
  broadcast: (tables: CmsTable | CmsTable[], event?: "INSERT" | "UPDATE" | "DELETE") => void;
  /** True while a page-wide refresh is in flight. */
  isRefreshing: boolean;
  /** Realtime connection status. */
  isConnected: boolean;
};

const CmsRealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

const ALL_TABLES: CmsTable[] = [
  "site_settings",
  "safari_packages",
  "destinations",
  "experiences",
  "reviews",
  "pages",
  "page_heroes",
  "page_content_sections",
  "homepage_sections",
  "homepage_quick_links",
  "homepage_trust_items",
  "homepage_features",
  "homepage_guide_articles",
  "gallery_media",
  "travel_guide_articles",
  "faqs",
  "partners",
  "menus",
  "menu_items",
  "accommodations",
  "transfer_services",
  "redirects",
  "inquiry_leads",
];

function getEnvVar(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
}

function isKnownTable(scope: string | undefined): scope is CmsTable {
  return ALL_TABLES.includes(scope as CmsTable);
}

export function CmsRealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Refs that don't need to be in the subscription dependency array
  const handlersRef = useRef(new Map<string, Set<CmsChangeHandler>>());
  const channelsRef = useRef<any[]>([]);
  const supabaseRef = useRef<any>(null);
  const lastRefreshTimeRef = useRef(0);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const subscribedRef = useRef(false);

  // Keep the latest pathname/search in a ref so triggerRefresh stays stable
  const locationRef = useRef("");
  useEffect(() => {
    locationRef.current = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
  }, [pathname, searchParams]);

  /** Clear the server-side ISR cache (no-op for force-dynamic pages, but harmless). */
  async function clearServerCmsCache() {
    try {
      await fetch("/api/clear-cache", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tags: ["cms", "site-settings", "published-content"],
          paths: [locationRef.current || "/"],
        }),
      });
    } catch (error) {
      // Non-fatal — router.refresh() is the real refresh mechanism for
      // force-dynamic pages.
      console.warn("[CMS Realtime] Cache clear failed:", error);
    }
  }

  /** Trigger a full page refresh via Next.js router. */
  const triggerRefresh = useCallback((reason: string) => {
    const now = Date.now();
    // Debounce: limit to one refresh per 300ms
    if (now - lastRefreshTimeRef.current < 300) {
      return;
    }
    lastRefreshTimeRef.current = now;

    console.log("[CMS Realtime] Triggering page refresh:", reason);

    setIsRefreshing(true);

    // Fire-and-forget cache clear, then refresh
    clearServerCmsCache();
    router.refresh();

    // Reset the refreshing flag after a short delay
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(() => setIsRefreshing(false), 1500);
  }, [router]);

  const broadcast = useCallback((
    tables: CmsTable | CmsTable[],
    event: "INSERT" | "UPDATE" | "DELETE" = "UPDATE",
  ) => {
    const tableList = Array.isArray(tables) ? tables : [tables];
    for (const table of tableList) {
      handlersRef.current.get(`*:${table}`)?.forEach((fn) =>
        fn({ table, event, payload: null }),
      );
      handlersRef.current.get("*:*")?.forEach((fn) =>
        fn({ table, event, payload: null }),
      );
    }
  }, []);

  const subscribe = useCallback((
    tables: CmsTable | CmsTable[],
    handler: CmsChangeHandler,
  ): (() => void) => {
    const tableList = Array.isArray(tables) ? tables : [tables];
    const unsubFns: (() => void)[] = [];

    for (const table of tableList) {
      const key = `*:${table}`;
      if (!handlersRef.current.has(key)) {
        handlersRef.current.set(key, new Set());
      }
      handlersRef.current.get(key)!.add(handler);

      unsubFns.push(() => {
        handlersRef.current.get(key)?.delete(handler);
      });
    }

    // Also listen on the global "*" channel
    const globalKey = "*:*";
    if (!handlersRef.current.has(globalKey)) {
      handlersRef.current.set(globalKey, new Set());
    }
    const globalHandler: CmsChangeHandler = (payload) => {
      if (tableList.includes(payload.table)) {
        handler(payload);
      }
    };
    handlersRef.current.get(globalKey)!.add(globalHandler);

    return () => {
      unsubFns.forEach((fn) => fn());
      handlersRef.current.get(globalKey)?.delete(globalHandler);
    };
  }, []);

  // ---- Realtime subscription (set up once) ----
  useEffect(() => {
    const supabaseUrl = getEnvVar(
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL_KEY",
      "SUPABASE_URL",
      "SUPABASE_URL_KEY",
    );
    const supabaseKey = getEnvVar(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_SUPABASE_ANON_KEY",
      "SUPABASE_ANON_KEY",
    );

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        "[CMS Realtime] Supabase env vars not configured — Realtime live refresh is disabled. " +
        "Pages will still show fresh data on manual reload.",
      );
      return;
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    supabaseRef.current = supabase;

    /** Set up (or re-connect) the Realtime subscription. */
    const connect = () => {
      if (subscribedRef.current) return;

      const channel = supabase
        .channel("cms-refresh-events")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "cms_refresh_events",
          },
          (_event: any) => {
            // The trigger inserts `scope = tg_table_name` so we know what changed.
            const scope = _event?.payload?.new?.scope;
            const table = isKnownTable(scope) ? scope : "site_settings";

            console.log("[CMS Realtime] Change event received:", { scope, table });

            // Notify pub/sub subscribers
            handlersRef.current.get(`*:${table}`)?.forEach((fn) =>
              fn({ table, event: "UPDATE", payload: null }),
            );
            handlersRef.current.get("*:*")?.forEach((fn) =>
              fn({ table, event: "UPDATE", payload: null }),
            );

            // Trigger a full page refresh so server components re-fetch
            triggerRefresh(`cms_refresh_events INSERT (scope=${scope})`);
          },
        )
        .subscribe((status: string) => {
          const isJoined = status === "SUBSCRIBED";
          setIsConnected(isJoined);

          if (isJoined) {
            console.log("[CMS Realtime] Connected to Supabase Realtime.");
            subscribedRef.current = true;
          }

          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            console.warn(`[CMS Realtime] Subscription status: ${status}. Retrying in 3s…`);
            subscribedRef.current = false;
            retryTimeoutRef.current = setTimeout(connect, 3000);
          }
        });

      channelsRef.current.push(channel);
    };

    connect();

    // Also notify subscribers when the admin broadcasts a synthetic event
    // directly from the client (e.g. after a successful save in a client form).
    // This is a fallback for cases where the DB trigger might not fire.

    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);

      if (supabaseRef.current) {
        channelsRef.current.forEach((ch) => {
          try {
            supabaseRef.current.removeChannel(ch);
          } catch {
            // Channel may already be removed
          }
        });
      }
      channelsRef.current = [];
      subscribedRef.current = false;
    };
  }, [triggerRefresh]);

  const value: RealtimeContextValue = {
    subscribe,
    broadcast,
    isRefreshing,
    isConnected,
  };

  return (
    <CmsRealtimeContext.Provider value={value}>
      {children}
    </CmsRealtimeContext.Provider>
  );
}

export const useCmsRealtime = (): RealtimeContextValue => {
  const ctx = useContext(CmsRealtimeContext);
  if (!ctx) {
    throw new Error(
      "useCmsRealtime must be used within a <CmsRealtimeProvider>",
    );
  }
  return ctx;
};

/**
 * Convenience hook: subscribe to changes on one or more CMS tables and
 * run a callback. Returns `isRefreshing` and `isConnected` for UI feedback.
 */
export function useCmsChanges(
  tables: CmsTable | CmsTable[],
  onChange: CmsChangeHandler,
) {
  const rt = useCmsRealtime();

  useEffect(() => {
    const unsub = rt.subscribe(tables, onChange);
    return unsub;
  }, [rt, tables, onChange]);

  return { isRefreshing: rt.isRefreshing, isConnected: rt.isConnected };
}
