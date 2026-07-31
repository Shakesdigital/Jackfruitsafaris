-- Make core landing pages visible in the CMS Pages tab and allow hero detail
-- content blocks, especially for the About page.

alter table public.page_heroes
  add column if not exists content jsonb not null default '{}'::jsonb;

insert into public.pages (
  slug,
  title,
  summary,
  status,
  meta_title,
  meta_description
) values
  ('home', 'Home', 'Main Jackfruit Safaris landing page with hero, trust items, safari packages, experiences, reviews, guide links, and quote CTA.', 'published', 'Jackfruit Safaris Uganda | Uganda Safaris and Gorilla Trekking', 'Plan private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and transfers with Jackfruit Safaris Uganda.'),
  ('safaris', 'Safaris', 'Uganda safari package listing page showing ready routes and custom planning prompts.', 'published', 'Uganda Safari Packages | Jackfruit Safaris', 'Browse Uganda safari packages for gorilla trekking, Murchison Falls, complete Uganda circuits, and custom private safaris.'),
  ('destinations', 'Destinations', 'Uganda destination listing page with national parks, lakes, Nile routes, and practical travel context.', 'published', 'Uganda Safari Destinations | Jackfruit Safaris', 'Explore Uganda safari destinations including Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Lake Mburo, Lake Bunyonyi, and Jinja.'),
  ('experiences', 'Experiences', 'Experience listing page for gorilla trekking, wildlife, Jinja adventure, and cultural travel moments.', 'published', 'Uganda Safari Experiences | Jackfruit Safaris', 'Choose Uganda travel experiences such as gorilla trekking, Nile adventures, wildlife safaris, culture, and transport support.'),
  ('reviews', 'Reviews', 'Guest review landing page with approved testimonials and trip proof.', 'published', 'Guest Reviews | Jackfruit Safaris Uganda', 'Read traveler reviews and trip feedback from guests who explored Uganda with Jackfruit Safaris.'),
  ('about', 'About', 'About page covering Jackfruit Safaris local roots, operating areas, guiding style, and service scope.', 'published', 'About Jackfruit Safaris Uganda', 'Learn about Jackfruit Safaris Uganda, a locally rooted tour company based in Jinja and planning safaris across Uganda.'),
  ('travel-guide', 'Travel Guide', 'Travel guide landing page listing practical safari planning article topics.', 'published', 'Uganda Safari Travel Guide | Jackfruit Safaris', 'Read practical Uganda safari planning guides about seasons, permits, packing, routes, costs, and Jinja travel.')
on conflict (slug) do update
set title = coalesce(public.pages.title, excluded.title),
    summary = coalesce(public.pages.summary, excluded.summary),
    status = coalesce(public.pages.status, excluded.status),
    meta_title = coalesce(public.pages.meta_title, excluded.meta_title),
    meta_description = coalesce(public.pages.meta_description, excluded.meta_description),
    updated_at = now();

insert into public.page_heroes (
  page_slug,
  eyebrow,
  title,
  intro,
  background_image,
  content,
  status
) values
  ('/', 'Local safari experts from Jinja', 'Explore Uganda With Local Safari Experts', 'Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris Uganda from Jinja.', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82', '{}'::jsonb, 'published'),
  ('/about', 'About Jackfruit Safaris Uganda', 'Local roots, practical planning, and warm guest care', 'Jackfruit Safaris Uganda is a registered tour company based in Jinja, one of Uganda''s most exciting travel hubs and the adventure capital of East Africa.', null, jsonb_build_object(
    'why_jackfruit_title', 'Why the name Jackfruit',
    'why_jackfruit_body', 'The jackfruit is common and loved in Uganda. It reflects travel rooted in local life, generous experiences, and everyday discovery.',
    'where_operates_title', 'Where the team operates',
    'where_operates_body', 'Jinja, Entebbe, Kampala, Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Lake Mburo, Lake Bunyonyi, and custom routes.',
    'guiding_style_title', 'Guiding style',
    'guiding_style_body', 'Personal, flexible, friendly, safe, and direct about what is included, what is optional, and what must be confirmed.',
    'services_title', 'Safari, adventure, culture, and logistics in one planning flow',
    'services_intro', 'The website is structured so staff can manage every front-end content area from the Supabase CMS.'
  ), 'published')
on conflict (page_slug) do update
set eyebrow = coalesce(public.page_heroes.eyebrow, excluded.eyebrow),
    title = coalesce(public.page_heroes.title, excluded.title),
    intro = coalesce(public.page_heroes.intro, excluded.intro),
    background_image = coalesce(public.page_heroes.background_image, excluded.background_image),
    content = excluded.content || public.page_heroes.content,
    status = coalesce(public.page_heroes.status, excluded.status),
    updated_at = now();
