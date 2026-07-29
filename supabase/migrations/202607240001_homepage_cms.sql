-- Homepage sections table for editable landing page content
create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_type text not null,
  title text,
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Homepage quick links (editable navigation buttons)
create table if not exists public.homepage_quick_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Homepage trust items (editable badges)
create table if not exists public.homepage_trust_items (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Feature bullets for the Why Uganda section
create table if not exists public.homepage_features (
  id uuid primary key default gen_random_uuid(),
  icon_name text not null,
  text text not null,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Travel guide articles list for homepage
create table if not exists public.homepage_guide_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  order_index int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed homepage sections content
insert into public.homepage_sections (section_type, title, subtitle, content, order_index, status)
select
  seed.section_type,
  seed.title,
  seed.subtitle,
  seed.content,
  seed.order_index,
  seed.status::public.content_status
from (values
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
 '{"box_title": "Tell us your dates, group size, budget, and dream experiences.", "button_label": "Request a Custom Quote"}', 8, 'published')
) as seed(section_type, title, subtitle, content, order_index, status)
where not exists (
  select 1
  from public.homepage_sections existing
  where existing.section_type = seed.section_type
);

-- Seed trust items
insert into public.homepage_trust_items (text, order_index, status)
select
  seed.text,
  seed.order_index,
  seed.status::public.content_status
from (values
('2024 Tripadvisor Travelers'' Choice Award', 1, 'published'),
('Registered tour company based in Jinja, Uganda', 2, 'published'),
('Private and custom safari planning', 3, 'published'),
('WhatsApp support before and during your trip', 4, 'published')
) as seed(text, order_index, status)
where not exists (
  select 1
  from public.homepage_trust_items existing
  where existing.text = seed.text
);

-- Seed quick links
insert into public.homepage_quick_links (label, href, order_index, status)
select
  seed.label,
  seed.href,
  seed.order_index,
  seed.status::public.content_status
from (values
('Gorilla Trekking', '/experiences/gorilla-trekking', 1, 'published'),
('Murchison Falls', '/safaris/3-days-murchison-falls', 2, 'published'),
('10 Days Uganda', '/safaris/10-days-uganda-safari', 3, 'published'),
('Jinja Activities', '/experiences/jinja-adventures', 4, 'published'),
('Airport Transfer', '/transport/airport-transfers', 5, 'published')
) as seed(label, href, order_index, status)
where not exists (
  select 1
  from public.homepage_quick_links existing
  where existing.label = seed.label
    and existing.href = seed.href
);

-- Seed features for Why Uganda section
insert into public.homepage_features (icon_name, text, order_index, status)
select
  seed.icon_name,
  seed.text,
  seed.order_index,
  seed.status::public.content_status
from (values
('check', 'Private, flexible trips', 1, 'published'),
('check', 'Clear package inclusions', 2, 'published'),
('check', 'Permit and lodge guidance', 3, 'published'),
('check', 'Warm care from arrival to departure', 4, 'published')
) as seed(icon_name, text, order_index, status)
where not exists (
  select 1
  from public.homepage_features existing
  where existing.text = seed.text
);

-- Seed travel guide articles for homepage
insert into public.homepage_guide_articles (title, order_index, status)
select
  seed.title,
  seed.order_index,
  seed.status::public.content_status
from (values
('Best Time to Visit Uganda for Safari and Gorilla Trekking', 1, 'published'),
('Gorilla Trekking Permit Guide', 2, 'published'),
('What to Pack for a Uganda Safari', 3, 'published'),
('How Many Days Do You Need in Uganda?', 4, 'published'),
('Murchison Falls Safari Guide', 5, 'published'),
('Jinja Adventure Guide', 6, 'published')
) as seed(title, order_index, status)
where not exists (
  select 1
  from public.homepage_guide_articles existing
  where existing.title = seed.title
);

-- Enable RLS
alter table public.homepage_sections enable row level security;
alter table public.homepage_quick_links enable row level security;
alter table public.homepage_trust_items enable row level security;
alter table public.homepage_features enable row level security;
alter table public.homepage_guide_articles enable row level security;

-- Public read policies
drop policy if exists "public read published homepage sections" on public.homepage_sections;
drop policy if exists "public read published quick links" on public.homepage_quick_links;
drop policy if exists "public read published trust items" on public.homepage_trust_items;
drop policy if exists "public read published features" on public.homepage_features;
drop policy if exists "public read published guide articles" on public.homepage_guide_articles;
drop policy if exists "content team manage homepage sections" on public.homepage_sections;
drop policy if exists "content team manage quick links" on public.homepage_quick_links;
drop policy if exists "content team manage trust items" on public.homepage_trust_items;
drop policy if exists "content team manage features" on public.homepage_features;
drop policy if exists "content team manage guide articles" on public.homepage_guide_articles;

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
create index if not exists homepage_sections_order_idx on public.homepage_sections(order_index);
create index if not exists homepage_quick_links_order_idx on public.homepage_quick_links(order_index);
create index if not exists homepage_trust_items_order_idx on public.homepage_trust_items(order_index);
create index if not exists homepage_features_order_idx on public.homepage_features(order_index);
create index if not exists homepage_guide_articles_order_idx on public.homepage_guide_articles(order_index);
