-- Seed all hardcoded frontend content into CMS tables
-- This migration adds page heroes and homepage content
-- Safe to run multiple times with guarded seed inserts and upserts.

-- Reconcile frontend-facing columns that may not exist if this seed is run
-- directly in Supabase or after a partially completed migration sequence.
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_title text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_subtitle text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge_text text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_primary text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_secondary text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS why_uganda_eyebrow text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS why_uganda_title text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS why_uganda_intro text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS why_uganda_paragraph text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_eyebrow text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_title text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_intro text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_button text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_tagline text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_note text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS nav_items jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_image text;
ALTER TABLE public.safari_packages ADD COLUMN IF NOT EXISTS featured_image_url text;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS featured_image_url text;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS featured_image_url text;

-- Update site_settings with homepage fields (already exists, updating)
UPDATE public.site_settings SET
  hero_title = coalesce(hero_title, 'Explore Uganda With Local Safari Experts'),
  hero_subtitle = coalesce(hero_subtitle, 'Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris Uganda from Jinja.'),
  badge_text = coalesce(badge_text, 'Local safari experts from Jinja'),
  cta_primary = coalesce(cta_primary, 'Plan My Safari'),
  cta_secondary = coalesce(cta_secondary, 'View Safari Packages'),
  why_uganda_eyebrow = coalesce(why_uganda_eyebrow, 'Why Uganda'),
  why_uganda_title = coalesce(why_uganda_title, 'One compact country, many safari worlds'),
  why_uganda_intro = coalesce(why_uganda_intro, 'Uganda can take you from the River Nile to open savannah, roaring waterfalls, crater lakes, rainforest chimpanzees, and mountain gorillas in one carefully routed journey.'),
  why_uganda_paragraph = coalesce(why_uganda_paragraph, 'Jackfruit Safaris helps you experience Uganda smoothly, with local guides who understand the roads, parks, permits, lodges, and small details that make a trip feel effortless.'),
  cta_eyebrow = coalesce(cta_eyebrow, 'Ready to plan?'),
  cta_title = coalesce(cta_title, 'Tell us your dates, group size, budget, and dream experiences.'),
  cta_intro = coalesce(cta_intro, 'Jackfruit Safaris will recommend the best route and quote, with clear inclusions, exclusions, and items that need live checking.'),
  cta_button = coalesce(cta_button, 'Request a Custom Quote'),
  footer_tagline = coalesce(footer_tagline, 'Private Uganda safaris, gorilla trekking, Nile adventures, culture, and reliable transport planned from Jinja.'),
  footer_note = coalesce(footer_note, 'Prices are shown as planning guidance and remain subject to permit, park fee, lodge, and vehicle availability at the time of quotation.'),
  nav_items = coalesce(nav_items, jsonb_build_array(
    jsonb_build_object('label', 'Home', 'href', '/'),
    jsonb_build_object('label', 'Safaris', 'href', '/safaris'),
    jsonb_build_object('label', 'Destinations', 'href', '/destinations'),
    jsonb_build_object('label', 'Experiences', 'href', '/experiences/gorilla-trekking'),
    jsonb_build_object('label', 'About', 'href', '/about'),
    jsonb_build_object('label', 'Travel Guide', 'href', '/travel-guide')
  )),
  hero_image = coalesce(hero_image, 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82')
WHERE business_name = 'Jackfruit Safaris Uganda';

-- Seed page heroes for all secondary pages
INSERT INTO public.page_heroes (page_slug, eyebrow, title, intro, status) VALUES
  ('/safaris', 'Uganda safari packages', 'Choose a proven route, then make it yours', 'Whether you have three days or two weeks, Jackfruit Safaris can help you experience Uganda''s landscapes and wildlife as budget, mid-range, or luxury private trips.', 'published'),
  ('/destinations', 'Destinations', 'Uganda safari places, routed with care', 'Destination pages give travelers the practical why go, best time, recommended nights, and related route context they need before requesting a quote.', 'published'),
  ('/experiences', 'Experiences', 'Build your Uganda trip around the moments that matter', 'Choose primates, wildlife, Nile adventure, cultural visits, or reliable transport, then ask Jackfruit Safaris to connect the pieces into a realistic itinerary.', 'published'),
  ('/about', 'About Jackfruit Safaris Uganda', 'Local roots, practical planning, and warm guest care', 'Jackfruit Safaris Uganda is a registered tour company based in Jinja, one of Uganda''s most exciting travel hubs and the adventure capital of East Africa.', 'published'),
  ('/reviews', 'Guest reviews', 'Hear from travelers who explored Uganda with Jackfruit Safaris', 'Review content imported only with permission or embedded according to review platform rules. The CMS includes permission and source fields for that reason.', 'published'),
  ('/travel-guide', 'Uganda safari travel guide', 'Practical articles that answer booking questions', 'These are ready as CMS article topics for SEO, buyer education, and AI-search visibility.', 'published')
ON CONFLICT (page_slug) DO UPDATE SET
  eyebrow = coalesce(public.page_heroes.eyebrow, EXCLUDED.eyebrow),
  title = coalesce(public.page_heroes.title, EXCLUDED.title),
  intro = coalesce(public.page_heroes.intro, EXCLUDED.intro);

-- Seed homepage sections
INSERT INTO public.homepage_sections (section_type, title, subtitle, content, order_index, status)
SELECT
  seed.section_type,
  seed.title,
  seed.subtitle,
  seed.content,
  seed.order_index,
  seed.status::public.content_status
FROM (VALUES
  ('hero', 'Explore Uganda With Local Safari Experts', 'Local safari experts from Jinja',
   jsonb_build_object(
     'subtitle', 'Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris Uganda from Jinja.',
     'cta_primary', 'Plan My Safari',
     'cta_secondary', 'View Safari Packages'
   ), 1, 'published'),
  ('trust_bar', NULL, NULL, '{}'::jsonb, 2, 'published'),
  ('why_uganda', 'One compact country, many safari worlds', 'Uganda can take you from the River Nile to open savannah, roaring waterfalls, crater lakes, rainforest chimpanzees, and mountain gorillas in one carefully routed journey.',
   jsonb_build_object('paragraph', 'Jackfruit Safaris helps you experience Uganda smoothly, with local guides who understand the roads, parks, permits, lodges, and small details that make a trip feel effortless.'), 3, 'published'),
  ('featured_safaris', 'Start with a proven Uganda route', 'Choose a ready itinerary or ask Jackfruit Safaris to adjust the route, dates, accommodation tier, and pace around your group.', '{}'::jsonb, 4, 'published'),
  ('experiences', 'The right trip for your travel style', 'Jackfruit Safaris can combine wildlife, primates, Nile adventure, culture, and transport into a single smooth plan.', '{}'::jsonb, 5, 'published'),
  ('reviews', 'Confidence before the first road mile', 'The new inquiry flow puts trust, price guidance, route logic, and WhatsApp access close to every major booking decision.', '{}'::jsonb, 6, 'published'),
  ('travel_guide', 'Helpful planning content for safari buyers', 'Priority guide topics are ready for CMS publishing, SEO expansion, and AI-search visibility.', '{}'::jsonb, 7, 'published'),
  ('cta', 'Ready to plan?', NULL,
   jsonb_build_object(
     'box_title', 'Tell us your dates, group size, budget, and dream experiences.',
     'button_label', 'Request a Custom Quote'
   ), 8, 'published')
) AS seed(section_type, title, subtitle, content, order_index, status)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.homepage_sections existing
  WHERE existing.section_type = seed.section_type
);

