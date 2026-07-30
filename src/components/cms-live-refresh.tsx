"use client";

import { createBrowserClient } from "@supabase/ssr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Enhanced cache clearing with multiple strategies
async function clearCmsCacheMultiLayer() {
  const results = {
    apiSuccess: false,
    browserCacheCleared: false,
    hardReloadTriggered: false,
    errors: [] as string[]
  };

  // Strategy 1: Try API cache clearing first (most reliable)
  try {
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: ['cms', 'site-settings', 'published-content'],
          paths: ['/admin', '/admin/', '/', '/safaris', '/destinations', '/experiences']
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success || result.cleared) {
          results.apiSuccess = true;
          return results; // Success - exit early
        }
      }
    }
  } catch (error) {
    results.errors.push(`API cache clearing failed: ${error}`);
  }

  // Strategy 2: Browser cache invalidation
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Try to unregister service workers (if present)
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      results.browserCacheCleared = true;
    }

    // Clear localStorage/sessionStorage items that might contain cached data
    if (typeof window !== 'undefined') {
      // Remove any cached CMS data keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cms-') || key.includes('safari') || key.includes('destination') || key.includes('experience')) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage as well
      sessionStorage.clear();
      results.browserCacheCleared = true;
    }
  } catch (error) {
    results.errors.push(`Browser cache clearing failed: ${error}`);
  }

  // Strategy 3: Hard reload if previous strategies fail
  // Use a short delay to allow concurrent operations
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      // Add cache-busting query parameter to force fresh load
      const url = new URL(window.location.href);
      url.searchParams.set('_cache_bust', Date.now().toString());
      window.location.href = url.toString();
      results.hardReloadTriggered = true;
    }
  }, 100);

  return results;
}

// Enhanced refresh function with multiple cache clearing strategies
async function enhancedCmsRefresh(router: { refresh: () => void }) {
  const refreshId = Math.random().toString(36).substr(2, 9);
  console.log(`[${refreshId}] Starting enhanced CMS refresh`);

  const startTime = Date.now();
  const cacheResults = await clearCmsCacheMultiLayer();

  console.log(`[${refreshId}] Cache clearing completed in ${Date.now() - startTime}ms:`, cacheResults);

  // Strategy selection based on results
  if (cacheResults.apiSuccess) {
    // API succeeded - use normal router refresh
    console.log(`[${refreshId}] API cache clearing successful - using router refresh`);
    return router.refresh();
  } else if (cacheResults.browserCacheCleared) {
    // Browser cache cleared but API failed - use router refresh
    console.log(`[${refreshId}] Browser cache cleared - using router refresh`);
    return router.refresh();
  } else if (cacheResults.hardReloadTriggered) {
    // Hard reload was triggered (will happen immediately)
    console.log(`[${refreshId}] Hard reload triggered`);
    return; // The reload will handle the refresh
  } else {
    // All strategies failed - force immediate reload
    console.log(`[${refreshId}] All cache clearing failed - forcing reload`);
    window.location.reload();
  }
}

export function CmsLiveRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const isInitialized = useRef(false);
  const refreshCount = useRef(0);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) return;
    isInitialized.current = true;

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
    let lastRefreshTime = 0;
    const MIN_REFRESH_INTERVAL = 500; // Minimum time between refreshes (ms)

    const setupRefresh = () => {
      const now = Date.now();
      refreshCount.current++;
      const currentRefreshId = refreshCount.current;

      console.log(`[${currentRefreshId}] Setup refresh triggered`);

      // Prevent too frequent refreshes
      if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
        console.log(`[${currentRefreshId}] Refresh throttled - too recent`);
        return;
      }

      lastRefreshTime = now;

      // Use enhanced refresh with comprehensive cache clearing
      enhancedCmsRefresh(router)
        .then(() => {
          console.log(`[${currentRefreshId}] Enhanced refresh completed successfully`);
        })
        .catch((error) => {
          console.error(`[${currentRefreshId}] Enhanced refresh error:`, error);
          // Ultimate fallback: hard reload
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }, 100);
        });
    };

    const scheduleRefresh = () => {
      if (document.visibilityState !== "visible") {
        console.log("Not visible - skipping refresh");
        return;
      }

      if (refreshTimer) clearTimeout(refreshTimer);

      // Use jittered timing to prevent refresh storms
      const jitter = Math.random() * 100; // 0-100ms jitter
      refreshTimer = setTimeout(() => {
        setupRefresh();
      }, 100 + jitter); // 100-200ms base with jitter
    };

    const handleVisibilityChange = () => {
      console.log(`Visibility changed to: ${document.visibilityState}`);
      if (document.visibilityState === "visible") {
        scheduleRefresh();
      }
    };

    // Set up focus listener
    window.addEventListener("focus", scheduleRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initialize Supabase only if credentials are available
    if (!supabaseUrl || !supabaseKey) {
      console.log("No Supabase configuration - using focus-based refresh only");
      // Still allow focus-based refresh even without Supabase
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
          console.log("CMS refresh event detected, scheduling refresh");
          scheduleRefresh();
        }
      )
      .subscribe((status: string) => {
        console.log(`Supabase channel subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to cms refresh events for pathname: ${pathname}`);
        }
      });

    console.log(`CmsLiveRefresh initialized for pathname: ${pathname}`);

    return () => {
      console.log(`CmsLiveRefresh cleanup for pathname: ${pathname}`);
      if (refreshTimer) clearTimeout(refreshTimer);
      window.removeEventListener("focus", scheduleRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (supabase && channel) {
        supabase.removeChannel(channel);
        console.log(`Unsubscribed from cms refresh events`);
      }
    };
  }, [pathname, router]);

  return null;
}
