-- Allow public visitors to render published CMS navigation.

drop policy if exists "public read published menus" on public.menus;
create policy "public read published menus"
on public.menus
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "public read published menu items" on public.menu_items;
create policy "public read published menu items"
on public.menu_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.menus
    where menus.id = menu_items.menu_id
      and menus.status = 'published'
  )
);

grant select on public.menus to anon, authenticated;
grant select on public.menu_items to anon, authenticated;
