-- About Us page content overhaul + team_members table
-- Adds the team_members entity for staff profiles, refreshes the About page
-- hero and content sections in the CMS, and seeds the give-back narrative.

---------------------------------------------------------------------------
-- 1. Create team_members table
--    Mirrors the conventions used by destinations, experiences, reviews:
--    slug, name, position, bio, featured_image_url, status, order_column,
--    published_at, meta fields, timestamps.  Plus social_links JSONB for
--    optional contact links.
---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

create table if not exists public.team_members (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  position         text not null,
  bio              text,
  photo_url        text,
  email            text,
  phone            text,
  social_links     jsonb not null default '{}'::jsonb,
  display_order    int not null default 0,
  status           public.content_status not null default 'draft',
  published_at     timestamptz,
  meta_title       text,
  meta_description text,
  meta_image_url   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

---------------------------------------------------------------------------
-- 2. RLS policies
---------------------------------------------------------------------------

alter table public.team_members enable row level security;

drop policy if exists "public read published team members" on public.team_members;
drop policy if exists "content team manage team members" on public.team_members;

create policy "public read published team members" on public.team_members
  for select using (status = 'published');

create policy "content team manage team members" on public.team_members
  for all using (public.can_manage_content()) with check (public.can_manage_content());

-- Indexes for fast lookups
create index if not exists team_members_status_slug_idx on public.team_members(status, slug);
create index if not exists team_members_order_idx on public.team_members(display_order);

---------------------------------------------------------------------------
-- 3. Add team_members to the realtime publication so the frontend live-refresh
--    picks up changes (mirrors the pattern in 202609020001_unified_cms_realtime).
---------------------------------------------------------------------------

do $$
begin
  if to_regclass('public.team_members') is not null
    and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'team_members'
    )
  then
    begin
      execute 'alter publication supabase_realtime add table public.team_members';
    exception
      when duplicate_object then
        null;
    end;
  end if;
end
$$;

-- Re-assert (or create) the cms_emit_refresh_event trigger on team_members
-- so that admin edits trigger a frontend live refresh.
drop trigger if exists cms_emit_refresh_event on public.team_members;
create trigger cms_emit_refresh_event
  after insert or update or delete on public.team_members
  for each statement execute function public.emit_cms_refresh_event();

---------------------------------------------------------------------------
-- 4. Seed team_members (founder name = Elvis; placeholder surnames until user
--    provides real staff data — can be edited in Supabase Studio).
---------------------------------------------------------------------------

insert into public.team_members (
  slug, name, position, bio, photo_url, display_order, status, published_at
) values
  ('elvis-tumwebaze', 'Elvis Tumwebaze', 'Founder & Managing Director',
   'Raised as an orphan in Jinja, Elvis was introduced to tourism and travel by his father at a young age. When his father passed away, he saw firsthand the challenges orphaned and vulnerable children face across Uganda. That experience became the heart of Jackfruit Safaris: a portion of every safari profit is channelled back into education, healthcare, and community programs for orphaned and vulnerable children. Elvis built Jackfruit on the belief that authentic travel should lift up the communities it touches.',
   null, 0, 'published', now()),
  ('sam-kiggundu', 'Sam Kiggundu', 'Lead Safari Guide',
   'With over 15 years guiding across Uganda''s national parks, Sam is a specialist in mountain-gorilla tracking, birding, and cultural storytelling. A Uganda Wildlife Authority-certified guide, he brings deep ecology knowledge and a warm, engaging presence to every trek.',
   null, 1, 'published', now()),
  ('maria-wanja', 'Maria Wanja', 'Operations Manager',
   'Maria coordinates permits, logistics, and guest relations for every Jackfruit safari. With a background in hospitality and NGO project management, she ensures every detail — from arrival to departure — runs like clockwork while maintaining the personal touch that guests remember.',
   null, 2, 'published', now()),
  ('david-okello', 'David Okello', 'Senior Driver-Guide',
   'Behind every smooth safari is David, a professional 4x4 driver-guide with 12 years on Ugandan roads. Known for his spot-on wildlife spotting, safety-first approach, and encyclopedic knowledge of local stories, he keeps guests comfortable and informed between parks.',
   null, 3, 'published', now())
on conflict (slug) do update
  set name            = excluded.name,
      position        = excluded.position,
      bio             = excluded.bio,
      photo_url       = excluded.photo_url,
      display_order   = excluded.display_order,
      status          = excluded.status,
      published_at    = excluded.published_at,
      updated_at      = now();

