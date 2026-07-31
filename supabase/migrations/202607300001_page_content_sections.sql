-- CMS-managed content sections for core landing pages.
-- These rows mirror the non-hero frontend components so admins can manage
-- each page beyond the existing page_heroes table.

create extension if not exists "pgcrypto";

create table if not exists public.page_content_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  section_type text not null,
  title text,
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint page_content_sections_page_section_key unique (page_slug, section_key)
);

alter table public.page_content_sections
  add column if not exists page_slug text,
  add column if not exists section_key text,
  add column if not exists section_type text,
  add column if not exists title text,
  add column if not exists subtitle text,
  add column if not exists content jsonb not null default '{}'::jsonb,
  add column if not exists order_index int not null default 0,
  add column if not exists status public.content_status not null default 'published',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'page_content_sections_page_section_key'
      and conrelid = 'public.page_content_sections'::regclass
  ) then
    alter table public.page_content_sections
      add constraint page_content_sections_page_section_key unique (page_slug, section_key);
  end if;
end $$;

alter table public.page_content_sections enable row level security;

drop policy if exists "public read published page content sections" on public.page_content_sections;
drop policy if exists "content team manage page content sections" on public.page_content_sections;

create policy "public read published page content sections" on public.page_content_sections
  for select using (status = 'published'::public.content_status);

create policy "content team manage page content sections" on public.page_content_sections
  for all using (public.can_manage_content()) with check (public.can_manage_content());

create index if not exists page_content_sections_page_status_order_idx
  on public.page_content_sections(page_slug, status, order_index);

create index if not exists page_content_sections_type_idx
  on public.page_content_sections(section_type);

