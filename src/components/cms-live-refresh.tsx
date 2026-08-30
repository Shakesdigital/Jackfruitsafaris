"use client";

import { createBrowserClient } from "@supabase/ssr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * CmsLiveRefresh — listens for Supabase Realtime events on the
 * `cms_refresh_events` table (populated by the database trigger
 * `cms_emit_refresh_event`) and, when an admin saves content, clears
 * the Next.js server cache and triggers a `router.refresh()` so the
 * published frontend picks up changes immediately.
 *
 * The companion `CmsRealtimeProvider` (in `src/lib/supabase/realtime-context.tsx`)
 * provides direct table subscriptions + a client-side pub/sub bus for
 * components that hold local state and need sub-second updates.
 */

async function clearServerCmsCache(pathname: string) {
  try {
    const response = await fetch("/api/clear-cache", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: ["cms", "site-settings", "published-content"],
        paths: [pathname],
      }),
    });

    if (!response.ok) {
      console.warn("[CmsLiveRefresh] cache clearing failed:", response.status);
    }
  } catch (error) {
    console.warn("[CmsLiveRefresh] cache clearing failed:", error);
  }
}

async function refreshCmsContent(
  router: { refresh: () => void },
  pathname: string,
) {
  await clearServerCmsCache(pathname);
  router.refresh();
}

export function CmsLiveRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const currentPathname = pathname || "/";

  useEffect(() => {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL_KEY ||
      process.env.SUPABASE_URL ||
      process.env.SUPABASE_URL_KEY;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let lastRefreshTime = 0;
    const minRefreshInterval = 750;

    const scheduleRefresh = () => {
      if (document.visibilityState !== "visible") return;
      if (refreshTimer) clearTimeout(refreshTimer);

      refreshTimer = setTimeout(() => {
        const now = Date.now();
        if (now - lastRefreshTime < minRefreshInterval) return;

        lastRefreshTime = now;
        refreshCmsContent(router, currentPathname).catch((error) => {
          console.warn("[CmsLiveRefresh] live refresh failed:", error);
        });
      }, 150);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleRefresh();
      }
    };

    window.addEventListener("focus", scheduleRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // If Supabase env vars are missing, we still want focus-based refresh.
    if (!supabaseUrl || !supabaseKey) {
      return () => {
        if (refreshTimer) clearTimeout(refreshTimer);
        window.removeEventListener("focus", scheduleRefresh);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);

    // Primary channel: the trigger-emitted `cms_refresh_events` table.
    const channel = supabase
      .channel(`cms-public-refresh:${currentPathname}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "cms_refresh_events",
        },
        () => {
          // The event payload carries `scope` (the table name) but we
          // refresh the whole page for simplicity — `cms-data` fetchers
          // already use `unstable_noStore()`.
          scheduleRefresh();
        },
      )
      .subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      window.removeEventListener("focus", scheduleRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [currentPathname, router]);

  return null;
}
