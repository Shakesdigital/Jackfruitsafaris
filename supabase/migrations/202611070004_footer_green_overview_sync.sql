-- Jackfruit Safaris - footer green, healthy destination overviews, favicon
-- 1. Footer background -> #2f8f6c (harmonized logo green; white footer text
--    is auto-derived from the color's luminance by the app layout).
-- 2. Re-sync the per-destination "Destination overview" content sections from
--    the destinations.overview column. The detail page prefers the CMS section
--    row when one exists, so a stale row would keep overriding the full
--    editorial overview written into destinations.overview (by migration
--    202611070002). This update makes the section mirror the column again -
--    run or re-run this file AFTER 202611070002 any time overviews are edited.
-- 3. favicon_url -> /favicon.ico (the repo favicon built from the logo).
-- Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. Footer background color in CMS settings (column guarded)
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings'
      and column_name = 'footer_background_color'
  ) then
    update public.site_settings
    set footer_background_color = '#2f8f6c',
        updated_at = now();
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. "Destination overview" sections mirror destinations.overview
-- ---------------------------------------------------------------------------

do $dest_loop$
declare
  dest_record record;
begin
  for dest_record in
    select slug, name, region, overview
    from public.destinations
    where overview is not null and overview <> ''
  loop
    insert into public.page_content_sections (
      page_slug,
      section_key,
      section_type,
      title,
      subtitle,
      content,
      order_index,
      status
    ) values (
      '/destinations/' || dest_record.slug,
      'destination_overview',
      'content_split',
      'Destination overview',
      dest_record.region,
      jsonb_build_object(
        'intro', dest_record.overview,
        'title', 'Destination overview'
      ),
      1,
      'published'::public.content_status
    )
    on conflict (page_slug, section_key) do update
    set
      section_type = excluded.section_type,
      title        = excluded.title,
      subtitle     = excluded.subtitle,
      -- new overview copy wins over any admin-edited legacy text
      content      = jsonb_set(
                       coalesce(public.page_content_sections.content, '{}'::jsonb),
                       '{intro}',
                       to_jsonb(dest_record.overview::text)
                     ),
      order_index  = excluded.order_index,
      status       = excluded.status,
      updated_at   = now();
  end loop;
end $dest_loop$;

-- Mirror the refreshed sections into pages.sections (same shape the CMS
-- pages-content interface reads), as the original seeding migration did.
update public.pages as p
set sections = section_rows.sections,
    updated_at = now()
from (
  select
    case page_slug
      when '/' then 'home'
      else trim(leading '/' from page_slug)
    end as page_slug,
    jsonb_agg(
      jsonb_build_object(
        'key', section_key,
        'type', section_type,
        'title', title,
        'subtitle', subtitle,
        'content', content,
        'order_index', order_index,
        'status', status
      )
      order by order_index
    ) as sections
  from public.page_content_sections
  where page_slug like '/destinations/%'
  group by page_slug
) as section_rows
where p.slug = section_rows.page_slug;

-- ---------------------------------------------------------------------------
-- 3. Favicon from the logo (repo file)
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings'
      and column_name = 'favicon_url'
  ) then
    update public.site_settings
    set favicon_url = '/favicon.ico',
        updated_at = now();
  end if;
end $$;
