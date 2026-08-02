-- CMS coverage for missing landing pages: Contact, Request Quote, Airport Transfers
-- These pages currently use hardcoded content and need CMS-managed sections

create extension if not exists "pgcrypto";

-- Add page hero entries for missing landing pages
insert into public.page_heroes (page_slug, eyebrow, title, intro, background_image, status) values
('/contact', 'Contact', 'Plan Your Uganda Safari',
 'Send your travel details and Jackfruit Safaris will help you choose the right safari, activity, transfer, or custom itinerary.',
 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82', 'published'),

('/request-quote', 'Request quote', 'Tell Jackfruit Safaris what you want from Uganda',
 'Dates, group size, budget, activity interests, and comfort level are enough to start a practical route recommendation.',
 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82', 'published'),

('/transport/airport-transfers', 'Transport', 'Airport Pickups and Transport Services',
 'Reliable airport pickups, hotel transfers, Jinja transfers, and safari transport with professional drivers.',
 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82', 'published')
on conflict (page_slug) do update
set eyebrow = coalesce(public.page_heroes.eyebrow, excluded.eyebrow),
    title = coalesce(public.page_heroes.title, excluded.title),
    intro = coalesce(public.page_heroes.intro, excluded.intro),
    background_image = coalesce(public.page_heroes.background_image, excluded.background_image),
    status = coalesce(public.page_heroes.status, excluded.status),
    updated_at = now();

-- Add page content sections for Contact page
insert into public.page_content_sections (
    page_slug, section_key, section_type, title, subtitle, content, order_index, status
) values
(
    '/contact',
    'contact_info',
    'contact_info_grid',
    'Get in Touch',
    'We\'d love to hear from you',
    $json${
        "intro": "Contact Jackfruit Safaris Uganda by email, phone, WhatsApp, or inquiry form for safaris, Jinja activities, and airport transfers.",
        "items": [
            {
                "icon": "Mail",
                "label": "Email",
                "value_source": "site_settings.contact_email",
                "fallback": "jackfruitsafarisuganda@gmail.com"
            },
            {
                "icon": "Phone",
                "label": "Phone/WhatsApp",
                "value_source": "site_settings.phone",
                "fallback": "+256 772 550 268"
            },
            {
                "icon": "Phone",
                "label": "Alternate phone",
                "value_source": "site_settings.alternate_phone",
                "fallback": "+256 752 550 268"
            },
            {
                "icon": "MapPin",
                "label": "Location",
                "value_source": "site_settings.address",
                "fallback": "Craft Village, Jinja, Uganda"
            }
        ],
        "form_source_page": "contact"
    }$json$::jsonb,
    10,
    'published'::public.content_status
),
(
    '/contact',
    'quote_form',
    'quote_form',
    'Contact Quote Form',
    'Quote form on the Contact page',
    $json${
        "source_page": "contact",
        "variant": "standard"
    }$json$::jsonb,
    20,
    'published'::public.content_status
)

on conflict (page_slug, section_key) do update
set section_type = excluded.section_type,
    title = excluded.title,
    subtitle = excluded.subtitle,
    content = excluded.content,
    order_index = excluded.order_index,
    status = excluded.status,
    updated_at = now();

-- Add page content sections for Request Quote page
insert into public.page_content_sections (
    page_slug, section_key, section_type, title, subtitle, content, order_index, status
) values
(
    '/request-quote',
    'info_cards',
    'info_card_grid',
    'What to Expect',
    'Our process is transparent from start to finish',
    $json${
        "items": [
            {
                "icon": "Clock",
                "title": "What happens next",
                "body": "The team reviews your dates, preferred pace, route logic, permits, and lodge level before sending the next planning step."
            },
            {
                "icon": "ShieldCheck",
                "title": "What gets verified",
                "body": "Gorilla and chimp permits, park fees, lodge availability, vehicle routing, and optional activity schedules are confirmed before the final quote."
            },
            {
                "icon": "MessageCircle",
                "title": "Prefer WhatsApp?",
                "body": "Contact us directly on WhatsApp for faster responses: +256 772 550 268",
                "value_source": "site_settings.whatsapp_number",
                "fallback": "+256 772 550 268"
            }
        ],
        "layout": "three_column_cards"
    }$json$::jsonb,
    10,
    'published'::public.content_status
),
(
    '/request-quote',
    'quote_form',
    'quote_form',
    'Request Quote Form',
    'Main quote form on the Request Quote page',
    $json${
        "source_page": "request-quote",
        "variant": "standard"
    }$json$::jsonb,
    20,
    'published'::public.content_status
)

on conflict (page_slug, section_key) do update
set section_type = excluded.section_type,
    title = excluded.title,
    subtitle = excluded.subtitle,
    content = excluded.content,
    order_index = excluded.order_index,
    status = excluded.status,
    updated_at = now();

-- Add page content sections for Airport Transfers page
insert into public.page_content_sections (
    page_slug, section_key, section_type, title, subtitle, content, order_index, status
) values
(
    '/transport/airport-transfers',
    'transport_intro',
    'rich_text_with_cta',
    'Start your Uganda trip with peace of mind',
    'Airport Transfers Intro',
    $json${
        "intro": "Jackfruit Safaris provides airport pickup from Entebbe International Airport and safe transfers to hotels, Jinja, Kampala, or your next safari destination.",
        "cta_label": "Book a transfer",
        "cta_href": "/request-quote"
    }$json$::jsonb,
    10,
    'published'::public.content_status
),
(
    '/transport/airport-transfers',
    'services_list',
    'service_checklist',
    'Our Transport Services',
    'Reliable transport options across Uganda',
    $json${
        "items": [
            "Entebbe airport pickup",
            "Entebbe to Kampala transfer",
            "Entebbe or Kampala to Jinja transfer",
            "Hotel transfers",
            "Safari vehicle hire with driver",
            "Group transport",
            "Late-night or early-morning transfers by arrangement"
        ],
        "icon": "CheckCircle2",
        "layout": "two_column_checklist"
    }$json$::jsonb,
    20,
    'published'::public.content_status
),
(
    '/transport/airport-transfers',
    'quote_form',
    'quote_form',
    'Airport Transfers Quote Form',
    'Quote form on the Airport Transfers page',
    $json${
        "source_page": "airport-transfers",
        "default_service": "Airport transfer",
        "variant": "compact"
    }$json$::jsonb,
    30,
    'published'::public.content_status
)

on conflict (page_slug, section_key) do update
set section_type = excluded.section_type,
    title = excluded.title,
    subtitle = excluded.subtitle,
    content = excluded.content,
    order_index = excluded.order_index,
    status = excluded.status,
    updated_at = now();

-- Sync page_content_sections to pages.sections JSONB column
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
  where page_slug in ('/contact', '/request-quote', '/transport/airport-transfers')
  group by page_slug
) as section_rows
where p.slug = section_rows.page_slug;

-- Also ensure these pages exist in the pages table
insert into public.pages (slug, title, summary, status, featured_image_url)
values
('contact', 'Contact Jackfruit Safaris', 'Contact Jackfruit Safaris Uganda by email, phone, WhatsApp, or inquiry form for safaris, Jinja activities, and airport transfers.', 'published', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82'),
('request-quote', 'Request a Uganda Safari Quote', 'Request a custom Uganda safari quote from Jackfruit Safaris for gorilla trekking, wildlife safaris, Jinja activities, culture, and transport.', 'published', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82'),
('transport/airport-transfers', 'Airport Pickups and Transport Services', 'Book reliable Entebbe airport pickups, Kampala and Jinja transfers, hotel transfers, safari vehicle hire, and group transport with Jackfruit Safaris.', 'published', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82')
on conflict (slug) do update
set title = excluded.title,
    summary = excluded.summary,
    status = excluded.status,
    featured_image_url = excluded.featured_image_url,
    updated_at = now();