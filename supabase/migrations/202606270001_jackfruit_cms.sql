create extension if not exists "pgcrypto";

create type public.content_status as enum ('draft', 'published', 'archived');
create type public.lead_status as enum ('new', 'contacted', 'quoted', 'follow_up', 'booked', 'lost');
create type public.app_role as enum ('admin', 'editor', 'booking_manager', 'guide');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = required_role
  );
$$;

create or replace function public.can_manage_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('admin')
    or public.has_role('editor')
    or public.has_role('booking_manager');
$$;

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Jackfruit Safaris Uganda',
  logo_url text,
  favicon_url text,
  contact_email text,
  phone text,
  whatsapp_number text,
  whatsapp_message text,
  alternate_phone text,
  address text,
  operating_hours text,
  social_links jsonb not null default '{}'::jsonb,
  footer_copy text,
  seo jsonb not null default '{}'::jsonb,
  integrations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  location text not null,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  parent_id uuid references public.menu_items(id) on delete cascade,
  label text not null,
  href text not null,
  order_column int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  hero jsonb not null default '{}'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  featured_image_url text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  meta_title text,
  meta_description text,
  meta_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  module_type text not null,
  title text,
  config jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modulables (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  owner_table text not null,
  owner_id uuid not null,
  order_column int not null default 0,
  created_at timestamptz not null default now()
);

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  region text,
  overview text,
  why_go text[] not null default '{}',
  top_experiences text[] not null default '{}',
  wildlife text[] not null default '{}',
  best_time text,
  recommended_nights text,
  gallery jsonb not null default '[]'::jsonb,
  map_coordinates jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  order_column int not null default 0,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  meta_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  summary text,
  description text,
  location text,
  duration text,
  price_from numeric(12,2),
  currency text default 'USD',
  provider text,
  safety_notes text,
  included text[] not null default '{}',
  excluded text[] not null default '{}',
  gallery jsonb not null default '[]'::jsonb,
  cta_label text,
  cta_url text,
  status public.content_status not null default 'draft',
  order_column int not null default 0,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  meta_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.safari_packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  duration text,
  summary text,
  route text,
  start_point text,
  end_point text,
  price_from numeric(12,2),
  currency text default 'USD',
  group_size_pricing jsonb not null default '[]'::jsonb,
  comfort_levels text[] not null default '{}',
  highlights text[] not null default '{}',
  included text[] not null default '{}',
  excluded text[] not null default '{}',
  itinerary jsonb not null default '[]'::jsonb,
  accommodation_options jsonb not null default '[]'::jsonb,
  permits jsonb not null default '{}'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  related_destination_ids uuid[] not null default '{}',
  related_experience_ids uuid[] not null default '{}',
  price_last_updated date,
  permit_rate_warning text,
  status public.content_status not null default 'draft',
  featured_image_url text,
  order_column int not null default 0,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  meta_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transfer_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  route text not null,
  vehicle_type text,
  capacity text,
  price_from numeric(12,2),
  currency text default 'USD',
  pickup_details text,
  dropoff_details text,
  availability text,
  notes text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.accommodations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  destination_id uuid references public.destinations(id) on delete set null,
  website text,
  description text,
  images jsonb not null default '[]'::jsonb,
  comfort_level text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  country text,
  trip_type text,
  rating int check (rating between 1 and 5),
  quote text not null,
  source text,
  permission_status text not null default 'needs_permission',
  image_url text,
  review_date date,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,
  media_type text not null default 'image',
  alt_text text not null,
  caption text,
  destination_id uuid references public.destinations(id) on delete set null,
  safari_package_id uuid references public.safari_packages(id) on delete set null,
  experience_id uuid references public.experiences(id) on delete set null,
  permission_status text not null default 'needs_review',
  photographer text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  related_table text,
  related_id uuid,
  order_column int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.travel_guide_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text,
  author text,
  excerpt text,
  content text,
  related_tours uuid[] not null default '{}',
  status public.content_status not null default 'draft',
  published_at timestamptz,
  meta_title text,
  meta_description text,
  meta_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  category text,
  website text,
  description text,
  related_activities text[] not null default '{}',
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiry_leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null,
  phone text,
  service_type text,
  travel_dates text,
  group_size text,
  budget_range text,
  interests text,
  message text not null,
  source_page text,
  status public.lead_status not null default 'new',
  assigned_staff uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  destination_path text not null,
  status_code int not null default 301,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.site_settings enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.pages enable row level security;
