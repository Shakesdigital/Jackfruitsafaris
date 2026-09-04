-- Experiences landing page: split hero title into vertical title + subtitle
-- (mirroring the /safaris hero restructure), and seed an experience_intro
-- content section between the hero and the experience cards.
-- Sub-title renders as an <h2> between the <h1> title and the intro paragraph,
-- giving editors a second vertical headline tier.

-- ---------------------------------------------------------------------------
-- 1. Update the /experiences page_heroes row to use the new split layout:
--    badge_text: "Experiences"
--    title:      "Choose Your Experience"
--    subtitle:   "Make It Yours"
--    This replaces the old single title
--    "Build your Uganda trip around the moments that matter".
-- ---------------------------------------------------------------------------

update public.page_heroes
set
  badge_text = 'Experiences',
  title      = 'Choose Your Experience',
  subtitle   = 'Make It Yours',
  updated_at = now()
where page_slug = '/experiences'
  and status = 'published';

-- ---------------------------------------------------------------------------
-- 2. Seed a new "experience_intro" content section for the /experiences landing page.
--    This sits between the hero and the experience-grid cards section and is
--    editable from the admin content sections UI.
-- ---------------------------------------------------------------------------

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
  '/experiences',
  'experience_intro',
  'rich_text',
  'Why choose Jackfruit Safaris for your Uganda experiences?',
  'Experience Uganda',
  $json${
    "intro": "Uganda's experiences span mountain gorilla tracking in misty Bwindi, wildlife safaris across Murchison Falls and Queen Elizabeth, white-water rafting on the Nile at Jinja, cultural encounters with local communities, and reliable transport between parks. Jackfruit Safaris matches these activities to your available time, transfer point, safety needs, and comfort level, then connects the pieces into a realistic itinerary — whether you have three days or two weeks.",
    "body": "<p><strong>Flexible, fully supported, and locally guided</strong> — every experience can be combined and adjusted for start point, lodge tier, activity mix, and final night. Whether you want focused gorilla trekking, a Nile adventure day in Jinja, cultural immersion in local villages, or reliable airport transfers as standalone add-ons, Jackfruit Safaris plans it from Jinja with clear inclusions, live activity checks, and WhatsApp support before and during your trip.</p>"
  }$json$::jsonb,
  15,
  'published'::public.content_status
)
on conflict (page_slug, section_key) do update
set
  section_type = excluded.section_type,
  title        = excluded.title,
  subtitle     = excluded.subtitle,
  content      = excluded.content,
  order_index  = excluded.order_index,
  status       = excluded.status,
  updated_at   = now();

-- ---------------------------------------------------------------------------
-- 3. Sync page_content_sections to the pages.sections JSONB column for /experiences
-- ---------------------------------------------------------------------------

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
  where page_slug = '/experiences'
  group by page_slug
) as section_rows
where p.slug = section_rows.page_slug;
