-- Add footer fields to site_settings for CMS editing
alter table public.site_settings add column if not exists footer_tagline text;
alter table public.site_settings add column if not exists footer_note text;
alter table public.site_settings add column if not exists nav_items jsonb;

-- Update seeded settings with footer values
update public.site_settings set
  footer_tagline = 'Private Uganda safaris, gorilla trekking, Nile adventures, culture, and reliable transport planned from Jinja.',
  footer_note = 'Prices are shown as planning guidance and remain subject to permit, park fee, lodge, and vehicle availability at the time of quotation.',
  nav_items = jsonb_build_array(
    jsonb_build_object('label', 'Home', 'href', '/'),
    jsonb_build_object('label', 'Safaris', 'href', '/safaris'),
    jsonb_build_object('label', 'Destinations', 'href', '/destinations'),
    jsonb_build_object('label', 'Experiences', 'href', '/experiences/gorilla-trekking'),
    jsonb_build_object('label', 'About', 'href', '/about'),
    jsonb_build_object('label', 'Reviews', 'href', '/reviews'),
    jsonb_build_object('label', 'Travel Guide', 'href', '/travel-guide')
  )
where business_name = 'Jackfruit Safaris Uganda';