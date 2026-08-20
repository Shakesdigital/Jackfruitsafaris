-- Remove Reviews link from navigation on existing databases
-- Reviews are now only accessible via the dedicated /reviews page, not the main nav

-- Remove Reviews from site_settings.nav_items (JSONB array)
update public.site_settings
set nav_items = (
  select jsonb_agg(item)
  from jsonb_array_elements(nav_items) as item
  where item->>'label' != 'Reviews'
)
where nav_items is not null
  and nav_items::jsonb ? 'Reviews';

-- Remove Reviews from main and footer menus (menu_items table)
delete from public.menu_items
where label = 'Reviews'
  and menu_id in (
    select id from public.menus where location in ('main', 'footer') and status = 'published'
  );
