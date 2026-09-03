-- Extend page_heroes table to support home-page-style hero content:
-- badge text, dual CTAs, and quick links.
-- These columns align the page_heroes structure with the homepage hero
-- (site_settings hero fields + homepage_quick_links) so that every
-- landing page can render the same badge + dual CTA + quick-links layout.

-- ---------------------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------------------

alter table public.page_heroes add column if not exists badge_text text;
alter table public.page_heroes add column if not exists cta_primary text;
alter table public.page_heroes add column if not exists cta_secondary text;
alter table public.page_heroes add column if not exists cta_primary_href text;
alter table public.page_heroes add column if not exists cta_secondary_href text;
alter table public.page_heroes add column if not exists quick_links jsonb;

-- Index for fast lookups on quick_links is unnecessary (jsonb), but an
-- index on cta fields is not needed either — these are read in single-row
-- queries by page_slug.

-- ---------------------------------------------------------------------------
-- Seed: populate badge_text, cta fields, and quick_links for every existing
-- page_hero row using the same values the homepage uses (coalesced so we
-- never overwrite already-customized content).
-- ---------------------------------------------------------------------------

-- Default quick links shared across secondary landing pages (same as homepage)

do $$
declare
  default_quick_links jsonb := jsonb_build_array(
    jsonb_build_object('label', 'Gorilla Trekking', 'href', '/experiences/gorilla-trekking'),
    jsonb_build_object('label', 'Murchison Falls', 'href', '/safaris/3-days-murchison-falls'),
    jsonb_build_object('label', '10 Days Uganda', 'href', '/safaris/10-days-uganda-safari'),
    jsonb_build_object('label', 'Jinja Activities', 'href', '/experiences/jinja-adventures'),
    jsonb_build_object('label', 'Airport Transfer', 'href', '/transport/airport-transfers')
  );
begin
  update public.page_heroes
  set
    badge_text        = coalesce(badge_text, eyebrow),
    cta_primary       = coalesce(cta_primary, 'Plan My Safari'),
    cta_secondary     = coalesce(cta_secondary, 'View Safari Packages'),
    cta_primary_href  = coalesce(cta_primary_href, '/request-quote'),
    cta_secondary_href = coalesce(cta_secondary_href, '/safaris'),
    quick_links       = coalesce(quick_links, default_quick_links)
  where badge_text is null
     or cta_primary is null
     or cta_secondary is null
     or cta_primary_href is null
     or cta_secondary_href is null
     or quick_links is null;
end
$$;

-- ---------------------------------------------------------------------------
-- Realtime: include page_heroes in the refresh-event trigger set (it is
-- already covered by the unified migration 202609020001, but this is a
-- safety net for projects that ran an earlier subset of migrations).
-- ---------------------------------------------------------------------------
-- (Triggers are re-asserted by the latest realtime migration; no action needed here.)
