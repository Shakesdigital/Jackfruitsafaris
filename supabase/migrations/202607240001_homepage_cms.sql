-- Homepage sections table for editable landing page content
create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_type text not null, -- 'hero', 'trust_bar', 'why_uganda', 'featured_safaris', 'experiences', 'reviews', 'travel_guide', 'cta'
  title text,
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Homepage quick links (editable navigation buttons)
create table public.homepage_quick_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Homepage trust items (editable badges)
create table public.homepage_trust_items (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Feature bullets for the Why Uganda section
create table public.homepage_features (
  id uuid primary key default gen_random_uuid(),
  icon_name text not null, -- icon identifier
  text text not null,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Travel guide articles list for homepage
create table public.homepage_guide_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed homepage sections content
insert into public.homepage_sections (section_type, title, subtitle, content, order_index, status) values
('hero', 'Explore Uganda With Local Safari Experts', 'Local safari experts from Jinja',
 '{"subtitle": "Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris Uganda from Jinja.", "cta_primary": "Plan My Safari", "cta_secondary": "View Safari Packages"}', 1, 'published'),

('trust_bar', 'Trust Items', null, '{}'::jsonb, 2, 'published'),

('why_uganda', 'One compact country, many safari worlds',
 'Uganda can take you from the River Nile to open savannah, roaring waterfalls, crater lakes, rainforest chimpanzees, and mountain gorillas in one carefully routed journey.',
 '{"section_title": "Why Uganda", "paragraph": "Jackfruit Safaris helps you experience Uganda smoothly, with local guides who understand the roads, parks, permits, lodges, and small details that make a trip feel effortless."}', 3, 'published'),

('featured_safaris', 'Start with a proven Uganda route',
 'Choose a ready itinerary or ask Jackfruit Safaris to adjust the route, dates, accommodation tier, and pace around your group.',
 '{}'::jsonb, 4, 'published'),

('experiences', 'The right trip for your travel style',
 'Jackfruit Safaris can combine wildlife, primates, Nile adventure, culture, and transport into a single smooth plan.',
 '{}'::jsonb, 5, 'published'),

('reviews', 'Confidence before the first road mile',
 'The new inquiry flow puts trust, price guidance, route logic, and WhatsApp access close to every major booking decision.',
 '{}'::jsonb, 6, 'published'),

('travel_guide', 'Helpful planning content for safari buyers',
 'Priority guide topics are ready for CMS publishing, SEO expansion, and AI-search visibility.',
 '{}'::jsonb, 7, 'published'),

('cta', 'Ready to plan?', null,
 '{"box_title": "Tell us your dates, group size, budget, and dream experiences.", "button_label": "Request a Custom Quote"}', 8, 'published');

-- Seed trust items
insert into public.homepage_trust_items (text, order_index, status) values
('2024 Tripadvisor Travelers'' Choice Award', 1, 'published'),
('Registered tour company based in Jinja, Uganda', 2, 'published'),
('Private and custom safari planning', 3, 'published'),
('WhatsApp support before and during your trip', 4, 'published');

-- Seed quick links
insert into public.homepage_quick_links (label, href, order_index, status) values
('Gorilla Trekking', '/experiences/gorilla-trekking', 1, 'published'),
('Murchison Falls', '/safaris/3-days-murchison-falls', 2, 'published'),
('10 Days Uganda', '/safaris/10-days-uganda-safari', 3, 'published'),
('Jinja Activities', '/experiences/jinja-adventures', 4, 'published'),
('Airport Transfer', '/transport/airport-transfers', 5, 'published');

-- Seed features for Why Uganda section
insert into public.homepage_features (icon_name, text, order_index, status) values
('check', 'Private, flexible trips', 1, 'published'),
('check', 'Clear package inclusions', 2, 'published'),
('check', 'Permit and lodge guidance', 3, 'published'),
('check', 'Warm care from arrival to departure', 4, 'published');

-- Seed travel guide articles for homepage
insert into public.homepage_guide_articles (title, order_index, status) values
('Best Time to Visit Uganda for Safari and Gorilla Trekking', 1, 'published'),
('Gorilla Trekking Permit Guide', 2, 'published'),
('What to Pack for a Uganda Safari', 3, 'published'),
('How Many Days Do You Need in Uganda?', 4, 'published'),
('Murchison Falls Safari Guide', 5, 'published'),
('Jinja Adventure Guide', 6, 'published');

-- Enable RLS
alter table public.homepage_sections enable row level security;
alter table public.homepage_quick_links enable row level security;
alter table public.homepage_trust_items enable row level security;
alter table public.homepage_features enable row level security;
alter table public.homepage_guide_articles enable row level security;

-- Public read policies
create policy "public read published homepage sections" on public.homepage_sections
  for select using (status = 'published');
create policy "public read published quick links" on public.homepage_quick_links
  for select using (status = 'published');
create policy "public read published trust items" on public.homepage_trust_items
  for select using (status = 'published');
create policy "public read published features" on public.homepage_features
  for select using (status = 'published');
create policy "public read published guide articles" on public.homepage_guide_articles
  for select using (status = 'published');

-- Content team manage policies
create policy "content team manage homepage sections" on public.homepage_sections
  for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage quick links" on public.homepage_quick_links
  for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage trust items" on public.homepage_trust_items
  for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage features" on public.homepage_features
  for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage guide articles" on public.homepage_guide_articles
  for all using (public.can_manage_content()) with check (public.can_manage_content());

-- Indexes
create index homepage_sections_order_idx on public.homepage_sections(order_index);
create index homepage_quick_links_order_idx on public.homepage_quick_links(order_index);
create index homepage_trust_items_order_idx on public.homepage_trust_items(order_index);
create index homepage_features_order_idx on public.homepage_features(order_index);