-- Seed trust items
INSERT INTO public.homepage_trust_items (text, order_index, status)
SELECT
  seed.text,
  seed.order_index,
  seed.status::public.content_status
FROM (VALUES
  ('2024 Tripadvisor Travelers'' Choice Award', 1, 'published'),
  ('Registered tour company based in Jinja, Uganda', 2, 'published'),
  ('Private and custom safari planning', 3, 'published'),
  ('WhatsApp support before and during your trip', 4, 'published')
) AS seed(text, order_index, status)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.homepage_trust_items existing
  WHERE existing.text = seed.text
);

-- Seed quick links
INSERT INTO public.homepage_quick_links (label, href, order_index, status)
SELECT
  seed.label,
  seed.href,
  seed.order_index,
  seed.status::public.content_status
FROM (VALUES
  ('Gorilla Trekking', '/experiences/gorilla-trekking', 1, 'published'),
  ('Murchison Falls', '/safaris/3-days-murchison-falls', 2, 'published'),
  ('10 Days Uganda', '/safaris/10-days-uganda-safari', 3, 'published'),
  ('Jinja Activities', '/experiences/jinja-adventures', 4, 'published'),
  ('Airport Transfer', '/transport/airport-transfers', 5, 'published')
) AS seed(label, href, order_index, status)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.homepage_quick_links existing
  WHERE existing.label = seed.label
    AND existing.href = seed.href
);

