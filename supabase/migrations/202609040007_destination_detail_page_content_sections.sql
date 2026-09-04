-- Seed destination_intro content sections for destination detail pages.
-- These provide a CMS-editable "Destination Overview" section heading and
-- body text for each destination, separate from the hero intro.

do $$
declare
  dest_record record;
begin
  for dest_record in
    select slug, overview, region, name
    from public.destinations
    where slug in (
      'bwindi-impenetrable-national-park',
      'murchison-falls-national-park',
      'queen-elizabeth-national-park',
      'kibale-forest-national-park',
      'lake-mburo-national-park',
      'lake-bunyonyi',
      'jinja-source-of-the-nile'
    )
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
      content      = excluded.content || public.page_content_sections.content,
      order_index  = excluded.order_index,
      status       = excluded.status,
      updated_at   = now();
  end loop;
end $$;

-- Sync the new content sections into pages.sections JSONB for each destination page
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
