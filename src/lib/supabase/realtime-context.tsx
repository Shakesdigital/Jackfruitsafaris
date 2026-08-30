"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

/**
 * A lightweight client-side realtime hub for CMS content.
 *
 * The database triggers in `202607300004_cms_realtime_refresh.sql` already
 * emit rows into `cms_refresh_events`, and `CmsLiveRefresh` listens for those
 * events and calls `router.refresh()`. However, for client-side components
 * that fetch data with SWR / React Query (or hold local state), we also need
 * a pub/sub channel so they can invalidate their caches instantly — without
 * waiting for a full-page revalidation round-trip.
 *
 * This context provides:
 *   1. `subscribe` – register a callback for a change to one or more tables.
 *   2. `broadcast`  – emit a synthetic event (used by admin save handlers
 *                     after a successful mutation so the editor sees updates
 *                     on every open tab immediately).
 *   3. `isRefreshing` – a boolean that UI can use to show a "live" indicator.
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
  | "accommodations"
  | "redirects";

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
  "accommodations",
  "redirects",
];

const getEnvVar = (a: string, b: string, c: string) =>
  process.env[a] || process.env[b] || process.env[c];

export function CmsRealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handlers = useRef(new Map<string, Set<CmsChangeHandler>>());

  const broadcast = (
    tables: CmsTable | CmsTable[],
    event: "INSERT" | "UPDATE" | "DELETE" = "UPDATE",
  ) => {
    const tableList = Array.isArray(tables) ? tables : [tables];
    for (const table of tableList) {
      const key = `*:${table}`;
      handlers.current.get(key)?.forEach((fn) =>
        fn({ table, event, payload: null }),
      );
      // Also notify "*" general subscribers
      handlers.current.get("*:*")?.forEach((fn) =>
        fn({ table, event, payload: null }),
      );
    }
  };

  const subscribe = (
    tables: CmsTable | CmsTable[],
    handler: CmsChangeHandler,
  ): (() => void) => {
    const tableList = Array.isArray(tables) ? tables : [tables];
    const unsubFns: (() => void)[] = [];

    for (const table of tableList) {
      const key = `*:${table}`;
      if (!handlers.current.has(key)) {
        handlers.current.set(key, new Set());
      }
      handlers.current.get(key)!.add(handler);

      const remove = () => {
        handlers.current.get(key)?.delete(handler);
      };
      unsubFns.push(remove);
    }

    // Always listen to the global "*" channel as well
    const globalKey = "*:*";
    if (!handlers.current.has(globalKey)) {
      handlers.current.set(globalKey, new Set());
    }
    handlers.current.get(globalKey)!.add((payload) => {
      if (tableList.includes(payload.table)) {
        handler(payload);
      }
    });

    return () => {
      unsubFns.forEach((fn) => fn());
      handlers.current.get(globalKey)?.delete(handler as CmsChangeHandler);
    };
  };

  // Subscribe to Supabase Realtime on the `cms_refresh_events` table
  // (the trigger-based approach) AND, as a backup, directly to each
  // CMS table so changes propagate even if triggers haven't been
  // re-run for a new table.
  useEffect(() => {
    const supabaseUrl =
      getEnvVar(
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_URL_KEY",
        "SUPABASE_URL",
      ) || getEnvVar("SUPABASE_URL", "SUPABASE_URL_KEY", "SUPABASE_URL");
    const supabaseKey =
      getEnvVar(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "NEXT_SUPABASE_ANON_KEY",
        "SUPABASE_ANON_KEY"
      );

    if (!supabaseUrl || !supabaseKey) {
      console.warn("[CmsRealtime] Supabase env vars not configured — Realtime will use broadcast-only mode.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let supabase: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channelList: any[] = [];

    const setup = async () => {
      const { createBrowserClient } = await import("@supabase/ssr");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase = createBrowserClient(supabaseUrl, supabaseKey) as any;

      // 1. Listen to the trigger-based refresh event table
      const refreshChannel = supabase
        .channel("cms-refresh-events")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "cms_refresh_events",
          },
          () => {
            setIsRefreshing(true);
            // Broadcast a generic "everything changed" notification
            ALL_TABLES.forEach((table) => {
              handlers.current.get(`*:${table}`)?.forEach((fn) =>
                fn({ table, event: "*", payload: null }),
              );
              handlers.current.get("*:*")?.forEach((fn) =>
                fn({ table, event: "*", payload: null }),
              );
            });

            // Clear the refreshing state after a short delay
            setTimeout(() => setIsRefreshing(false), 1000);
          },
        )
        .subscribe();

      channelList.push(refreshChannel);

      // 2. Directly subscribe to each CMS table as a fallback / enhancement.
      //    This gives us the actual row payload and fires instantly.
      for (const table of ALL_TABLES) {
        const channel = supabase
          .channel(`cms-table-${table}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table,
            },
            (change: { event: string; payload: unknown }) => {
              const event = (change?.event ?? "*") as "INSERT" | "UPDATE" | "DELETE" | "*";
              handlers.current.get(`*:${table}`)?.forEach((fn) =>
                fn({ table, event, payload: change }),
              );
              handlers.current.get("*:*")?.forEach((fn) =>
                fn({ table, event, payload: change }),
              );
            },
          )
          .subscribe();

        channelList.push(channel);
      }
    };

    setup();

    return () => {
      channelList.forEach((ch) => {
        try {
          supabase?.removeChannel(ch);
        } catch {
          // Channel may already be removed
        }
      });
    };
  }, []);

  const value: RealtimeContextValue = {
    subscribe,
    broadcast,
    isRefreshing,
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
      "useCmsRealtime must be used within a <CmsRealtimeProvider>"
    );
  }
  return ctx;
};

/**
 * Convenience hook: subscribe to changes on one or more CMS tables and
 * run a callback. Returns `isRefreshing` for UI feedback.
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

  return { isRefreshing: rt.isRefreshing };
}
