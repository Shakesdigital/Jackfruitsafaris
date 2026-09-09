-- Add intro_image column to page_heroes for right-side hero image support.
-- This is distinct from background_image (which is a full-width CSS background).
-- intro_image renders as an <img> on the right side of the hero text in a
-- two-column grid layout.

alter table public.page_heroes
  add column if not exists intro_image text;

-- Realtime: page_heroes is already included in the supabase_realtime
-- publication and the cms_emit_refresh_event trigger set by the
-- unified CMS realtime migration (202609020001). Since we are only
-- adding a column (not a new table), the existing trigger covers it
-- and no additional realtime setup is needed.