insert into public.page_content_sections (
  page_slug,
  section_key,
  section_type,
  title,
  subtitle,
  content,
  order_index,
  status
) values
  (
    '/',
    'trust_bar',
    'trust_bar',
    'Trust Bar',
    'Short trust proof badges shown below the homepage hero.',
    $json${
      "items_source": "homepage_trust_items",
      "fallback_items": [
        "2024 Tripadvisor Travelers' Choice Award",
        "Registered tour company based in Jinja, Uganda",
        "Private and custom safari planning",
        "WhatsApp support before and during your trip"
      ],
      "icon": "ShieldCheck"
    }$json$::jsonb,
    10,
    'published'::public.content_status
  ),
  (
    '/',
    'why_uganda',
    'feature_split_with_quote_form',
    'One compact country, many safari worlds',
    'Why Uganda',
    $json${
      "intro": "Uganda can take you from the River Nile to open savannah, roaring waterfalls, crater lakes, rainforest chimpanzees, and mountain gorillas in one carefully routed journey.",
      "body": "Jackfruit Safaris helps you experience Uganda smoothly, with local guides who understand the roads, parks, permits, lodges, and small details that make a trip feel effortless.",
      "features_source": "homepage_features",
      "fallback_features": [
        "Private, flexible trips",
        "Clear package inclusions",
        "Permit and lodge guidance",
        "Warm care from arrival to departure"
      ],
      "form_source_page": "homepage"
    }$json$::jsonb,
    20,
    'published'::public.content_status
  ),
  (
    '/',
    'featured_safaris',
    'entity_card_grid',
    'Start with a proven Uganda route',
    'Featured safaris',
    $json${
      "intro": "Choose a ready itinerary or ask Jackfruit Safaris to adjust the route, dates, accommodation tier, and pace around your group.",
      "entity_source": "safari_packages",
      "layout": "four_column_cards"
    }$json$::jsonb,
    30,
    'published'::public.content_status
  ),
  (
    '/',
    'experiences',
    'entity_card_grid',
    'The right trip for your travel style',
    'Experiences',
    $json${
      "intro": "Jackfruit Safaris can combine wildlife, primates, Nile adventure, culture, and transport into a single smooth plan.",
      "entity_source": "experiences",
      "layout": "four_column_icon_cards"
    }$json$::jsonb,
    40,
    'published'::public.content_status
  ),
  (
    '/',
    'reviews',
    'testimonial_grid',
    'Confidence before the first road mile',
    'Reviews and planning proof',
    $json${
      "intro": "The new inquiry flow puts trust, price guidance, route logic, and WhatsApp access close to every major booking decision.",
      "entity_source": "reviews",
      "layout": "three_column_quotes"
    }$json$::jsonb,
    50,
    'published'::public.content_status
  ),
  (
    '/',
    'travel_guide',
    'guide_link_grid',
    'Helpful planning content for safari buyers',
    'Travel guide',
    $json${
      "intro": "Priority guide topics are ready for CMS publishing, SEO expansion, and AI-search visibility.",
      "entity_source": "homepage_guide_articles",
      "layout": "two_column_links",
      "link_href": "/travel-guide"
    }$json$::jsonb,
    60,
    'published'::public.content_status
  ),
  (
    '/',
    'quote_cta',
    'cta_panel',
    'Tell us your dates, group size, budget, and dream experiences.',
    'Ready to plan?',
    $json${
      "intro": "Jackfruit Safaris will recommend the best route and quote, with clear inclusions, exclusions, and items that need live checking.",
      "primary_label": "Request a Custom Quote",
      "primary_href": "/request-quote",
      "secondary_label": "WhatsApp Jackfruit",
      "secondary_source": "site_settings.whatsapp"
    }$json$::jsonb,
    70,
    'published'::public.content_status
  ),
  (
    '/safaris',
    'filters',
    'filter_chip_bar',
    'Safari Package Filters',
    'Filters shown before the safari card grid.',
    $json${
      "filters": [
        "Duration: 1 day, 3 days, 4-7 days, 8-14 days, custom",
        "Interest: gorillas, wildlife, chimpanzees, culture, Nile adventure",
        "Comfort: budget, mid-range, luxury",
        "Start point: Entebbe, Kampala, Jinja"
      ],
      "icon": "Filter"
    }$json$::jsonb,
    10,
    'published'::public.content_status
  ),
  (
    '/safaris',
    'safari_grid',
    'entity_card_grid',
    'Safari package grid',
    'Published safari package cards shown on the Safaris landing page.',
    $json${
      "entity_source": "safari_packages",
      "layout": "two_column_safari_cards",
      "fallback_source": "lib/content.safaris"
    }$json$::jsonb,
    20,
    'published'::public.content_status
  ),
  (
    '/safaris',
    'custom_planning',
    'sidebar_cta',
    'Need a different route?',
    'Custom planning',
    $json${
      "body": "Share your dates, pace, budget, lodge style, and must-do activities. Jackfruit Safaris will match the route to your time and comfort level.",
      "button_label": "Build a custom safari",
      "button_href": "/safaris/custom-uganda-safari",
      "icon": "SlidersHorizontal"
    }$json$::jsonb,
    30,
    'published'::public.content_status
  ),
  (
    '/safaris',
    'quote_form',
    'quote_form',
    'Safaris quote form',
    'Compact quote form shown in the Safaris sidebar.',
    $json${
      "source_page": "safaris-index",
      "variant": "compact"
    }$json$::jsonb,
    40,
    'published'::public.content_status
  ),
  (
    '/destinations',
    'destination_grid',
    'entity_card_grid',
    'Uganda destination cards',
    'Published destination cards shown on the Destinations landing page.',
    $json${
      "entity_source": "destinations",
      "layout": "three_column_destination_cards",
      "fallback_source": "lib/content.destinations",
      "card_fields": ["region", "name", "overview", "featured_image_url"]
    }$json$::jsonb,
    10,
    'published'::public.content_status
  ),
  (
    '/experiences',
    'experience_grid',
    'entity_card_grid',
    'Uganda experience cards',
    'Published experience cards shown on the Experiences landing page.',
    $json${
      "entity_source": "experiences",
      "layout": "two_column_experience_cards",
      "fallback_source": "lib/content.experiences",
      "card_fields": ["icon", "title", "summary", "featured_image_url"]
    }$json$::jsonb,
    10,
    'published'::public.content_status
  ),
  (
    '/reviews',
    'review_grid',
    'testimonial_grid',
    'Traveler review cards',
    'Approved published review cards shown on the Reviews landing page.',
    $json${
      "entity_source": "reviews",
      "layout": "three_column_star_cards",
      "fallback_source": "lib/content.testimonials",
      "card_fields": ["rating", "quote", "trip_type", "guest_name"]
    }$json$::jsonb,
    10,
    'published'::public.content_status
  ),
  (
    '/reviews',
    'quote_cta',
    'button_cta',
    'Plan your trip',
    'CTA shown below the review grid.',
    $json${
      "href": "/request-quote",
      "style": "primary"
    }$json$::jsonb,
    20,
    'published'::public.content_status
  ),
  (
    '/about',
    'intro_cards',
    'feature_card_grid',
    'About intro cards',
    'Three cards explaining the name, operating areas, and guiding style.',
    $json${
      "items": [
        {
          "icon": "sprout",
          "title": "Why the name Jackfruit",
          "body": "The jackfruit is common and loved in Uganda. It reflects travel rooted in local life, generous experiences, and everyday discovery."
        },
        {
          "icon": "map",
          "title": "Where the team operates",
          "body": "Jinja, Entebbe, Kampala, Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Lake Mburo, Lake Bunyonyi, and custom routes."
        },
        {
          "icon": "heart",
          "title": "Guiding style",
          "body": "Personal, flexible, friendly, safe, and direct about what is included, what is optional, and what must be confirmed."
        }
      ],
      "layout": "three_column_cards"
    }$json$::jsonb,
    10,
    'published'::public.content_status
  ),
  (
    '/about',
    'services_grid',
    'feature_grid',
    'Safari, adventure, culture, and logistics in one planning flow',
    'What Jackfruit organizes',
    $json${
      "intro": "The website is structured so staff can manage every front-end content area from a future Supabase CMS.",
      "items_source": "lib/content.cmsModels",
      "cta_label": "Plan your safari",
      "cta_href": "/request-quote",
      "layout": "four_column_badge_grid"
    }$json$::jsonb,
    20,
    'published'::public.content_status
  ),
  (
    '/travel-guide',
    'guide_topic_grid',
    'article_topic_grid',
    'Practical safari guide topics',
    'Article cards shown on the Travel Guide landing page.',
    $json${
      "entity_source": "homepage_guide_articles",
      "fallback_articles": [
        "Best Time to Visit Uganda for Safari and Gorilla Trekking",
        "Gorilla Trekking Permit Guide",
        "What to Pack for a Uganda Safari",
        "How Many Days Do You Need in Uganda?",
        "Murchison Falls Safari Guide",
        "Jinja Adventure Guide"
      ],
      "card_body": "Draft this guide from the CMS with practical route advice, transparent cost notes, permit verification reminders, FAQs, and a quote CTA.",
      "layout": "two_column_article_cards"
    }$json$::jsonb,
    10,
    'published'::public.content_status
  ),
  (
    '/travel-guide',
    'quote_cta',
    'button_cta',
    'Ask us to plan your route',
    'CTA shown below the guide topic grid.',
    $json${
      "href": "/request-quote",
      "style": "primary"
    }$json$::jsonb,
    20,
    'published'::public.content_status
  )
on conflict (page_slug, section_key) do update
set section_type = coalesce(public.page_content_sections.section_type, excluded.section_type),
    title = coalesce(public.page_content_sections.title, excluded.title),
    subtitle = coalesce(public.page_content_sections.subtitle, excluded.subtitle),
    content = excluded.content || public.page_content_sections.content,
    order_index = coalesce(public.page_content_sections.order_index, excluded.order_index),
    status = coalesce(public.page_content_sections.status, excluded.status),
    updated_at = now();

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
  where page_slug in ('/', '/safaris', '/destinations', '/experiences', '/reviews', '/about', '/travel-guide')
  group by page_slug
) as section_rows
where p.slug = section_rows.page_slug;
