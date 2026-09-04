-- Destination content enhancements: how_to_get_there, key_highlights, and
-- safari-destination relationship columns. Also seeds all published destinations
-- with up-to-date content for overview, activities, travel directions, and
-- key highlights with images.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Add new columns to the destinations table
-- ---------------------------------------------------------------------------

alter table public.destinations
  add column if not exists how_to_get_there text[] not null default '{}'::text[],
  add column if not exists key_highlights jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- 2. Add related_destinations (slug-based) to safari_packages for
--    destination-specific safari filtering on detail pages.
--    The existing related_destination_ids (uuid[]) field can be used in future
--    for UUID-based joins, but slug-based matching is simpler for migrations
--    and CMS admin forms.
-- ---------------------------------------------------------------------------

alter table public.safari_packages
  add column if not exists related_destinations text[] not null default '{}'::text[];

-- ---------------------------------------------------------------------------
-- 3. Seed / update all published destinations with enriched content
-- ---------------------------------------------------------------------------

-- Bwindi Impenetrable National Park
update public.destinations
set
  status = 'published',
  overview = 'Bwindi Impenetrable National Park protects the mist-shrouded montane forest home to roughly half the world''s remaining mountain gorillas. A UNESCO World Heritage Site, the park covers 331 km² of dense jungle on Uganda''s southwestern border, where ancient trees, orchids, and over 300 bird species create a pristine safari wilderness. Jackfruit Safaris arranges fully supported gorilla treks with licensed guides, permit planning, and lodge options matched to your chosen sector (Buhoma, Ruhija, or Nkuringo).',
  why_go = array[
    'Mountain gorilla trekking (permits required)',
    'Guided forest nature walks and birdwatching',
    'Batwa cultural experiences and community visits',
    'Orchid and endemic flora spotting',
    'Chimpanzee and wildlife viewing in the forest edge'
  ],
  how_to_get_there = array[
    'From Kampala: 8–9 hour drive via Mbarara and the western Rift Valley',
    'From Entebbe: 9–10 hour drive via Masaka and Mbarara',
    'Domestic flights: Kihihi airstrip (charter from Entebbe or Kajjansi)',
    'Recommended: combine with Lake Bunyonyi for post-trek relaxation'
  ],
  key_highlights = jsonb_build_array(
    jsonb_build_object(
      'title', 'Gorilla Family Tracking',
      'description', 'Spend one unforgettable hour observing endangered mountain gorillas in their natural habitat, guided by Uganda Wildlife Authority rangers.',
      'image_url', 'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Batwa Cultural Experience',
      'description', 'Walk with the Batwa people, Uganda''s forest-dwelling ancestors, and learn their traditional ways of living in the jungle.',
      'image_url', 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Bwindi Birdlife',
      'description', 'With over 300 bird species including the Rwenzori turaco and African green broadbill, the forest is a birder''s paradise.',
      'image_url', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Forest Nature Walks',
      'description', 'Guided trails through the montane forest reveal orchids, ferns, and other endemic flora alongside wildlife signs.',
      'image_url', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82'
    )
  ),
  best_time = 'March–May and October–November for fewer crowds; June–September for drier trails. December to February is ideal for gorilla tracking in the dry season.',
  recommended_nights = '2-3 nights depending on sector and comfort level',
  published_at = coalesce(published_at, now()),
  updated_at = now()
where slug = 'bwindi-impenetrable-national-park';

