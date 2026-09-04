-- Add subtitle column to page_heroes for the Safari landing page hero.
-- Subtitle renders as an <h2> between the <h1> title and the intro paragraph,
-- giving editors a second vertical headline tier.

alter table public.page_heroes
  add column if not exists subtitle text;

-- Update the /safaris hero row to use the new split layout:
--   badge_text: "Uganda Safari Packages"
--   title:      "Choose Proven Route"
--   subtitle:   "Make It Yours"
-- This replaces the old single title "Choose a proven route, then make it yours".
update public.page_heroes
set
  badge_text = 'Uganda Safari Packages',
  title      = 'Choose Proven Route',
  subtitle   = 'Make It Yours',
  updated_at = now()
where page_slug = '/safaris'
  and status = 'published';

-- ---------------------------------------------------------------------------
-- Seed a new "safari_intro" content section for the /safaris landing page.
-- This sits between the hero and the filter/safari-grid section and is
-- editable from the admin content sections UI.
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
  '/safaris',
  'safari_intro',
  'content_split',
  'Why choose Jackfruit Safaris for your Uganda safari?',
  'Safari intro',
  $json${
    "intro": "Uganda's compact geography lets you track mountain gorillas in Bwindi, watch tree-climbing lions in Queen Elizabeth, and raft the Nile at Jinja — all within a two-week loop. Known as the 'Pearl of Africa' since Churchill's 1907 visit, Uganda is one of only ten countries where mountain gorilla trekking is possible, with roughly half the world's population living in Bwindi Impenetrable National Park. Jackfruit Safaris turns that density of experience into a single smooth trip: private 4x4 vehicles, local driver-guides who handle permits and lodge logistics, and routes that adjust to your dates, pace, and budget — from three-day gorilla getaways to full 10-day circuits.",
    "body": "<p><strong>Private, flexible, and fully supported</strong> — every package can be adjusted for start point, lodge tier, activity mix, and final night. Whether you want a focused 3-day gorilla trek, a 3-day Murchison Falls wildlife loop, or a 10-day circuit covering Lake Mburo, chimp tracking in Kibale, Queen Elizabeth's Kazinga Channel cruise, and Lake Bunyonyi relaxation, Jackfruit Safaris plans it from Jinja with clear inclusions, live permit checks, and WhatsApp support before and during your trip.</p>"
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
