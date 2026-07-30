"use client";

import { createBrowserClient } from "@supabase/ssr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function CmsLiveRefresh() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL_KEY;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_SUPABASE_ANON_KEY;

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleRefresh = () => {
      if (document.visibilityState !== "visible") return;
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => router.refresh(), 250);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") scheduleRefresh();
    };

    window.addEventListener("focus", scheduleRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (!url || !key) {
      return () => {
        if (refreshTimer) clearTimeout(refreshTimer);
        window.removeEventListener("focus", scheduleRefresh);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    const supabase = createBrowserClient(url, key);
    const channel = supabase
      .channel(`cms-public-refresh:${pathname}`)
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
      void supabase.removeChannel(channel);
    };
  }, [pathname, router]);

  return null;
}
