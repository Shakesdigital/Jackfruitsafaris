-- Hero vertical headlines + CMS consistency fixes
-- Splits long hero titles into stacked h1 title + h2 subtitle across all
-- landing pages, matching the pattern established on /safaris and /experiences.
-- Also removes the word "cards" from destinations grid section copy.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Add hero_subtitle_heading to site_settings for the homepage h2 subtitle.
--    The homepage hero reads title/badge/intro from site_settings, so this
--    column provides the second vertical headline tier (h2) for the homepage
--    hero, keeping all homepage hero data in one table.
-- ---------------------------------------------------------------------------

alter table public.site_settings
  add column if not exists hero_subtitle_heading text;

update public.site_settings
set
  hero_title            = coalesce(hero_title, 'Explore Uganda'),
  hero_subtitle_heading = coalesce(hero_subtitle_heading, 'With Local Safari Experts'),
  hero_subtitle         = coalesce(hero_subtitle, 'Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris from Jinja.'),
  badge_text            = coalesce(badge_text, 'Local safari experts from Jinja'),
  cta_primary           = coalesce(cta_primary, 'Plan My Safari'),
  cta_secondary         = coalesce(cta_secondary, 'View Safari Packages'),
  hero_image            = coalesce(hero_image, 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82')
where business_name = 'Jackfruit Safaris';

-- ---------------------------------------------------------------------------
-- 2. Update the homepage page_heroes row for consistency (subtitle column exists
--    from the safari migration). This row is not used by the homepage page.tsx
--    but keeps the CMS editor data consistent if someone edits "/" there.
-- ---------------------------------------------------------------------------

update public.page_heroes
set
  badge_text = coalesce(badge_text, 'Local safari experts from Jinja'),
  title      = coalesce(title, 'Explore Uganda'),
  subtitle   = coalesce(subtitle, 'With Local Safari Experts'),
  updated_at = now()
where page_slug = '/'
  and status = 'published';

-- ---------------------------------------------------------------------------
-- 3. Split the remaining landing-page hero titles into stacked h1 + h2.
--    Each row gets a short punchy title (h1) and a complementary subtitle (h2).
-- ---------------------------------------------------------------------------

-- Destinations
update public.page_heroes
set
  badge_text = coalesce(badge_text, 'Destinations'),
  title      = coalesce(title, 'Uganda Safari Places'),
  subtitle   = coalesce(subtitle, 'Routed With Care'),
  intro      = coalesce(intro, 'Destination pages give travelers the practical why go, best time, recommended nights, and related route context they need before requesting a quote.'),
  updated_at = now()
where page_slug = '/destinations'
  and status = 'published';

-- About
update public.page_heroes
set
  badge_text = coalesce(badge_text, 'About Jackfruit Safaris'),
  title      = coalesce(title, 'Local Roots, Practical Planning'),
  subtitle   = coalesce(subtitle, 'Warm Guest Care'),
  updated_at = now()
where page_slug = '/about'
  and status = 'published';

-- Reviews
update public.page_heroes
set
  badge_text = coalesce(badge_text, 'Guest reviews'),
  title      = coalesce(title, 'Hear From Travelers'),
  subtitle   = coalesce(subtitle, 'Who Explored Uganda With Jackfruit Safaris'),
  intro      = coalesce(intro, 'Review content imported only with permission or embedded according to review platform rules. The CMS includes permission and source fields for that reason.'),
  updated_at = now()
where page_slug = '/reviews'
  and status = 'published';

-- Travel Guide
update public.page_heroes
set
  badge_text = coalesce(badge_text, 'Uganda safari travel guide'),
  title      = coalesce(title, 'Practical Travel Articles'),
  subtitle   = coalesce(subtitle, 'That Answer Your Booking Questions'),
  intro      = coalesce(intro, 'These are ready as CMS article topics for SEO, buyer education, and AI-search visibility.'),
  updated_at = now()
where page_slug = '/travel-guide'
  and status = 'published';

-- Contact
update public.page_heroes
set
  badge_text = coalesce(badge_text, 'Contact Jackfruit Safaris'),
  title      = coalesce(title, 'Plan Your Uganda Safari'),
  subtitle   = coalesce(subtitle, 'Send us your travel details'),
  intro      = coalesce(intro, 'Send your travel details and Jackfruit Safaris will help you choose the right safari, activity, transfer, or custom itinerary.'),
  updated_at = now()
where page_slug = '/contact'
  and status = 'published';

-- Request Quote
update public.page_heroes
set
  badge_text = coalesce(badge_text, 'Request a quote'),
  title      = coalesce(title, 'Tell Us What You Want'),
  subtitle   = coalesce(subtitle, 'From Uganda'),
  intro      = coalesce(intro, 'Dates, group size, budget, activity interests, and comfort level are enough to start a practical route recommendation.'),
  updated_at = now()
where page_slug = '/request-quote'
  and status = 'published';

-- Transport / Airport Transfers
update public.page_heroes
set
  badge_text = coalesce(badge_text, 'Transport'),
  title      = coalesce(title, 'Airport Pickups and Transport'),
  subtitle   = coalesce(subtitle, 'Reliable, professional service'),
  intro      = coalesce(intro, 'Reliable airport pickups, hotel transfers, Jinja transfers, and safari transport with professional drivers.'),
  updated_at = now()
where page_slug = '/transport/airport-transfers'
  and status = 'published';

-- ---------------------------------------------------------------------------
-- 4. Remove the word "cards" from destination_grid, review_grid, and
--    guide_topic_grid page_content_sections so the Destinations page (and
--    other landing pages) say "Destinations" instead of "cards".
-- ---------------------------------------------------------------------------

-- Destinations grid section
update public.page_content_sections
set
  title   = 'Uganda''s premiere adventure destinations',
  subtitle = 'Handpicked destinations across Uganda. Each leads to a full detail page with overview, activities, how-to-get-there, key highlights, and related safaris.',
  content = content || jsonb_build_object(
    'fallback_title', 'Uganda''s premiere adventure destinations'
  ),
  updated_at = now()
where page_slug = '/destinations'
  and section_key = 'destination_grid'
  and status = 'published';

-- Reviews grid section
update public.page_content_sections
set
  title   = 'Guest reviews',
  subtitle = 'Hear from travelers who explored Uganda with Jackfruit Safaris',
  updated_at = now()
where page_slug = '/reviews'
  and section_key = 'review_grid'
  and status = 'published';

-- Travel Guide grid section
update public.page_content_sections
set
  title   = 'Practical safari guide topics',
  subtitle = 'Planning articles on seasons, permits, packing, routes, costs, and Jinja travel',
  updated_at = now()
where page_slug = '/travel-guide'
  and section_key = 'guide_topic_grid'
  and status = 'published';

-- ---------------------------------------------------------------------------
-- 5. Sync page_content_sections changes into pages.sections JSONB for the
--    affected pages so the frontend (which reads pages.sections as a fallback)
--    picks up the new titles immediately.
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
  where page_slug in ('/destinations', '/reviews', '/travel-guide')
  group by page_slug
) as section_rows
where p.slug = section_rows.page_slug;
