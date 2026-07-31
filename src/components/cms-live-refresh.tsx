"use client";

import { createBrowserClient } from "@supabase/ssr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
      console.warn("CMS cache clearing failed:", response.status);
    }
  } catch (error) {
    console.warn("CMS cache clearing failed:", error);
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
          console.warn("CMS live refresh failed:", error);
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

    if (!supabaseUrl || !supabaseKey) {
      return () => {
        if (refreshTimer) clearTimeout(refreshTimer);
        window.removeEventListener("focus", scheduleRefresh);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const channel = supabase
      .channel(`cms-public-refresh:${currentPathname}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "cms_refresh_events",
        },
        scheduleRefresh,
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
