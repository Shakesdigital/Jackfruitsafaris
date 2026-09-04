-- Fix spelling: change "premiere" to "premier" in destination grid section titles.
-- This corrects the wording to match the user's requested "Uganda's premier adventure destinations".

update public.page_content_sections
set
  title = 'Uganda''s premier adventure destinations',
  content = jsonb_set(
    content,
    '{fallback_title}',
    '"Uganda''s premier adventure destinations"'
  ),
  updated_at = now()
where page_slug = '/destinations'
  and section_key = 'destination_grid'
  and status = 'published';

-- Also sync to pages.sections JSONB
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
  where page_slug = '/destinations'
  group by page_slug
) as section_rows
where p.slug = section_rows.page_slug;