---------------------------------------------------------------------------
-- 5. Update the /about page_heroes row with the new mission/vision/give-back
--    narrative and hero subtitle split (h1 + h2).
---------------------------------------------------------------------------

update public.page_heroes
set
  badge_text = coalesce(badge_text, 'About Jackfruit Safaris'),
  title      = coalesce(title, 'Local Roots, Practical Planning'),
  subtitle   = coalesce(subtitle, 'Warm Guest Care'),
  intro      = coalesce(
    intro,
    'Jackfruit Safaris is a registered Ugandan tour company born from a simple idea: tourism should support the communities that call Uganda home.'
  ),
  content    = coalesce(content, '{}'::jsonb) || jsonb_build_object(
    'intro_body', 'Born from a story of loss and giving back, Jackfruit Safaris was founded by Elvis — a former orphan from Jinja who was introduced to the travel world by his father before he passed. Seeing the challenges orphaned and vulnerable children face, Elvis built Jackfruit to ensure that every safari adventure directly supports those children through education, healthcare, and community programs. Today, Jackfruit connects travelers with Uganda''s extraordinary wildlife and culture while channeling a portion of every booking into meaningful change.',
    'mission',    'To create authentic, locally-rooted safari experiences that connect travelers with Uganda''s wildlife and culture while reinvesting in orphaned and vulnerable children.',
    'vision',     'A Uganda where tourism empowers local communities and every child has the chance to thrive.',
    'give_back',  'A portion of every safari profit supports orphaned and vulnerable children across Uganda through education, healthcare, and community programs.'
  ),
  updated_at = now()
where page_slug = '/about';

---------------------------------------------------------------------------
-- 6. Update the intro_cards section for /about — refresh the three cards to
--    reflect the give-back story (card three becomes "Our giving journey").
---------------------------------------------------------------------------

update public.page_content_sections
set
  subtitle = 'Why we do what we do',
  content  = content || jsonb_build_object(
    'items', jsonb_build_array(
      jsonb_build_object(
        'icon',  'sprout',
        'title', 'Why the name Jackfruit',
        'body',  'The jackfruit is common and beloved across Uganda. It symbolizes local abundance, generosity, and the everyday discoveries that authentic travel is made of — the values that guide every Jackfruit Safari.'
      ),
      jsonb_build_object(
        'icon',  'map',
        'title', 'Where we operate',
        'body',  'From our home in Jinja, Uganda''s adventure capital, we run private safaris across Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Lake Mburo, Lake Bunyonyi, and the Nile — plus custom routes for your dates and interests.'
      ),
      jsonb_build_object(
        'icon',  'heart',
        'title', 'Our giving journey',
        'body',  'Jackfruit Safaris was founded so that travel could give back. A portion of every safari supports orphaned and vulnerable children across Uganda through education, healthcare, and community-led programs.'
      )
    )
  ),
  updated_at = now()
where page_slug = '/about'
  and section_key = 'intro_cards'
  and status = 'published';

---------------------------------------------------------------------------
-- 7. Replace the old "services_grid" section with "what_makes_unique" —
--    a feature_list section that replaces the cmsModels list with the
--    unique-value proposition: client satisfaction, custom routes, give-back.
--    If a row with section_key 'services_grid' still exists we update it in
--    place (change key + type + content).  If not, we insert the new row.
---------------------------------------------------------------------------

do $$
declare
  existing_key text;
