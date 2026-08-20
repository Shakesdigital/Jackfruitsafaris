-- Update business name from "Jackfruit Safaris Uganda" to "Jackfruit Safaris"
-- on existing databases where the old name was already seeded

-- Update site_settings.business_name
update public.site_settings
set business_name = 'Jackfruit Safaris'
where business_name = 'Jackfruit Safaris Uganda';

-- Update footer_copy copyright text
update public.site_settings
set footer_copy = replace(footer_copy, 'Jackfruit Safaris Uganda Ltd.', 'Jackfruit Safaris Ltd.')
where footer_copy like '%Jackfruit Safaris Uganda%';

-- Update site_settings nav_items JSON (just in case business name was stored there)
update public.site_settings
set nav_items = REPLACE(nav_items::text, 'Jackfruit Safaris Uganda', 'Jackfruit Safaris')::jsonb
where nav_items is not null and nav_items::text like '%Jackfruit Safaris Uganda%';

-- Update page_heroes eyebrow and intro text
update public.page_heroes
set eyebrow = REPLACE(eyebrow, 'Jackfruit Safaris Uganda', 'Jackfruit Safaris'),
    intro = REPLACE(intro, 'Jackfruit Safaris Uganda', 'Jackfruit Safaris')
where eyebrow like '%Jackfruit Safaris Uganda%'
   or intro like '%Jackfruit Safaris Uganda%';

-- Update pages SEO metadata
update public.pages
set meta_title = REPLACE(meta_title, 'Jackfruit Safaris Uganda', 'Jackfruit Safaris'),
    meta_description = REPLACE(meta_description, 'Jackfruit Safaris Uganda', 'Jackfruit Safaris'),
    summary = REPLACE(summary, 'Jackfruit Safaris Uganda', 'Jackfruit Safaris')
where meta_title like '%Jackfruit Safaris Uganda%'
   or meta_description like '%Jackfruit Safaris Uganda%'
   or summary like '%Jackfruit Safaris Uganda%';

-- Update homepage_sections content JSONB (safe text replacement on JSON text)
update public.homepage_sections
set content = REPLACE(content::text, 'Jackfruit Safaris Uganda', 'Jackfruit Safaris')::jsonb
where content::text like '%Jackfruit Safaris Uganda%';

-- Update page_content_sections content JSONB (safe text replacement on JSON text)
update public.page_content_sections
set content = REPLACE(content::text, 'Jackfruit Safaris Uganda', 'Jackfruit Safaris')::jsonb
where content::text like '%Jackfruit Safaris Uganda%';
