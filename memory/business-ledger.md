# Jackfruit Safaris — Project Ledger (codex-travel-agent)

Last updated: 2026-11-07 by OpenCode session

## Business profile (working notes)

- Identity: Jackfruit Safaris, private tailor-made Uganda safari company, based in Jinja. Registered Ugandan tour company; founded by Elvis Tumwebaze; a portion of safari profit supports orphaned & vulnerable children (education/healthcare/community). Site: https://jackfruitsafarisuganda.com, workspace E:\Jackfruit Safaris.
- Model: local operator + agency (planning service). Lead generation via Request Quote / WhatsApp. No claimed accreditation/partnerships beyond what exists on site (accreditation logos component present — verify inventory before adding claims).
- Geography: Uganda (Rwanda mentioned in branding). Traveler origin: international (USD pricing) — treat as English-speaking FNR audience.
- Audiences: budget → luxury private travelers; interests gorillas, wildlife, chimps, Nile adventure, culture; comfort levels budget/mid-range/luxury.
- Publishing: Next.js 16 App Router + Supabase CMS (src/app, supabase/migrations). Public content flows from CMS tables (page_heroes, page_content_sections, destinations, safari_packages, experiences, site_settings). Content is mirrored by SQL migrations; owner applies via their pipeline. NO local .env — no direct DB write from here; do not claim published state without owner confirmation of live URL.
- Brand rules: brand colors live in globals.css CSS variables (--brand-primary #143c2d, --brand-secondary #2d6f55, --brand-accent #f5bf2f, ink #10251b) + CMS site_aesthetics_settings — DO NOT change palette. Stacked h1/subtitle hero pattern is intentional (hero_subtitle_heading pattern from 202609050001). Eye for: uppercase tracking kickers, font-black headings, rounded-full CTAs. Owner voice: warm, practical, local-expert, honest.
- Continuity: see "Deliverables status" below.

## Authorizations

- Requested this session: (1) front-end polish of the site preserving brand colors; (2) comprehensive researched content for listing landing pages (destinations, safaris, experiences) mirrored to CMS backend; (3) smooth UI/UX navigation.
- NOT authorized/confirmed: git push/deploy, applying migrations to live DB (no credentials here), publishing externally. Prepared work must be reportable as "prepared".

## Deliverables status

- [x] A1 Polish: duplicate hero heading + jargon intros on landing pages — migration 202611070001_polish_hero_copy_and_listing_sections.sql (page_heroes ×5, entity_card_grid sections ×2, force-update) + aligned fallbacks in src/lib/content.ts. Verified: eslint clean; SQL balanced. NOT applied to live DB yet.
- [x] B1 Content: destinations (7) — migration 202611070002_listing_content_breakdowns.sql: overview/why_go/how_to_get_there/top_experiences/wildlife/best_time/nights/meta for all 7 destinations.
- [x] B2 Content: safari packages (3) — itinerary day bodies, accommodation_options, permits jsonb, FAQ (6/5/5 Qs), permit_rate_warning with verified UWA facts. Owner prices untouched.
- [x] B3 Content: experiences (4) refreshed + NEW chimpanzee-tracking experience (5th) with researched content; QE/Kibale "Chimp Tracking" quick-links repointed from /experiences/gorilla-trekking to /experiences/chimpanzee-tracking.
- [x] All JSON blocks in the content migration parse (10/10); $ov$ tags balanced (16 DML, 0 odd); file normalized to ASCII.
- [ ] C1 outstanding adaptive checks: visually verify /experiences/chimpanzee-tracking renders with the new card (needs live CMS apply first).
- [ ] Apply migrations + confirm live (needs owner: supabase db push / dashboard SQL editor). Report live URLs after.

## Source ledger (facts verified for content)

- UWA Conservation Tariff Jul 2024–Jun 2026 (official PDF) + UWA letter 26 Feb 2026 [checked via: visitmurchisonfalls.com 17 Aug 2026; visitqueenelizabeth.com 18 Sep 2026; eafricaconnect.com 23 Oct 2026; kikooko.travel 21 Sep 2026; Roameo 28 Aug 2026; Gorilla Planner checked 2 Oct 2026; Savanna Sync 18 Sep 2026] — Murchison entry US$45 (A+), Category A US$40; gorilla FNR US$800 / low-season US$600 Apr-May-Nov 2026 (non-reschedulable); habituation US$1,500 -> US$1,800 (1 Jan 2027); full payment at booking since 1 Mar 2026; FNR permits via UTB-licensed operators; age 15+; 8 visitors per family; Kibale chimp US$250–300 by tariff cycle (stated honestly as "confirmed at booking"); Kyambura US$100; Nile launch cruises ~US$30; Top of Falls US$10/US$15.
- Ziwa rhino trekking: priced by the sanctuary — kept qualitative in content ("included when quoted").
- Jinja rafting rates: jinjatours.com (+ operator ranges 2026 articles) — full day ~US$135–145, half day ~US$120, family float from ~US$50–60; stated as operator-set and confirmed at booking.
- Destination overviews draw on editorial knowledge base (sector names, drive times, bird/feature species) consistent with the site's existing voice; no invented testimonials/ratings/availability.

## Owner questions (block nothing; draft ahead)

1. Confirm brand's current price lines (from USD tags) still valid before publishing B2.
2. Photos: use existing /public + Supabase cms-media assets; no generated imagery unless approved.
