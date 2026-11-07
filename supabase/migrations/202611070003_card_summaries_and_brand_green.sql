-- Jackfruit Safaris - destination card summaries + brand green from the logo
-- 1. Add a short, inspiring summary column for the destinations listing cards
--    (the long editorial overview stays on the detail page).
-- 2. Update the destination summaries with short card copy.
-- 3. Move the brand primary green to #207458 (the logo green) and harmonize
--    the secondary green, inside BOTH the aesthetics palette jsonb and the
--    legacy brand_*_color columns when they exist.
-- Run after 202611070001 and 202611070002.

-- ---------------------------------------------------------------------------
-- 1. Card summary column
-- ---------------------------------------------------------------------------

alter table public.destinations
  add column if not exists summary text not null default '';

-- ---------------------------------------------------------------------------
-- 2. Short, card-facing summaries (detail pages keep the long overview)
-- ---------------------------------------------------------------------------

update public.destinations set summary = $ov$Meet a habituated mountain gorilla family in one of Earth''s oldest rainforests - the hour many travelers save years for, planned down to the trailhead.$ov$,
  updated_at = now()
where slug = 'bwindi-impenetrable-national-park';

update public.destinations set summary = $ov$Rhinos on foot before breakfast, big game at dawn on the Buligi circuits, and the Nile forcing its way through a seven-metre gorge.$ov$,
  updated_at = now()
where slug = 'murchison-falls-national-park';

update public.destinations set summary = $ov$Tree-climbing lions, hippo crowds on the Kazinga Channel, and chimps in a sunken forest - Uganda''s most varied park in one route.$ov$,
  updated_at = now()
where slug = 'queen-elizabeth-national-park';

update public.destinations set summary = $ov$East Africa''s most reliable half-day chimpanzee trek, plus Bigodi''s swamps and crater-country sunsets around Fort Portal.$ov$,
  updated_at = now()
where slug = 'kibale-forest-national-park';

update public.destinations set summary = $ov$Walk with zebras and giraffes on foot or horseback, drift past the lake by boat, and rest easy on the Entebbe-to-Bwindi corridor.$ov$,
  updated_at = now()
where slug = 'lake-mburo-national-park';

update public.destinations set summary = $ov$The cool, island-studded lake where you can safely swim - Uganda''s favorite slow final night after gorilla trekking.$ov$,
  updated_at = now()
where slug = 'lake-bunyonyi';

update public.destinations set summary = $ov$The source of the Nile by morning and white-water by afternoon - Uganda''s adventure capital, and the town Jackfruit Safaris calls home.$ov$,
  updated_at = now()
where slug = 'jinja-source-of-the-nile';

-- ---------------------------------------------------------------------------
-- 3. Brand green directly from the logo: primary #207458, secondary harmonized
--    (#2F8F6C, the same hue one step lighter). Updates the aesthetics palette
--    jsonb and the legacy columns when the columns exist.
-- ---------------------------------------------------------------------------

update public.site_settings
set
  aesthetics = case
    when aesthetics is null then
      jsonb_build_object('palette', jsonb_build_object(
        'primary', '#207458',
        'secondary', '#2F8F6C',
        'accent', '#f5bf2f',
        'background', '#fbfaf5',
        'surface', '#ffffff',
        'text', '#10251b',
        'muted_text', '#536154'
      ))
    else
      jsonb_set(
        jsonb_set(aesthetics, '{palette,primary}', '"#207458"'::jsonb, true),
        '{palette,secondary}', '"#2F8F6C"'::jsonb, true)
  end,
  favicon_url = '/favicon.ico',
  updated_at = now()
where id = (
  select id
  from public.site_settings
  order by updated_at desc nulls last, created_at desc nulls last
  limit 1
);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings'
      and column_name = 'brand_primary_color'
  ) then
    execute 'update public.site_settings set brand_primary_color = ''#207458''';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings'
      and column_name = 'brand_secondary_color'
  ) then
    execute 'update public.site_settings set brand_secondary_color = ''#2F8F6C''';
  end if;
end $$;