alter table public.modules enable row level security;
alter table public.modulables enable row level security;
alter table public.destinations enable row level security;
alter table public.experiences enable row level security;
alter table public.safari_packages enable row level security;
alter table public.transfer_services enable row level security;
alter table public.accommodations enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery_media enable row level security;
alter table public.faqs enable row level security;
alter table public.travel_guide_articles enable row level security;
alter table public.partners enable row level security;
alter table public.inquiry_leads enable row level security;
alter table public.redirects enable row level security;

create policy "public read published pages" on public.pages
for select using (status = 'published');
create policy "public read published destinations" on public.destinations
for select using (status = 'published');
create policy "public read published experiences" on public.experiences
for select using (status = 'published');
create policy "public read published safari packages" on public.safari_packages
for select using (status = 'published');
create policy "public read published transfer services" on public.transfer_services
for select using (status = 'published');
create policy "public read published accommodations" on public.accommodations
for select using (status = 'published');
create policy "public read published reviews" on public.reviews
for select using (status = 'published' and permission_status = 'approved');
create policy "public read published media" on public.gallery_media
for select using (status = 'published' and permission_status = 'approved');
create policy "public read published faqs" on public.faqs
for select using (status = 'published');
create policy "public read published guides" on public.travel_guide_articles
for select using (status = 'published');
create policy "public read published partners" on public.partners
for select using (status = 'published');
create policy "public read active redirects" on public.redirects
for select using (active = true);
create policy "public create inquiry leads" on public.inquiry_leads
for insert with check (true);

create policy "admins manage profiles" on public.profiles
for all using (public.has_role('admin')) with check (public.has_role('admin'));
create policy "admins manage roles" on public.user_roles
for all using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "content team manage settings" on public.site_settings
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage menus" on public.menus
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage menu items" on public.menu_items
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage pages" on public.pages
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage modules" on public.modules
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage modulables" on public.modulables
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage destinations" on public.destinations
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage experiences" on public.experiences
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage safari packages" on public.safari_packages
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage transfer services" on public.transfer_services
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage accommodations" on public.accommodations
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage reviews" on public.reviews
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage media" on public.gallery_media
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage faqs" on public.faqs
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage guides" on public.travel_guide_articles
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage partners" on public.partners
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "booking team manage inquiry leads" on public.inquiry_leads
for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "content team manage redirects" on public.redirects
for all using (public.can_manage_content()) with check (public.can_manage_content());

create index pages_status_slug_idx on public.pages(status, slug);
create index safari_packages_status_slug_idx on public.safari_packages(status, slug);
create index destinations_status_slug_idx on public.destinations(status, slug);
create index experiences_status_slug_idx on public.experiences(status, slug);
create index inquiry_leads_status_created_idx on public.inquiry_leads(status, created_at desc);

insert into public.redirects (source_path, destination_path) values
  ('/tours-in-uganda', '/about'),
  ('/gorilla-tracking', '/experiences/gorilla-trekking'),
  ('/3-days-gorilla-tracking', '/safaris/3-days-gorilla-tracking'),
  ('/3-days-murchison-falls-np', '/safaris/3-days-murchison-falls'),
  ('/uganda-national-parks', '/safaris/10-days-uganda-safari'),
  ('/cycling-in-jinja', '/experiences/jinja-adventures'),
  ('/airport-pickups', '/transport/airport-transfers'),
  ('/cultural-experiences', '/experiences/cultural-experiences'),
  ('/jackfruit-safaris', '/contact'),
  ('/uganda-safari-tour-experience', '/safaris/custom-uganda-safari');
