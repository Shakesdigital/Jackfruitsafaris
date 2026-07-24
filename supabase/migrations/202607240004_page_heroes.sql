-- Page hero content tables for CMS editing
create table public.page_heroes (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null unique, -- '/', '/safaris', '/destinations', etc.
  eyebrow text,
  title text,
  intro text,
  background_image text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed page hero content
insert into public.page_heroes (page_slug, eyebrow, title, intro, background_image, status) values
('/', 'Local safari experts from Jinja', 'Explore Uganda With Local Safari Experts',
 'Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris Uganda from Jinja.',
 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82', 'published'),

('/safaris', 'Uganda safari packages', 'Choose a proven route, then make it yours',
 'Whether you have three days or two weeks, Jackfruit Safaris can help you experience Uganda''s landscapes and wildlife as budget, mid-range, or luxury private trips.',
 NULL, 'published'),

('/destinations', 'Destinations', 'Uganda safari places, routed with care',
 'Destination pages give travelers the practical why go, best time, recommended nights, and related route context they need before requesting a quote.',
 NULL, 'published'),

('/experiences', 'Experiences', 'Build your Uganda trip around the moments that matter',
 'Choose primates, wildlife, Nile adventure, cultural visits, or reliable transport, then ask Jackfruit Safaris to connect the pieces into a realistic itinerary.',
 NULL, 'published'),

('/about', 'About Jackfruit Safaris Uganda', 'Local roots, practical planning, and warm guest care',
 'Jackfruit Safaris Uganda is a registered tour company based in Jinja, one of Uganda''s most exciting travel hubs and the adventure capital of East Africa.',
 NULL, 'published'),

('/reviews', 'Guest reviews', 'Hear from travelers who explored Uganda with Jackfruit Safaris',
 'Review content imported only with permission or embedded according to review platform rules. The CMS includes permission and source fields for that reason.',
 NULL, 'published'),

('/travel-guide', 'Uganda safari travel guide', 'Practical articles that answer booking questions',
 'These are ready as CMS article topics for SEO, buyer education, and AI-search visibility.',
 NULL, 'published');

-- Enable RLS
alter table public.page_heroes enable row level security;

-- Public read policy
create policy "public read published page heroes" on public.page_heroes
  for select using (status = 'published');

-- Content team manage policy
create policy "content team manage page heroes" on public.page_heroes
  for all using (public.can_manage_content()) with check (public.can_manage_content());

-- Index
create index page_heroes_slug_idx on public.page_heroes(page_slug);