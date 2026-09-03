/**
 * CmsLiveRefresh
 *
 * Deprecated — the realtime refresh logic now lives in `CmsRealtimeProvider`
 * (see `src/lib/supabase/realtime-context.tsx`).  This file is kept as a
 * thin re-export so any stale imports continue to work.
 *
 * The provider subscribes to the `cms_refresh_events` proxy table via Supabase
 * Realtime and calls `router.refresh()` on every INSERT, which re-runs all
 * server components that use `unstable_noStore()`.
 */

export { CmsRealtimeProvider as CmsLiveRefresh } from "@/lib/supabase/realtime-context";
