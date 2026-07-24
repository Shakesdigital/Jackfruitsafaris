-- Add homepage-specific fields to site_settings
alter table public.site_settings add column if not exists hero_title text;
alter table public.site_settings add column if not exists hero_subtitle text;
alter table public.site_settings add column if not exists badge_text text;
alter table public.site_settings add column if not exists cta_primary text;
alter table public.site_settings add column if not exists cta_secondary text;
alter table public.site_settings add column if not exists why_uganda_eyebrow text;
alter table public.site_settings add column if not exists why_uganda_title text;
alter table public.site_settings add column if not exists why_uganda_intro text;
alter table public.site_settings add column if not exists why_uganda_paragraph text;
alter table public.site_settings add column if not exists cta_eyebrow text;
alter table public.site_settings add column if not exists cta_title text;
alter table public.site_settings add column if not exists cta_intro text;
alter table public.site_settings add column if not exists cta_button text;

-- Update seeded settings with homepage-specific values
update public.site_settings set
  hero_title = 'Explore Uganda With Local Safari Experts',
  hero_subtitle = 'Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris Uganda from Jinja.',
  badge_text = 'Local safari experts from Jinja',
  cta_primary = 'Plan My Safari',
  cta_secondary = 'View Safari Packages',
  why_uganda_eyebrow = 'Why Uganda',
  why_uganda_title = 'One compact country, many safari worlds',
  why_uganda_intro = 'Uganda can take you from the River Nile to open savannah, roaring waterfalls, crater lakes, rainforest chimpanzees, and mountain gorillas in one carefully routed journey.',
  why_uganda_paragraph = 'Jackfruit Safaris helps you experience Uganda smoothly, with local guides who understand the roads, parks, permits, lodges, and small details that make a trip feel effortless.',
  cta_eyebrow = 'Ready to plan?',
  cta_title = 'Tell us your dates, group size, budget, and dream experiences.',
  cta_intro = 'Jackfruit Safaris will recommend the best route and quote, with clear inclusions, exclusions, and items that need live checking.',
  cta_button = 'Request a Custom Quote'
where business_name = 'Jackfruit Safaris Uganda';