-- Murchison Falls National Park
update public.destinations
set
  status = 'published',
  overview = 'Murchison Falls National Park is Uganda''s largest protected area at 3,840 km², spanning savannah, woodland, and wetlands along the Victoria Nile. The park''s centerpiece is the dramatic Murchison Falls, where the Nile squeezes through a 7-meter gorge before thundering into a spectacular cascade. Wildlife includes elephants, giraffes, buffaloes, lions, leopards, hippos, crocodiles, and the rare shoebill stork. Jackfruit Safaris arranges game drives, Nile boat safaris, and rhino tracking at nearby Ziwa Rhino Sanctuary.',
  why_go = array[
    'Boat safari to the base of Murchison Falls',
    'Game drives on the Buligi Circuit',
    'Hike to the Top of the Falls viewpoint',
    'Rhino tracking at Ziwa Rhino Sanctuary',
    'Shoebill stork watching in the Lake Albert Delta',
    'Chimpanzee tracking in Budongo Forest'
  ],
  how_to_get_there = array[
    'From Kampala: 300 km via Masindi — 6+ hour drive (roads now paved)',
    'From Fort Portal: 320 km via Hoima — 6+ hour drive',
    'Domestic flights: Pakuba Airfield via AeroLink from Entebbe or Kajjansi',
    'Charter flights also available from Entebbe or Kajjansi'
  ],
  key_highlights = jsonb_build_array(
    jsonb_build_object(
      'title', 'Murchison Falls',
      'description', 'Watch 300 cubic meters of water plunge through a 7-meter gorge in a breathtaking display of raw power and mist.',
      'image_url', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Nile Boat Safari',
      'description', 'Cruise to the base of the falls and witness hippos, crocodiles, elephants, and river birds along the scenic waterway.',
      'image_url', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Ziwa Rhino Sanctuary',
      'description', 'Track endangered southern white rhinos with expert guides on guided rhino walks at this critical conservation site.',
      'image_url', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Top of the Falls',
      'description', 'Hike 500 steps to the viewpoint for dramatic perspectives of the cascade and rainbow over the gorge.',
      'image_url', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82'
    )
  ),
  best_time = 'December to February (dry season) for excellent wildlife viewing; June to September (high season) for peak conditions and lion sightings.',
  recommended_nights = '2-3 nights',
  featured_image_url = coalesce(featured_image_url, 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82'),
  published_at = coalesce(published_at, now()),
  updated_at = now()
where slug = 'murchison-falls-national-park';

-- Queen Elizabeth National Park
update public.destinations
set
  status = 'published',
  overview = 'Queen Elizabeth National Park spans 1,978 km² at the intersection of the Albertine Rift and the Great Lakes, offering Uganda''s most diverse safari experiences. From savannah grasslands in the north to forested Rift Valley rims in the south, the park is home to all the Big Five except rhino. Famous for tree-climbing lions in Ishasha, the Kazinga Channel boat cruise, and over 600 bird species, it naturally extends gorilla trekking routes from Bwindi.',
  why_go = array[
    'Kazinga Channel boat cruise (hippos, crocodiles, birds)',
    'Ishasha tree-climbing lions (south sector)',
    'Game drives on the northern circuit',
    'Crater lake birdwatching',
    'Chimpanzee tracking in Kyambura Gorge'
  ],
  how_to_get_there = array[
    'From Kampala: 380 km via Mbarara — 6–7 hour drive',
    'From Entebbe: 6–7 hour drive via Masaka and Mbarara',
    'Domestic flights: Kihihi or Mbarara airstrips from Entebbe or Kajjansi',
    '3-hour drive south to Bwindi; 2-hour drive north to Kibale'
  ],
  key_highlights = jsonb_build_array(
    jsonb_build_object(
      'title', 'Kazinga Channel Boat Cruise',
      'description', 'Navigate the channel between Lakes Edward and George, spotting hippos, crocodiles, buffalo, and over 300 bird species.',
      'image_url', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Ishasha Tree-Climbing Lions',
      'description', 'Witness lions lounging in the branches of fig trees, a rare behavior unique to this lion population.',
      'image_url', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Kyambura Gorge Chimpanzees',
      'description', 'Trek through misty gorge forest to encounter habituated chimpanzees in a dramatic setting.',
      'image_url', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Crater Lakes',
      'description', 'Explore scenic crater lakes of the Rwenzori foothills, perfect for photography and quiet nature walks.',
      'image_url', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82'
    )
  ),
  best_time = 'June to September for peak wildlife viewing and lion sightings; December to February for dry-season clarity. March to May and October to November for fewer crowds and birding.',
  recommended_nights = '2-3 nights',
  featured_image_url = coalesce(featured_image_url, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82'),
  published_at = coalesce(published_at, now()),
  updated_at = now()
where slug = 'queen-elizabeth-national-park';

-- Kibale Forest National Park
update public.destinations
set
  status = 'published',
  overview = 'Kibale National Park protects 795 km² of regenerating and primary Afrotropical rainforest, home to the world''s largest population of chimpanzees and over 13 primate species. Established in 1991, the park sits between the Rwenzori foothills and the Fort Portal plateau, offering cool temperatures, misty mornings, and dense forest trails. Visitors track chimpanzees in the wild, walk the Bigodi Wetland boardwalks for birdwatching, and experience community-based tourism with the local Bakole people.',
  why_go = array[
    'Chimpanzee tracking (permits required)',
    'Bigodi Wetland boardwalk walks and birdwatching',
    'Forest birdwatching (over 350 species recorded)',
    'Red colobus monkey viewing',
    'Community village visits',
    'Night walks for nocturnal primates'
  ],
  how_to_get_there = array[
    'From Kampala: 310 km via Mbarara — 5–6 hour drive',
    'From Fort Portal: 35 km — under 1 hour drive',
    'From Entebbe: 6–7 hour drive via Kampala and Mbarara',
    'Nearest charter airstrip: Kihihi or Fort Portal from Entebbe'
  ],
  key_highlights = jsonb_build_array(
    jsonb_build_object(
      'title', 'Chimpanzee Tracking',
      'description', 'Follow habituated chimpanzees through the rainforest, spending up to 8 hours with these intelligent primates.',
      'image_url', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Bigodi Wetland Sanctuary',
      'description', 'Walk elevated boardwalks through papyrus and marsh, spotting blue monkeys, bushbabies, and over 180 bird species.',
      'image_url', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82'
    ),
    jsonb_build_object(
      'title', 'Forest Elephant Trail',
      'description', 'Spot the rare forest elephant and other wildlife along lesser-known forest paths deep in the rainforest.',
      'image_url', 'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Primate Diversity',
      'description', 'Encounter black-and-white colobus monkeys, red colobus, and L''Hoest''s monkeys in their natural forest habitat.',
      'image_url', 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1600&q=82'
    )
  ),
  best_time = 'June to September and December to February for drier trails; March to May and October to November for birdwatching and fewer tourists.',
  recommended_nights = '1-2 nights',
  featured_image_url = coalesce(featured_image_url, 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82'),
  published_at = coalesce(published_at, now()),
  updated_at = now()
where slug = 'kibale-forest-national-park';

-- Lake Mburo National Park
update public.destinations
set
  status = 'published',
  overview = 'Lake Mburo National Park is Uganda''s smallest protected area at 370 km², but one of its most accessible — just 3 to 4 hours from Kampala. Unlike Uganda''s forest parks, Lake Mburo features open acacia woodland and savannah, supporting unique species like the rare impala and large herds of Burchell''s zebra. The park offers walking safaris, night drives, boat cruises on the lake, and horseback safaris. As one of the few Ugandan parks open year-round, it''s an ideal introduction to Ugandan wildlife or a restful stopover.',
  why_go = array[
    'Guided walking safaris on foot (the only park without lions or elephants)',
    'Night game drives for leopards and buffalo',
    'Boat cruise on Lake Mburo (hippos, crocodiles, waterbirds)',
    'Horseback riding safaris',
    'Birdwatching (over 350 species including African finfoot)',
    'Cultural visits to nearby communities'
  ],
  how_to_get_there = array[
    'From Kampala: 250 km — 3–4 hour drive via Masaka',
    'From Entebbe: 4–5 hour drive via Kampala and Masaka',
    'From Mbarara: 80 km — 1.5 hour drive',
    'No commercial flights; drive is the only access to the park'
  ],
  key_highlights = jsonb_build_array(
    jsonb_build_object(
      'title', 'Walking Safaris',
      'description', 'Safely walk acacia woodland trails on foot, the only park in Uganda where this is possible without lions or elephants.',
      'image_url', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Lake Mburo Boat Cruise',
      'description', 'Cruise the lake''s shoreline, spotting hippos, crocodiles, and waterbirds including the rare African finfoot.',
      'image_url', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Zebra Herds',
      'description', 'Photograph large herds of Burchell''s zebra, Uganda''s largest zebra population, in the open savannah grassland.',
      'image_url', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Night Game Drives',
      'description', 'Search for nocturnal wildlife including leopards, porcupines, and genets under the African night sky.',
      'image_url', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82'
    )
  ),
  best_time = 'January to February and June to August for dry-season wildlife viewing; January to October generally offers good conditions.',
  recommended_nights = '1-2 nights',
  featured_image_url = coalesce(featured_image_url, 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82'),
  published_at = coalesce(published_at, now()),
  updated_at = now()
where slug = 'lake-mburo-national-park';

-- Lake Bunyonyi
update public.destinations
set
  status = 'published',
  overview = 'Lake Bunyonyi, meaning "a place of many little birds," sits at 6,308 feet above sea level in southwestern Uganda, making it one of the highest lakes in the region. The scenic lake stretches 29 km through misty hills, dotted with 29 small islands connected by traditional dugout canoes and guided canoe safaris. The area offers a peaceful retreat after the intensity of gorilla trekking, with cool temperatures year-round, terraced hillsides, and opportunities to interact with the Batwa community. Jackfruit Safaris recommends Lake Bunyonyi as a restful addition to any Bwindi or Queen Elizabeth circuit.',
  why_go = array[
    'Guided canoe safaris on the lake',
    'Island hopping between the 29 islands',
    'Batwa village visits and cultural walks',
    'Birdwatching along the lakeshore',
    'Hiking to viewpoints over the Rift Valley',
    'Relaxation after gorilla trekking'
  ],
  how_to_get_there = array[
    'From Kampala: 400 km via Mbarara — 7–8 hour drive',
    'From Entebbe: 8–9 hour drive via Kampala and Mbarara',
    'From Bwindi (Buhoma): 1-hour drive',
    'From Kihihi: 30-minute drive',
    'No commercial flights; drive is the only access'
  ],
  key_highlights = jsonb_build_array(
    jsonb_build_object(
      'title', 'Canoe Safaris',
      'description', 'Paddle traditional dugout canoes across the glassy lake, spotting bushbuck, bush pigs, and over 200 bird species from the water.',
      'image_url', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Terraced Hillsides',
      'description', 'Walk through meticulously terraced hillsides cultivated with bananas, maize, and beans by local communities for generations.',
      'image_url', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82'
    ),
    jsonb_build_object(
      'title', 'Batwa Cultural Experience',
      'description', 'Meet the Batwa people, learn their traditional songs, storytelling, and sustainable forest living practices.',
      'image_url', 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Island Hopping',
      'description', 'Visit the 29 small islands, including Punishment Island and Thin Island, each with its own story and lakeside viewpoint.',
      'image_url', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'
    )
  ),
  best_time = 'December to February and June to September for clear skies and calm waters; dry season makes canoeing and hiking most comfortable.',
  recommended_nights = '1-2 nights',
  featured_image_url = coalesce(featured_image_url, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82'),
  published_at = coalesce(published_at, now()),
  updated_at = now()
where slug = 'lake-bunyonyi';

-- Jinja and the Source of the Nile
update public.destinations
set
  status = 'published',
  overview = 'Jinja sits on the northern shore of Lake Victoria where the Nile River begins its 6,650-kilometer journey to the Mediterranean. As Uganda''s adventure capital and the historic source of the Nile, Jinja offers world-class white-water rafting, bungee jumping, quad biking, cycling tours, and boat excursions to the famous source point. Jackfruit Safaris provides transfers, activity bookings, and guided experiences for travelers arriving at Entebbe International Airport or extending a safari with Nile adventures. The town also serves as a convenient base for exploring eastern Uganda and nearby Mabira Forest.',
  why_go = array[
    'White-water rafting on the Nile (Grade 3-5 rapids)',
    'Bungee jumping at the Wildwaters Club (44m)',
    'Source of the Nile boat tour',
    'Cycling tours through villages and plantations',
    'Quad biking in the bush',
    'Mabira Forest canopy walks'
  ],
  how_to_get_there = array[
    'From Kampala: 80 km — 1.5–2 hour drive via the New Jinja Bridge',
    'From Entebbe: 2–2.5 hour drive via Kampala',
    'Domestic flights: Entebbe to Kajjansi airstrip, then 2-hour drive to Jinja',
    'Regular bus and taxi services between Kampala and Jinja'
  ],
  key_highlights = jsonb_build_array(
    jsonb_build_object(
      'title', 'White-Water Rafting',
      'description', 'Navigate the Nile''s intense rapids with professional guides, suitable for beginners and experienced rafters alike.',
      'image_url', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Source of the Nile',
      'description', 'Boat to the spot where the White Nile begins its journey, marked by a monument and lakeside viewpoint.',
      'image_url', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82'
    ),
    jsonb_build_object(
      'title', 'Bungee Jumping',
      'description', 'Leap 44 meters into the gorge at Wildwaters Club, one of Africa''s most spectacular bungee jumping sites.',
      'image_url', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82'
    ),
    jsonb_build_object(
      'title', 'Mabira Forest Canopy Walk',
      'description', 'Walk suspended bridges through the rainforest canopy, spotting primates and over 300 bird species.',
      'image_url', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82'
    )
  ),
  best_time = 'December to February and June to September for dry-season rafting; water levels are highest during rainy seasons (April–May and October–November).',
  recommended_nights = '1-3 nights (flexible for arrival or departure days)',
  featured_image_url = coalesce(featured_image_url, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82'),
  published_at = coalesce(published_at, now()),
  updated_at = now()
where slug = 'jinja-source-of-the-nile';

-- ---------------------------------------------------------------------------
-- 4. Seed related_destinations on existing safari_packages
--    (links each safari to the destinations it features)
-- ---------------------------------------------------------------------------

-- 3 Days Gorilla Tracking → Bwindi + Lake Bunyonyi
update public.safari_packages
set related_destinations = array[
  'bwindi-impenetrable-national-park',
  'lake-bunyonyi'
]
where slug = '3-days-gorilla-tracking';

-- 3 Days Murchison Falls → Murchison Falls NP
update public.safari_packages
set related_destinations = array[
  'murchison-falls-national-park'
]
where slug = '3-days-murchison-falls';

-- 10 Days Uganda Safari → full circuit (all parks)
update public.safari_packages
set related_destinations = array[
  'lake-mburo-national-park',
  'kibale-forest-national-park',
  'queen-elizabeth-national-park',
  'bwindi-impenetrable-national-park',
  'lake-bunyonyi'
]
where slug = '10-days-uganda-safari';

-- Custom Uganda Safari → all destinations (flexible)
update public.safari_packages
set related_destinations = array[
  'bwindi-impenetrable-national-park',
  'murchison-falls-national-park',
  'queen-elizabeth-national-park',
  'kibale-forest-national-park',
  'lake-mburo-national-park',
  'lake-bunyonyi',
  'jinja-source-of-the-nile'
]
where slug = 'custom-uganda-safari';

-- ---------------------------------------------------------------------------
-- 5. Add a destination_intro content section for the Destinations listing page
--    so the intro paragraph is CMS-editable
-- ---------------------------------------------------------------------------

insert into public.page_content_sections (
  page_slug, section_key, section_type, title, subtitle, content, order_index, status
) values (
  '/destinations',
  'destination_intro',
  'rich_text',
  'Uganda''s premier adventure destinations',
  'Destinations intro',
  $json${
    "intro": "Each destination below is chosen for its distinct wildlife, landscape, or adventure — from mountain gorillas in misty Bwindi to the roaring cataract of Murchison Falls, from chimpanzee tracking in Kibale to highland canoeing on Lake Bunyonyi, and the adventure capital of Jinja at the source of the Nile. Jackfruit Safaris plans the routes, timing, and logistics so you can focus on the experience.",
    "fallback_title": "Uganda''s premier adventure destinations"
  }$json$::jsonb,
  5,
  'published'::public.content_status
)
on conflict (page_slug, section_key) do update
set section_type = excluded.section_type,
    title = excluded.title,
    subtitle = excluded.subtitle,
    content = excluded.content || public.page_content_sections.content,
    order_index = excluded.order_index,
    status = excluded.status,
    updated_at = now();

-- Sync to pages.sections JSONB
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
  where page_slug = '/destinations'
  group by page_slug
) as section_rows
where p.slug = section_rows.page_slug;

-- ---------------------------------------------------------------------------
-- 6. Add destination detail page heroes to page_heroes for CMS editing
--    These provide badge_text, cta fields, and quick_links for each destination
--    detail page, matching the homepage HeroSection style.
-- ---------------------------------------------------------------------------

do $$
declare
  dest_page slug;
begin
  -- Bwindi detail page hero
  if not exists (select 1 from public.page_heroes where page_slug = '/destinations/bwindi-impenetrable-national-park') then
    insert into public.page_heroes (page_slug, badge_text, title, intro, background_image, cta_primary, cta_secondary, cta_primary_href, cta_secondary_href, quick_links, status)
    values ('/destinations/bwindi-impenetrable-national-park',
      'Southwestern Uganda', 'Bwindi Impenetrable National Park',
      'Home to half the world''s remaining mountain gorillas, Bwindi''s mist-shrouded forest offers transformative chimp and primate tracking, cultural encounters with the Batwa, and guided nature walks.',
      'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82',
      'Plan My Safari', 'View Safari Packages', '/request-quote', '/safaris',
      '[{"label":"Gorilla Trekking","href":"/experiences/gorilla-trekking"},{"label":"10 Days Uganda","href":"/safaris/10-days-uganda-safari"},{"label":"Lake Bunyonyi","href":"/destinations/lake-bunyonyi"},{"label":"Jinja Activities","href":"/experiences/jinja-adventures"},{"label":"Airport Transfer","href":"/transport/airport-transfers"}]',
      'published');
  end if;

  -- Murchison Falls detail page hero
  if not exists (select 1 from public.page_heroes where page_slug = '/destinations/murchison-falls-national-park') then
    insert into public.page_heroes (page_slug, badge_text, title, intro, background_image, cta_primary, cta_secondary, cta_primary_href, cta_secondary_href, quick_links, status)
    values ('/destinations/murchison-falls-national-park',
      'Northwestern Uganda', 'Murchison Falls National Park',
      'Uganda''s largest national park, centered on the dramatic Murchison Falls where the Nile crashes through a gorge. Game drives, Nile boat safaris, rhino tracking at Ziwa, and shoebill watching await.',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82',
      'Plan My Safari', 'View Safari Packages', '/request-quote', '/safaris',
      '[{"label":"Gorilla Trekking","href":"/experiences/gorilla-trekking"},{"label":"Murchison Falls Safari","href":"/safaris/3-days-murchison-falls"},{"label":"10 Days Uganda","href":"/safaris/10-days-uganda-safari"},{"label":"Airport Transfer","href":"/transport/airport-transfers"}]',
      'published');
  end if;

  -- Queen Elizabeth detail page hero
  if not exists (select 1 from public.page_heroes where page_slug = '/destinations/queen-elizabeth-national-park') then
    insert into public.page_heroes (page_slug, badge_text, title, intro, background_image, cta_primary, cta_secondary, cta_primary_href, cta_secondary_href, quick_links, status)
    values ('/destinations/queen-elizabeth-national-park',
      'Western Uganda', 'Queen Elizabeth National Park',
      'Uganda''s most diverse park, spanning savannah and Rift Valley forests. Famous for tree-climbing lions in Ishasha, Kazinga Channel boat cruises, and over 600 bird species.',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82',
      'Plan My Safari', 'View Safari Packages', '/request-quote', '/safaris',
      '[{"label":"Gorilla Trekking","href":"/experiences/gorilla-trekking"},{"label":"10 Days Uganda","href":"/safaris/10-days-uganda-safari"},{"label":"Chimp Tracking","href":"/experiences/gorilla-trekking"},{"label":"Airport Transfer","href":"/transport/airport-transfers"}]',
      'published');
  end if;

  -- Kibale Forest detail page hero
  if not exists (select 1 from public.page_heroes where page_slug = '/destinations/kibale-forest-national-park') then
    insert into public.page_heroes (page_slug, badge_text, title, intro, background_image, cta_primary, cta_secondary, cta_primary_href, cta_secondary_href, quick_links, status)
    values ('/destinations/kibale-forest-national-park',
      'Western Uganda', 'Kibale Forest National Park',
      'Home to the world''s largest chimpanzee population and 13 primate species. Trek through misty rainforest, walk Bigodi Wetland boardwalks, and experience community-based tourism.',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82',
      'Plan My Safari', 'View Safari Packages', '/request-quote', '/safaris',
      '[{"label":"Chimp Tracking","href":"/experiences/gorilla-trekking"},{"label":"10 Days Uganda","href":"/safaris/10-days-uganda-safari"},{"label":"Jinja Activities","href":"/experiences/jinja-adventures"},{"label":"Airport Transfer","href":"/transport/airport-transfers"}]',
      'published');
  end if;

  -- Lake Mburo detail page hero
  if not exists (select 1 from public.page_heroes where page_slug = '/destinations/lake-mburo-national-park') then
    insert into public.page_heroes (page_slug, badge_text, title, intro, background_image, cta_primary, cta_secondary, cta_primary_href, cta_secondary_href, quick_links, status)
    values ('/destinations/lake-mburo-national-park',
      'Western Uganda', 'Lake Mburo National Park',
      'Uganda''s smallest but most accessible park. Walk safaris on foot, boat cruise on the lake, and spot zebra herds and rare impala in open acacia woodland.',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82',
      'Plan My Safari', 'View Safari Packages', '/request-quote', '/safaris',
      '[{"label":"Gorilla Trekking","href":"/experiences/gorilla-trekking"},{"label":"10 Days Uganda","href":"/safaris/10-days-uganda-safari"},{"label":"Jinja Activities","href":"/experiences/jinja-adventures"},{"label":"Airport Transfer","href":"/transport/airport-transfers"}]',
      'published');
  end if;

  -- Lake Bunyonyi detail page hero
  if not exists (select 1 from public.page_heroes where page_slug = '/destinations/lake-bunyonyi') then
    insert into public.page_heroes (page_slug, badge_text, title, intro, background_image, cta_primary, cta_secondary, cta_primary_href, cta_secondary_href, quick_links, status)
    values ('/destinations/lake-bunyonyi',
      'Southwestern Uganda', 'Lake Bunyonyi',
      'A scenic highland lake dotted with 29 islands, perfect for canoe safaris, terraced hill walks, and Batwa cultural visits after gorilla trekking.',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82',
      'Plan My Safari', 'View Safari Packages', '/request-quote', '/safaris',
      '[{"label":"Gorilla Trekking","href":"/experiences/gorilla-trekking"},{"label":"Bwindi","href":"/destinations/bwindi-impenetrable-national-park"},{"label":"Jinja Activities","href":"/experiences/jinja-adventures"},{"label":"Airport Transfer","href":"/transport/airport-transfers"}]',
      'published');
  end if;

  -- Jinja detail page hero
  if not exists (select 1 from public.page_heroes where page_slug = '/destinations/jinja-source-of-the-nile') then
    insert into public.page_heroes (page_slug, badge_text, title, intro, background_image, cta_primary, cta_secondary, cta_primary_href, cta_secondary_href, quick_links, status)
    values ('/destinations/jinja-source-of-the-nile',
      'Eastern Uganda', 'Jinja and the Source of the Nile',
      'Uganda''s adventure capital on Lake Victoria where the Nile begins its journey. Rafting, bungee jumping, cycling, and the famous Source of the Nile tour await.',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82',
      'Plan My Safari', 'View Safari Packages', '/request-quote', '/safaris',
      '[{"label":"Jinja Activities","href":"/experiences/jinja-adventures"},{"label":"Airport Transfer","href":"/transport/airport-transfers"},{"label":"Gorilla Trekking","href":"/experiences/gorilla-trekking"},{"label":"10 Days Uganda","href":"/safaris/10-days-uganda-safari"}]',
      'published');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 7. Add destination_intro content sections for each destination detail page
--    This provides a dedicated CMS-editable overview section per destination
-- ---------------------------------------------------------------------------

-- (Sections will reuse the destinations table overview field for the hero,
--  and the page_content_sections table provides the dedicated overview section.
--  Each destination detail page will look up its overview from the destinations
--  table directly, so no separate content section rows are needed here.
--  The content section approach is reserved for listing/intro text that
--  differs from the entity record.)
--
-- No additional rows needed — destination overviews are stored in the
-- destinations table and fetched via getDestinationBySlug.
