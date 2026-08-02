-- Add footer background color to site_settings for CMS-managed footer styling

alter table public.site_settings
  add column if not exists footer_background_color text;

update public.site_settings
set footer_background_color = coalesce(footer_background_color, '#10251b')
where true;