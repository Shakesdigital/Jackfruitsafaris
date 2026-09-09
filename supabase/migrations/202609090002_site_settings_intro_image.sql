-- Add hero_intro_image column to site_settings for the homepage hero.
-- The homepage reads hero data from site_settings (not page_heroes),
-- so it needs its own column for the right-side intro image.

alter table public.site_settings
  add column if not exists hero_intro_image text;