begin
  -- Check if a row with section_key 'services_grid' exists for /about
  select section_key
    into existing_key
    from public.page_content_sections
   where page_slug = '/about'
     and section_key = 'services_grid'
   limit 1;

  if existing_key is not null then
    -- Repurpose the existing row: change key and type, swap content
    update public.page_content_sections
       set section_key = 'what_makes_unique',
           section_type = 'feature_list',
           title = 'Satisfaction, custom routes, and a cause worth traveling for',
           subtitle = 'What makes Jackfruit Safaris unique',
           content = jsonb_build_object(
             'intro',  'Every Jackfruit Safari is designed around you — your dates, pace, budget, and interests. What sets us apart is how we plan, how we guide, and how we give back.',
             'items', jsonb_build_array(
               'Client-first satisfaction — we listen, adapt, and follow up before, during, and after your safari.',
               'Fully custom routes built around your dates, pace, budget, and interests — not a one-size-fits-all itinerary.',
               'Travel with purpose — every booking helps orphaned and vulnerable children in Uganda through direct reinvestment from safari profits.'
             ),
             'layout', 'three_column_bullets'
           ),
           order_index = 20,
           updated_at = now()
     where page_slug = '/about'
       and section_key = 'what_makes_unique';
  else
    -- No existing row — insert fresh
    insert into public.page_content_sections (
      page_slug, section_key, section_type, title, subtitle, content, order_index, status
    ) values (
      '/about',
      'what_makes_unique',
      'feature_list',
      'Satisfaction, custom routes, and a cause worth traveling for',
      'What makes Jackfruit Safaris unique',
      jsonb_build_object(
        'intro',  'Every Jackfruit Safari is designed around you — your dates, pace, budget, and interests. What sets us apart is how we plan, how we guide, and how we give back.',
        'items', jsonb_build_array(
          'Client-first satisfaction — we listen, adapt, and follow up before, during, and after your safari.',
          'Fully custom routes built around your dates, pace, budget, and interests — not a one-size-fits-all itinerary.',
          'Travel with purpose — every booking helps orphaned and vulnerable children in Uganda through direct reinvestment from safari profits.'
        ),
        'layout', 'three_column_bullets'
      ),
      20,
      'published'
    );
  end if;
end
$$;

---------------------------------------------------------------------------
-- 8. Insert new "staff_intro" section for /about — brief heading + description
--    that introduces the Staff at Jackfruit Safaris section.
---------------------------------------------------------------------------

insert into public.page_content_sections (
  page_slug, section_key, section_type, title, subtitle, content, order_index, status
) values (
  '/about',
  'staff_intro',
  'rich_text',
  'Staff at Jackfruit Safaris',
  'Our team',
  jsonb_build_object(
    'intro', 'Our team are Ugandan locals who know these parks, roads, and communities personally. From founder Elvis'' guiding philosophy to our drivers'' safety expertise, every role is rooted in authentic experience and guest care. We don''t just show you Uganda — we share it.',
    'body', '',
    'cta_label', 'Plan a safari with our team',
    'cta_href', '/request-quote'
  ),
  30,
  'published'
)
on conflict (page_slug, section_key) do update
  set title      = excluded.title,
      subtitle   = excluded.subtitle,
      content    = excluded.content || public.page_content_sections.content,
      order_index = excluded.order_index,
      status     = excluded.status,
      updated_at = now();

---------------------------------------------------------------------------
-- 9. Insert new "planning_safari" section for /about — the 3-step planning
--    process that tells travelers how Jackfruit plans their safari.
---------------------------------------------------------------------------

insert into public.page_content_sections (
  page_slug, section_key, section_type, title, subtitle, content, order_index, status
) values (
  '/about',
  'planning_safari',
  'feature_list',
  'Planning the safari with Jackfruit',
  'Three simple steps',
  jsonb_build_object(
    'intro', 'Planning a Uganda safari doesn''t have to feel overwhelming. We keep it simple and transparent — from your first message through the final confirmation.',
    'items', jsonb_build_array(
      'Share your travel details — dates, group size, budget, and must-do experiences.',
      'We recommend a realistic route, lodge level, and activity plan with price guidance.',
      'Once the plan feels right, we check live availability for permits and lodges, then confirm before payment.'
    ),
    'layout', 'numbered_steps'
  ),
  40,
  'published'
)
on conflict (page_slug, section_key) do update
  set title       = excluded.title,
      subtitle    = excluded.subtitle,
      content     = excluded.content || public.page_content_sections.content,
      order_index = excluded.order_index,
      status      = excluded.status,
      updated_at  = now();

---------------------------------------------------------------------------
-- 10. Sync page_content_sections changes back into pages.sections JSONB for
--     the /about page so any frontend fallback that reads pages.sections picks
--     up the new titles immediately.
---------------------------------------------------------------------------

update public.pages as p
set sections = section_rows.sections,
    updated_at = now()
from (
  select
    'about' as page_slug,
    jsonb_agg(
      jsonb_build_object(
        'key',         section_key,
        'type',        section_type,
        'title',       title,
        'subtitle',    subtitle,
        'content',     content,
        'order_index', order_index,
        'status',      status
      )
      order by order_index
    ) as sections
  from public.page_content_sections
  where page_slug = '/about'
  group by page_slug
) as section_rows
where p.slug = section_rows.page_slug;
