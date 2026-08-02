-- Seed default menus for main navigation and footer navigation

-- Insert main menu
insert into public.menus (id, name, location, status)
values (
  gen_random_uuid(),
  'Main Navigation',
  'main',
  'published'
)
on conflict (name) do update
set location = excluded.location,
    status = excluded.status;

-- Insert footer menu
insert into public.menus (id, name, location, status)
values (
  gen_random_uuid(),
  'Footer Navigation',
  'footer',
  'published'
)
on conflict (name) do update
set location = excluded.location,
    status = excluded.status;

-- Get main menu id
do $$
declare
  main_menu_id uuid;
  footer_menu_id uuid;
begin
  select id into main_menu_id from public.menus where location = 'main' limit 1;
  select id into footer_menu_id from public.menus where location = 'footer' limit 1;

  -- Insert main menu items
  if main_menu_id is not null then
    delete from public.menu_items where menu_id = main_menu_id;

    insert into public.menu_items (menu_id, label, href, order_column) values
      (main_menu_id, 'Home', '/', 10),
      (main_menu_id, 'Safaris', '/safaris', 20),
      (main_menu_id, 'Destinations', '/destinations', 30),
      (main_menu_id, 'Experiences', '/experiences/gorilla-trekking', 40),
      (main_menu_id, 'About', '/about', 50),
      (main_menu_id, 'Reviews', '/reviews', 60),
      (main_menu_id, 'Travel Guide', '/travel-guide', 70);
  end if;

  -- Insert footer menu items
  if footer_menu_id is not null then
    delete from public.menu_items where menu_id = footer_menu_id;

    insert into public.menu_items (menu_id, label, href, order_column) values
      (footer_menu_id, 'Home', '/', 10),
      (footer_menu_id, 'Safaris', '/safaris', 20),
      (footer_menu_id, 'Destinations', '/destinations', 30),
      (footer_menu_id, 'Experiences', '/experiences/gorilla-trekking', 40),
      (footer_menu_id, 'About', '/about', 50),
      (footer_menu_id, 'Reviews', '/reviews', 60),
      (footer_menu_id, 'Travel Guide', '/travel-guide', 70);
  end if;
end $$;