-- Add subtitle (h2) to destination detail page heroes for vertical headline style.
-- This adds a complementary subtitle beneath each destination name (h1) in the HeroSection,
-- matching the pattern used on /safaris and /experiences landing pages.

update public.page_heroes
set
  subtitle = 'Mountain gorilla sanctuary',
  updated_at = now()
where page_slug = '/destinations/bwindi-impenetrable-national-park'
  and status = 'published';

update public.page_heroes
set
  subtitle = 'Where the Nile thunders through the Rift',
  updated_at = now()
where page_slug = '/destinations/murchison-falls-national-park'
  and status = 'published';

update public.page_heroes
set
  subtitle = 'Diverse wildlife and dramatic landscapes',
  updated_at = now()
where page_slug = '/destinations/queen-elizabeth-national-park'
  and status = 'published';

update public.page_heroes
set
  subtitle = 'Chimpanzee tracking in misty rainforest',
  updated_at = now()
where page_slug = '/destinations/kibale-forest-national-park'
  and status = 'published';

update public.page_heroes
set
  subtitle = 'Walk safaris and zebra herds',
  updated_at = now()
where page_slug = '/destinations/lake-mburo-national-park'
  and status = 'published';

update public.page_heroes
set
  subtitle = 'Terraced hills and island canoes',
  updated_at = now()
where page_slug = '/destinations/lake-bunyonyi'
  and status = 'published';

update public.page_heroes
set
  subtitle = 'Adventure capital at the Nile''s source',
  updated_at = now()
where page_slug = '/destinations/jinja-source-of-the-nile'
  and status = 'published';
