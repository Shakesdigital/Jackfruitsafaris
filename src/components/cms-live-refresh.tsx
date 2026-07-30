"use client";

import { createBrowserClient } from "@supabase/ssr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Function to clear React cache entries for CMS data
async function clearCmsCache() {
  try {
    if (typeof window !== 'undefined') {
      // Try to clear React cache via API endpoint
      const response = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['cms', 'site-settings'] })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.cleared) {
          return true; // Successfully cleared cache
        }
      }
    }
  } catch (error) {
    console.warn('Cache clearing API failed, using fallback:', error);
  }

  // Fallback: force hard navigation to clear all cache
  // This ensures permanent changes even if API fails
  setTimeout(() => {
    window.location.reload();
  }, 50);
  return false; // Indicates fallback was used
}

export function CmsLiveRefresh() {
  const router = useRouter();
  const pathname = usePathname();

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
    let supabase: any = null;
    let channel: any = null;

    const setupRefresh = () => {
      // Clear the cache first, then refresh
      clearCmsCache().then(() => {
        // Then trigger router refresh
        router.refresh();
      });
    };

    const scheduleRefresh = () => {
      if (document.visibilityState !== "visible") return;
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        setupRefresh();
      }, 100); // Faster refresh for better UX
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") scheduleRefresh();
    };

    // Set up focus listener
    window.addEventListener("focus", scheduleRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Only set up Supabase subscription if credentials are available
    if (!supabaseUrl || !supabaseKey) {
      // No Supabase configuration - still allow focus-based refresh
      return () => {
        if (refreshTimer) clearTimeout(refreshTimer);
        window.removeEventListener("focus", scheduleRefresh);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    // Initialize Supabase client
    supabase = createBrowserClient(supabaseUrl, supabaseKey);

    // Subscribe to CMS changes
    channel = supabase
      .channel(`cms-public-refresh:${pathname}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "cms_refresh_events",
        },
        () => {
          // Use scheduled refresh to avoid excessive calls
          scheduleRefresh();
        }
      )
      .subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      window.removeEventListener("focus", scheduleRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [pathname, router]);

  return null;
}
