-- Jackfruit Safaris — landing hero + listing section copy polish
-- Purpose: remove internal/admin-jargon and duplicate headline pairs that are
-- visible on live listing pages; keep the brand theme and stacked
-- h1/h2 hero structure exactly as built. Traveler-facing copy only.
--
-- Force-updates (not coalesce) so previously seeded jargon is replaced on
-- live sites that already ran the earlier seed migrations.
--
-- Pages touched:
--   /destinations, /safaris, /experiences, /travel-guide, /reviews (page_heroes)
--   destination_grid, experience_grid rows (page_content_sections intro/title)

-- ---------------------------------------------------------------------------
-- 1. Landing page heroes — traveler-facing title/subtitle/intro pairs.
--    Rate: keep each pair complementary (h1 sets the frame, h2 completes it;
--    never repeats the h1's tail). Intros speak to the traveler, not to the
--    editorial process.
-- ---------------------------------------------------------------------------

update public.page_heroes
set
  badge_text = 'Destinations',
  title      = 'Uganda Safari Places',
  subtitle   = 'Chosen For Your Route',
  intro      = 'Gorilla forests, Rift Valley savannah, chimpanzee country, highland lakes, and the source of the Nile — browse the places Jackfruit Safaris knows road by road, then tell us the mix you want.',
  updated_at = now()
where page_slug = '/destinations'
  and status = 'published';

update public.page_heroes
set
  badge_text = 'Safaris',
  title      = 'Choose A Proven Route',
  subtitle   = 'Then Make It Yours',
  intro      = 'Three days or two weeks — start from a route that already works, then adjust lodges, pace, and comfort level with your private Jinja-based planning team.',
  updated_at = now()
where page_slug = '/safaris'
  and status = 'published';

update public.page_heroes
set
  badge_text = 'Experiences',
  title      = 'Choose Your Experience',
  subtitle   = 'Then Tie It Together',
  intro      = 'Primate tracking, savannah game drives, Nile adventure, cultural encounters, and dependable transport — one team connects the pieces into a realistic itinerary.',
  updated_at = now()
where page_slug = '/experiences'
  and status = 'published';

update public.page_heroes
set
  badge_text = 'Travel Guide',
  title      = 'Practical Travel Articles',
  subtitle   = 'That Answer Your Questions',
  intro      = 'Permits, park fees, packing, transport, and route planning — practical Uganda travel notes written by the Jinja team that drives these routes.',
  updated_at = now()
where page_slug = '/travel-guide'
  and status = 'published';

update public.page_heroes
set
  badge_text = 'Reviews',
  title      = 'Hear From Travelers',
  subtitle   = 'Who Explored Uganda With Us',
  intro      = 'First-hand accounts from guests who travelled with Jackfruit Safaris — shared with permission, kept honest.',
  updated_at = now()
where page_slug = '/reviews'
  and status = 'published';

-- ---------------------------------------------------------------------------
-- 2. Listing page card-grid sections - replace admin-note eyebrow/title text
--    with traveler-facing labels. Force-update so earlier seeded jargon is
--    replaced. NOTE: page_content_sections has NO intro column - the intro
--    paragraph for /destinations renders from the separate 'destination_intro'
--    section's content key, and /experiences intro from 'experience_intro';
--    only title/subtitle (used as grid text + eyebrow) are touched here.
-- ---------------------------------------------------------------------------

update public.page_content_sections
set
  title = 'Uganda''s premier adventure destinations',
  subtitle = 'Explore the Pearl of Africa',
  updated_at = now()
where section_type = 'entity_card_grid'
  and page_slug = '/destinations';

update public.page_content_sections
set
  title = 'Choose your next Uganda experience',
  subtitle = 'What you can do on safari',
  updated_at = now()
where section_type = 'entity_card_grid'
  and page_slug = '/experiences';