-- Seed features (Why Uganda section)
INSERT INTO public.homepage_features (icon_name, text, order_index, status)
SELECT
  seed.icon_name,
  seed.text,
  seed.order_index,
  seed.status::public.content_status
FROM (VALUES
  ('check', 'Private, flexible trips', 1, 'published'),
  ('check', 'Clear package inclusions', 2, 'published'),
  ('check', 'Permit and lodge guidance', 3, 'published'),
  ('check', 'Warm care from arrival to departure', 4, 'published')
) AS seed(icon_name, text, order_index, status)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.homepage_features existing
  WHERE existing.text = seed.text
);

-- Seed guide articles
INSERT INTO public.homepage_guide_articles (title, order_index, status)
SELECT
  seed.title,
  seed.order_index,
  seed.status::public.content_status
FROM (VALUES
  ('Best Time to Visit Uganda for Safari and Gorilla Trekking', 1, 'published'),
  ('Gorilla Trekking Permit Guide', 2, 'published'),
  ('What to Pack for a Uganda Safari', 3, 'published'),
  ('How Many Days Do You Need in Uganda?', 4, 'published'),
  ('Murchison Falls Safari Guide', 5, 'published'),
  ('Jinja Adventure Guide', 6, 'published'),
  ('Uganda Safari Costs: Budget, Mid-Range, and Luxury', 7, 'published'),
  ('Entebbe to Jinja Travel Guide', 8, 'published'),
  ('Family Safari in Uganda', 9, 'published'),
  ('Is Uganda Safe for Safari Travelers?', 10, 'published')
) AS seed(title, order_index, status)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.homepage_guide_articles existing
  WHERE existing.title = seed.title
);

-- Ensure safari_packages have featured_image_url populated (they already exist, just update if null)
UPDATE public.safari_packages SET
  featured_image_url = CASE
    WHEN slug = '3-days-gorilla-tracking' THEN 'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = '3-days-murchison-falls' THEN 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = '10-days-uganda-safari' THEN 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'custom-uganda-safari' THEN 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'
  END
WHERE featured_image_url IS NULL OR featured_image_url = '';

-- Ensure experiences have featured_image_url
UPDATE public.experiences SET
  featured_image_url = CASE
    WHEN slug = 'gorilla-trekking' THEN 'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'jinja-adventures' THEN 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'cultural-experiences' THEN 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'wildlife-safaris' THEN 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82'
  END
WHERE featured_image_url IS NULL OR featured_image_url = '';

-- Ensure destinations have images
UPDATE public.destinations SET
  featured_image_url = CASE
    WHEN slug = 'bwindi-impenetrable-national-park' THEN 'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'murchison-falls-national-park' THEN 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'queen-elizabeth-national-park' THEN 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'kibale-forest-national-park' THEN 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'lake-mburo-national-park' THEN 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'lake-bunyonyi' THEN 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82'
    WHEN slug = 'jinja-source-of-the-nile' THEN 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'
  END
WHERE featured_image_url IS NULL OR featured_image_url = '';
