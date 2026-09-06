# RESPONSIVE-AUDIT.md

## Jackfruit Safaris — Comprehensive Responsive Design Audit

**Date:** 2026-09-06  
**Project:** Jackfruit Safaris (Next.js 16, Tailwind CSS v4)  
**Auditor:** fable-auditor agent  

---

## 1. File Inventory

### 1.1 Source HTML/TSX Files (App Router Pages & Components)

**Root Layout & Global:**
- `src/app/layout.tsx` — Root layout with `CmsRealtimeProvider`, `SiteHeader`, `SiteFooter`, `MobileCta`, `Suspense` fallbacks
- `src/app/globals.css` — Single global stylesheet; Tailwind v4 via `@import "tailwindcss"`
- `src/app/error.tsx` — Global error boundary (full HTML document)
- `src/app/actions.ts` — Server action: `createInquiry` (form submission to Supabase)

**Public-Facing Pages:**
- `src/app/page.tsx` — Home page (hero, trust bar, why Uganda, safaris carousel, experiences carousel, reviews, CTA, accreditation)
- `src/app/about/page.tsx` — About page (hero, founder story, intro cards, unique differentiators, staff grid, planning steps)
- `src/app/safaris/page.tsx` — Safaris listing (hero, intro, grid with sidebar quote form)
- `src/app/safaris/[slug]/page.tsx` — Safari detail (hero, info bar, grid + sticky quote card, day-by-day itinerary, inclusions/exclusions, accommodations, FAQs, galleries)
- `src/app/destinations/page.tsx` — Destinations listing (hero, grid of destination cards)
- `src/app/destinations/[slug]/page.tsx` — Destination detail (hero, overview, why-go cards, how-to-get-there, best-time/recommended-stay, key highlights, related safaris carousel, route note)
- `src/app/experiences/page.tsx` — Experiences listing (hero, intro, grid of experience cards)
- `src/app/experiences/[slug]/page.tsx` — Experience detail (hero, bullets grid, recommended safaris grid, sidebar with gallery + quote form)
- `src/app/reviews/page.tsx` — Reviews listing (hero, grid of review cards, pagination CTA)
- `src/app/travel-guide/page.tsx` — Travel guide listing (hero, intro, article grid, pagination)
- `src/app/travel-guide/[slug]/page.tsx` — Article detail (hero strip, article body with `prose`, CTA card, back link)
- `src/app/contact/page.tsx` — Contact page (hero, contact info cards grid + quote form)
- `src/app/request-quote/page.tsx` — Request quote (hero, info cards grid + quote form)
- `src/app/transport/airport-transfers/page.tsx` — Airport transfers (hero, services list + quote form)
- `src/app/tours/page.tsx` — Legacy/hardcoded tours page (Supabase fetch, basic Tailwind classes — **not using design system**)
- `src/app/auth/login/page.tsx` — Login form (centered card layout)

**Shared Components:**
- `src/components/site-header.tsx` — Sticky header with desktop nav + mobile drawer
- `src/components/site-footer.tsx` — Footer with brand, quick links, contact info, copyright
- `src/components/hero-section.tsx` — Reusable hero with badge, dual CTAs, quick links
- `src/components/section.tsx` — Reusable section wrapper with eyebrow/title/intro
- `src/components/carousel.tsx` — Horizontal scroll-snap carousel with nav buttons + pagination dots
- `src/components/accreditation-logos.tsx` — Continuous slide animation of accreditation badges
- `src/components/safari-card.tsx` — Safari package card (image, duration, comfort, price, CTA)
- `src/components/destination-highlight-card.tsx` — Destination highlight card (image + title + description)
- `src/components/quote-form.tsx` — Client-side quote form (13 fields)
- `src/components/quote-form-server.tsx` — Server-side quote form (13 fields)
- `src/components/sticky-quote-card.tsx` — Desktop sticky aside with quote form + trust info
- `src/components/mobile-cta.tsx` — Fixed bottom mobile bar (WhatsApp + Request Quote, `md:hidden`)
- `src/components/content-with-image.tsx` — Text body with optional side/center image
- `src/components/cms-rich-text.tsx` — Sanitized HTML renderer with tag/attribute whitelist
- `src/components/experience-gallery.tsx` — Gallery with preview, grid modal, and lightbox viewer
- `src/components/full-width-gallery.tsx` — Responsive grid of gallery images at page bottom
- `src/components/related-gallery.tsx` — Film-strip gallery with hero image and thumbnail track
- `src/components/json-ld.tsx` — Organization schema JSON-LD
- `src/components/cms-live-refresh.tsx` — Deprecated re-export of `CmsRealtimeProvider`
- `src/components/ErrorBoundary.tsx` — Client-side error boundary

**Admin Pages (under `src/app/admin/`):**
- `src/app/admin/layout.tsx` — Admin root layout (auth check, `AdminShell` wrapper)
- `src/app/admin/page.tsx` — Dashboard with grid of links
- `src/app/admin/error.tsx` — Admin error component
- `src/app/admin/safaris/page.tsx` — Safari packages table
- `src/app/admin/safaris/[id]/page.tsx` — Edit safari page wrapper
- `src/app/admin/safaris/[id]/EditSafariForm.tsx` — Full safari edit form with 8+ sections
- `src/app/admin/safaris/[id]/safari-form-sections.tsx` — Form section sub-components
- `src/app/admin/destinations/page.tsx` — Destinations table
- `src/app/admin/destinations/[id]/page.tsx` — Edit destination form
- `src/app/admin/experiences/page.tsx` — Experiences table
- `src/app/admin/experiences/[id]/page.tsx` — Edit experience form
- `src/app/admin/reviews/page.tsx` — Reviews table
- `src/app/admin/reviews/[id]/page.tsx` — Edit review form
- `src/app/admin/gallery/page.tsx` — Gallery media table
- `src/app/admin/gallery/[id]/page.tsx` — Edit gallery media form
- `src/app/admin/leads/page.tsx` — Inquiry leads table
- `src/app/admin/travel-insights/page.tsx` — Travel guide articles table
- `src/app/admin/travel-insights/[id]/page.tsx` — Edit travel guide article form
- `src/app/admin/pages/page.tsx` — Pages table
- `src/app/admin/pages/[id]/page.tsx` — Edit page form
- `src/app/admin/pages/content/page.tsx` — Page content sections table
- `src/app/admin/pages/content/[id]/page.tsx` — Edit page content section
- `src/app/admin/pages/heroes/[id]/page.tsx` — Edit page hero form
- `src/app/admin/homepage/page.tsx` — Homepage sections dashboard
- `src/app/admin/homepage/hero/page.tsx` — Homepage hero editor
- `src/app/admin/homepage/features/page.tsx` — Features list table
- `src/app/admin/homepage/features/[id]/page.tsx` — Edit feature form
- `src/app/admin/homepage/quick-links/page.tsx` — Quick links table
- `src/app/admin/homepage/quick-links/[id]/page.tsx` — Edit quick link form
- `src/app/admin/homepage/trust-items/page.tsx` — Trust items table
- `src/app/admin/homepage/trust-items/[id]/page.tsx` — Edit trust item form
- `src/app/admin/homepage/guide-articles/page.tsx` — Guide articles table
- `src/app/admin/homepage/guide-articles/[id]/page.tsx` — Edit guide article form
- `src/app/admin/navigation/page.tsx` — Navigation menus editor
- `src/app/admin/navigation/new/page.tsx` — New menu form
- `src/app/admin/navigation/[id]/edit/page.tsx` — Edit menu form
- `src/app/admin/navigation/[id]/items/new/page.tsx` — New menu item form
- `src/app/admin/navigation/[id]/items/[itemId]/edit/page.tsx` — Edit menu item form
- `src/app/admin/settings/page.tsx` — Site settings page (large form)
- `src/app/admin/settings/_components/FormFields.tsx` — Reusable form field components
- `src/app/admin/settings/_components/SettingsForm.tsx` — Settings form wrapper with draft persistence
- `src/app/admin/_components/admin-shell.tsx` — Admin shell with mobile sidebar + overlay
- `src/app/admin/_components/admin-loading-indicator.tsx` — Global loading indicator
- `src/app/admin/_components/admin-load-error.tsx` — Load error component
- `src/app/admin/_components/cms-query-feedback.tsx` — Success/error feedback banner
- `src/app/admin/_components/page-content-editor.tsx` — Dynamic content section editor
- `src/app/admin/_components/cms-form-controls.tsx` — Wysiwyg editor, ListEditor, KeyValueEditor, SocialLinkEditor, SectionTypeSelector
- `src/app/admin/_components/delete-button.tsx` — Delete confirmation button

**API Routes:**
- `src/app/api/clear-cache/route.ts` — Cache revalidation endpoint
- `src/app/api/admin/login/route.ts` — Admin login endpoint (POST)

**Lib / Utility:**
- `src/lib/content.ts` — Hardcoded content (site info, nav items, images, safaris, experiences, destinations, testimonials, team, page hero fallbacks)
- `src/lib/navigation.ts` — Supabase menu navigation fetch functions
- `src/lib/cms-data.ts` — Supabase data fetching functions (public + admin)
- `src/lib/cms-page-content.ts` — Content section parsing helpers
- `src/lib/site-settings.ts` — `PublicSiteSettings` type and `buildWhatsAppHref`
- `src/lib/supabase/server.ts` — Server-side Supabase client factory
- `src/lib/supabase.js` — Client-side Supabase client (legacy wrapper)
- `src/lib/supabase/realtime-context.tsx` — Realtime CMS change provider
- `src/middleware.ts` — Next.js middleware (currently a no-op pass-through)

**Supabase Migrations (SQL schema):**
- `supabase/migrations/202606270001_jackfruit_cms.sql` — Core CMS tables
- `supabase/migrations/20260718_create_modules.sql`
- `supabase/migrations/20260718_create_pages.sql`
- `supabase/migrations/20260718_create_settings.sql`
- `supabase/migrations/202607190002_cms_media_storage.sql`
- `supabase/migrations/202607190003_seed_cms_content.sql`
- `supabase/migrations/202607240001_homepage_cms.sql`
- `supabase/migrations/202607240002_site_settings_homepage.sql`
- `supabase/migrations/202607240003_site_settings_footer.sql`
- `supabase/migrations/202607240004_page_heroes.sql`
- `supabase/migrations/202607240005_seed_frontend_content.sql`
- `supabase/migrations/202607290001_cms_landing_pages_and_hero_content.sql`
- `supabase/migrations/202607300001_page_content_sections.sql`
- `supabase/migrations/202607300002_site_aesthetics_settings.sql`
- `supabase/migrations/202607300003_cms_media_bucket.sql`
- `supabase/migrations/202607300004_cms_realtime_refresh.sql`
- `supabase/migrations/202607300005_page_heroes_hero_fields.sql`
- `supabase/migrations/202607310001_cms_persistence_hardening.sql`
- `supabase/migrations/202608020001_footer_background_color.sql`
- `supabase/migrations/202608020001_missing_landing_pages_cms.sql`
- `supabase/migrations/202608020002_seed_navigation_menus.sql`
- `supabase/migrations/202608020003_public_navigation_access.sql`
- `supabase/migrations/202608200001_remove_reviews_from_navigation.sql`
- `supabase/migrations/202608200002_rename_business_name_remove_uganda.sql`
- `supabase/migrations/202608200003_gallery_media_order_and_seed.sql`
- `supabase/migrations/202608220001_seed_experience_gallery_media.sql`
- `supabase/migrations/202609020001_unified_cms_realtime.sql`
- `supabase/migrations/202609020005_page_heroes_hero_fields.sql`
- `supabase/migrations/202609040001_destination_content_enhancements.sql`
- `supabase/migrations/202609040001_safari_hero_subtitle_and_intro.sql`
- `supabase/migrations/202609040002_safari_page_images.sql`
- `supabase/migrations/202609040003_experiences_hero_subtitle_and_intro.sql`
- `supabase/migrations/202609040004_about_page_content_and_team.sql`
- `supabase/migrations/202609040007_destination_detail_page_content_sections.sql`
- `supabase/migrations/202609040008_fix_destination_grid_title_spelling.sql`
- `supabase/migrations/202609040009_destination_hero_subtitles.sql`
- `supabase/migrations/202609050001_hero_vertical_headlines_and_cms_fixes.sql`
- `supabase/migrations/202609060001_travel_guide_articles_enhancements.sql`
- `supabase/migrations/202609060002_footer_about_field.sql`

### 1.2 CSS Files

- `src/app/globals.css` — **The only CSS file.** Contains the entire responsive design system: CSS custom properties, fluid typography (clamp()), responsive utilities, mobile-first media queries, and admin-specific styles.

### 1.3 JS/TS Files (Key Non-UI)

- `next.config.ts` — Redirects only (no rewrites or headers for CSP/viewport)
- `postcss.config.mjs` — Tailwind CSS PostCSS plugin
- `tsconfig.json` — Strict TypeScript, App Router paths (`@/*` maps to `./src/*`)
- `netlify.toml` — Build: `npm run build`, publish: `.next`, `@netlify/plugin-nextjs`
- `package.json` — Next.js 16.2.9, React 19.2.4, Tailwind CSS v4, Lucide React, Zod, Supabase JS

### 1.4 Configuration Files

- `netlify.toml` — Netlify deployment config with redirects for `/admin/*` and security headers
- `package.json` — Dependencies and scripts
- `next.config.ts` — Redirects for legacy URLs
- `postcss.config.mjs` — PostCSS plugin configuration
- `tsconfig.json` — TypeScript compiler options
- `eslint.config.mjs` — ESLint configuration
- `.env.example` — Environment variable template (Supabase URL, anon key, service role key)
- `serve-site.ps1` — PowerShell script for local site serving
- `CMS_IMPLEMENTATION.md` — Documentation of CMS architecture

---

## 2. Current Breakpoint Audit

### 2.1 CSS File: `src/app/globals.css`

**Approach: Mobile-first.** The stylesheet uses `min-width` media queries throughout (640px, 768px, 1024px, 1440px) and includes `prefer-reduced-motion` and `pointer: coarse` variants.

**Media queries present (exact pixel values):**

| Line | Media Query | Purpose |
|------|-------------|---------|
| 83 | `@media (min-width: 640px)` | Tablet — section spacing |
| 89 | `@media (min-width: 1024px)` | Desktop — section spacing |
| 95 | `@media (min-width: 1440px)` | Large desktop — section spacing |
| 202 | `@media (min-width: 640px)` | Container padding |
| 209 | `@media (min-width: 1024px)` | Container padding |
| 221 | `@media (min-width: 640px)` | `.max-w-content-sm` max-width |
| 236 | `@media (min-width: 640px)` | `.container-max-mobile` max-width |
| 244 | `@media (min-width: 1024px)` | `.container-max-mobile` max-width |
| 258 | `@media (min-width: 640px)` | Grid cols 2/3/4 → 2 cols |
| 264 | `@media (min-width: 768px)` | Grid cols 3/4 → 3 cols |
| 269 | `@media (min-width: 1024px)` | Grid cols 4 → 4 cols |
| 280 | `@media (pointer: coarse)` | Touch min-height 44px |
| 287 | `@media (prefers-reduced-motion: reduce)` | Reduced motion |
| 309 | `@media (min-width: 640px)` | Image heights responsive |
| 319 | `@media (min-width: 640px)` | Hero height tablet |
| 323 | `@media (min-width: 1024px)` | Hero height desktop |
| 332 | `@media (max-width: 639px)` | `.section-responsive` mobile padding |
| 336 | `@media (min-width: 640px) and (max-width: 1023px)` | `.section-responsive` tablet padding |
| 340 | `@media (min-width: 1024px) and (max-width: 1439px)` | `.section-responsive` desktop padding |
| 344 | `@media (min-width: 1440px)` | `.section-responsive` large padding |
| 350 | `@media (min-width: 640px)` | Button height responsive |
| 351 | `@media (min-width: 1024px)` | Button height responsive |
| 355 | `@media (min-width: 640px)` | Input height responsive |
| 359 | `@media (min-width: 768px)` | Text alignment mobile-to-desktop |
| 363 | `@media (min-width: 640px)` | `.hidden-mobile` visibility |
| 365 | `@media (min-width: 640px) and (max-width: 1023px)` | `.hidden-tablet` visibility |
| 367 | `@media (min-width: 1024px)` | `.hidden-desktop` visibility |
| 371 | `@media (min-width: 640px) and (max-width: 1023px)` | `.show-tablet` visibility |
| 373 | `@media (min-width: 1024px)` | `.show-desktop` visibility |
| 409 | `@media (min-width: 768px) and (prefers-reduced-motion: no-preference)` | Accreditation animation |
| 427 | `@media (min-width: 1024px)` | `.sidebar-static-mobile` → sticky |
| 448 | `@media (max-width: 1023px)` | Admin sidebar → fixed overlay |
| 473 | `@media (min-width: 1024px)` | Admin main margin-left |

**Breakpoint Summary:**

| Breakpoint | Value | Tailwind Class | Usage |
|-----------|-------|---------------|-------|
| Mobile (default) | 0px+ | — | Base mobile-first styles |
| Small / sm | 640px | `sm:` | Tablet portrait |
| Medium / md | 768px | `md:` | Tablet landscape |
| Large / lg | 1024px | `lg:` | Laptop/desktop |
| Extra large / xl | 1280px | `xl:` | Large desktop |
| Explicit | 1440px | — | CSS-only media queries |

**Assessment:** The breakpoint scale is well-chosen for the device range (375px to 1440px+). The 5 breakpoints (640, 768, 1024, 1280 implicit via Tailwind, 1440 explicit) cover the requested common device widths: 375px, 768px, 1024px, 1280px, 1440px.

**Missing breakpoints:** None missing for common devices. The 640/768/1024/1440 scale covers mobile, tablet, laptop, and large desktop. The 375px target is handled by the mobile-first base styles (no media query needed — they apply from 0px up).

### 2.2 Inline `<style>` Blocks

- `src/app/admin/_components/cms-form-controls.tsx` (lines 413-419) — Contains a small `<style>` block for the WysiwygEditor placeholder pseudo-element (`.wysiwyg-editor[data-placeholder]:empty:before`). This is a scoped CSS pattern and is responsive-safe (uses `empty` pseudo-class, not width-dependent).

### 2.3 Component-Level CSS (via Tailwind classes)

No separate CSS modules or styled-components. All component styling is via Tailwind utility classes and the global CSS variables defined in `globals.css`.

---

## 3. Layout Analysis

### 3.1 Fixed-Width Elements

**No hardcoded fixed pixel widths** were found in the source code. A search for `width:\s*\d+px` and `max-width:\s*\d+px` in inline styles returned **zero matches**. All widths use Tailwind utility classes, CSS variables, or `clamp()`.

**Max-width constraints (all responsive):**
- `.container-responsive` — `max-width: 80rem` (1280px) with responsive padding (`--container-padding-mobile/tablet/desktop`)
- `.max-w-content` — `max-width: 60rem` (960px) for readable line length capping
- `.container-max-mobile` — `max-width: 40rem` (640px) base, scaling to `60rem` at 1024px
- Hero content wrapper uses `max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl` (responsive)
- About page founder story uses `prose prose-lg max-w-3xl` (responsive)

**Note:** The admin login page (`src/app/auth/login/page.tsx`, line 18) uses `max-w-md w-full` which is responsive and appropriate for a login form.

### 3.2 Elements Using `px` for Width/Padding/Margin

**Public-facing components:** All use `rem`/`em`/`%` via Tailwind classes or `clamp()`. No raw `px` values for spacing. The `px` utility prefix in Tailwind means "padding-left + padding-right" (e.g., `px-3`, `px-6`), not pixel units.

**Admin components:** Admin form controls in `src/app/admin/_components/cms-form-controls.tsx` and `src/app/admin/settings/_components/FormFields.tsx` use Tailwind `px-*` classes (padding), which is correct. No hardcoded pixel spacing found.

### 3.3 Flexbox and Grid Usage

**Grid Containers (Public-Facing):**

| File | Line | Grid Pattern |
|------|------|-------------|
| `globals.css` | 253-271 | `.grid-responsive-1/2/3/4` — mobile 1-col → 2-col at 640px → 3-col at 768px → 4-col at 1024px |
| `src/app/page.tsx` | 151 | Trust bar: `grid gap-3 sm:grid-cols-2 md:grid-cols-4` |
| `src/app/page.tsx` | 191 | Why Uganda features: `grid gap-4 sm:grid-cols-2` |
| `src/app/page.tsx` | 269 | Reviews: `grid gap-5 sm:grid-cols-2 md:grid-cols-3` |
| `src/app/page.tsx` | 306 | CTA: `grid gap-8 ... lg:grid-cols-[1fr_0.6fr]` |
| `src/app/page.tsx` | 151 | Trust bar |
| `src/app/safaris/[slug]/page.tsx` | 109 | Info bar: `grid gap-3 sm:grid-cols-2 md:grid-cols-4` |
| `src/app/safaris/[slug]/page.tsx` | 128 | Main + sidebar: `grid gap-10 lg:grid-cols-[1fr_380px]` |
| `src/app/safaris/[slug]/page.tsx` | 148 | Highlights: `grid gap-3 sm:grid-cols-2` |
| `src/app/safaris/[slug]/page.tsx` | 200 | Best time + recommended stay: `grid gap-6 md:grid-cols-2` |
| `src/app/safaris/[slug]/page.tsx` | 218 | Included/excluded: `grid gap-6 sm:grid-cols-2` |
| `src/app/safaris/[slug]/page.tsx` | 251 | Accommodations: `grid gap-4 sm:grid-cols-2 md:grid-cols-3` |
| `src/app/destinations/[slug]/page.tsx` | 133 | Main + sidebar: `grid gap-10 lg:grid-cols-[1fr_380px]` |
| `src/app/destinations/[slug]/page.tsx` | 151 | Why go: `grid gap-4 sm:grid-cols-2 md:grid-cols-3` |
| `src/app/destinations/[slug]/page.tsx` | 200 | Best time: `grid gap-6 md:grid-cols-2` |
| `src/app/destinations/[slug]/page.tsx` | 227 | Key highlights: `grid gap-6 md:grid-cols-2` |
| `src/app/destinations/page.tsx` | 93 | Destination cards: `grid gap-6 md:grid-cols-2 lg:grid-cols-3` |
| `src/app/experiences/[slug]/page.tsx` | 100 | Main + sidebar: `grid gap-10 lg:grid-cols-[1fr_380px]` |
| `src/app/experiences/[slug]/page.tsx` | 102 | Bullets: `grid gap-4 sm:grid-cols-2` |
| `src/app/experiences/[slug]/page.tsx` | 134 | Recommended safaris: `grid gap-6 md:grid-cols-2` |
| `src/app/experiences/page.tsx` | 104 | Experience cards: `grid gap-6 sm:grid-cols-2` |
| `src/app/reviews/page.tsx` | 67 | Review cards: `grid gap-5 sm:grid-cols-2 md:grid-cols-3` |
| `src/app/travel-guide/page.tsx` | 102 | Article cards: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` |
| `src/app/contact/page.tsx` | 79 | Contact info + form: `grid gap-10 lg:grid-cols-[0.8fr_1.2fr]` |
| `src/app/request-quote/page.tsx` | 75 | Form + info cards: `grid gap-10 lg:grid-cols-[1.1fr_0.8fr]` |
| `src/app/transport/airport-transfers/page.tsx` | 71 | Services + form: `grid gap-10 lg:grid-cols-[1fr_380px]` |
| `src/app/safaris/page.tsx` | 136 | Content + filters sidebar: `grid gap-8 lg:grid-cols-[1fr_340px]` |
| `src/app/about/page.tsx` | 196 | Intro cards: `grid gap-8 lg:grid-cols-3` |
| `src/app/about/page.tsx` | 235 | Unique items: `grid gap-3 sm:grid-cols-2 lg:grid-cols-3` |
| `src/app/about/page.tsx` | 273 | Staff: `grid gap-8 md:grid-cols-2 lg:grid-cols-4` |
| `src/app/about/page.tsx` | 333 | Planning steps: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` |
| `src/app/travel-guide/[slug]/page.tsx` | 123 | CTA card: `flex items-center justify-between` (flex, not grid) |
| `src/components/quote-form.tsx` | 71 | Travel dates + group size: `grid gap-4 sm:grid-cols-2` |
| `src/components/footer.tsx` | 29 | Footer columns: `grid gap-8 md:gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]` |
| `src/components/accreditation-logos.tsx` | 37 | Logo track: `flex items-center gap-6 sm:gap-8 md:gap-10` (flex) |
| `src/components/experience-gallery.tsx` | 194 | Gallery preview: `grid grid-cols-2 gap-2 sm:grid-cols-3` |
| `src/components/experience-gallery.tsx` | 287 | Grid modal: `grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4` |

**Flexbox Containers:**
- Header: `container-responsive flex items-center justify-between`
- Footer contact items: `flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3`
- CTA buttons: `flex flex-col gap-3 sm:flex-row sm:gap-4`
- Review article: `flex items-start gap-3`
- Footer social links: `flex flex-wrap gap-3 pt-1`
- Carousel: `flex gap-3 overflow-x-auto` (horizontal scroll)
- Accreditation track: `flex items-center gap-6`

### 3.4 Overflow Issues

**General:** The entire public-facing site uses `container-responsive` (max-width: 1280px) which prevents horizontal overflow. The `body`/`html` elements have no fixed widths.

**Carousel component** (`src/components/carousel.tsx`):
- Line 90: `overflow-x-auto` — Intentional horizontal scrolling on mobile. This is correct behavior for a carousel.
- Line 96: `style={{ width: `${100 / visibleCount}%` }}` — Dynamic width calculated based on JS-determined visible count. This works but relies on JavaScript calculating `visibleCount` correctly.

**Admin tables:** All admin table pages use `overflow-x-auto` wrapper on tables with `min-w-full`. On small screens, tables will scroll horizontally rather than stacking. This is acceptable for admin data-heavy views, but column widths may cause readability issues on very small screens.

**`tours/page.tsx`** (line 30-31): Uses `p-8` padding on mobile, which is slightly heavy but not an overflow issue. The `min-h-screen` wrapper ensures full height.

**`travel-guide/[slug]/page.tsx`** (line 77): Hero strip uses `relative bg-cover bg-center text-white` without `hero-h-responsive`. This is a minor inconsistency — the hero strip's height is controlled by content, not a fixed viewport height, so it's actually more mobile-friendly, but inconsistent with other pages.

**`experience-gallery.tsx`** lightbox (line 389): `max-w-[90vw]` and `max-h-[85vh]` — properly constrained to viewport. YouTube iframe uses `h-[60vh] w-[90vw] max-w-3xl` — responsive.

**`related-gallery.tsx`** hero image (line 84-92): Uses `aspectRatio: "16/9"` and covers the full width — good, no overflow expected.

**`full-width-gallery.tsx`** image (line 45): `h-36 w-full object-cover sm:h-40` — `w-full` is constrained by parent grid, no overflow risk.

**Footer:** `border-t pt-6 text-center text-fluid-xs` on the copyright div — no overflow issues.

---

## 4. Component Responsiveness Inventory

### 4.1 Header / Navigation

**Component:** `src/components/site-header.tsx`

| Feature | Status | Notes |
|---------|--------|-------|
| Desktop nav | Good | `hidden lg:flex` — visible from 1024px+ |
| Mobile burger toggle | Good | `lg:hidden` toggle using checkbox hack (`peer` pattern) |
| Mobile drawer | Good | Absolute positioned drawer, `max-w-xs`, `w-[calc(100vw-2rem)]`, closes on route change and Escape key |
| Logo responsive | Good | `logo-responsive` class: `clamp(48px, 6vw + 30px, 72px)` |
| Logo text mobile | Good | `hidden sm:block` for business name + "Safaris"; `sm:hidden` for short name only |
| Nav link hover states | Some concern | Uses `hover:bg-[#eef3eb]` on desktop and mobile nav links. Hover states don't cause issues on touch (they just won't trigger), but there's no `focus-visible` ring on mobile nav links — wait, actually mobile links at line 157 DO have `focus-visible:outline-none focus-visible:ring-2`. Desktop links at line 105 also have focus rings. **Good.** |
| Overlay | Good | Semi-transparent `fixed inset-0` overlay with proper z-index stacking |

**Issues:**
- The mobile drawer is positioned `absolute` relative to the header's parent container. On very short viewports, the drawer may extend below the fold and require scrolling, but this is acceptable for navigation menus.
- The hamburger/X icon toggle uses the `peer` checkbox pattern, which is a CSS-only solution with JavaScript-enhanced cleanup (route change + Escape). This is robust.

### 4.2 Footer

**Component:** `src/components/site-footer.tsx`

| Feature | Status | Notes |
|---------|--------|-------|
| Layout | Good | `container-responsive grid gap-8 md:gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]` — 1 col mobile, 3 cols desktop |
| Brand info | Good | Centered on mobile (`text-center`), left-aligned from `sm:` |
| Quick Links | Good | Stacked vertically, text-centered on mobile, left-aligned from `sm:` |
| Contact info | Good | Uses `flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3` for icon + text layout |
| Social links | Good | `flex flex-wrap gap-3` allows wrapping |
| Copyright | Good | `text-center` on mobile, centered always; uses `--footer-muted-text` color |
| Footer height | Good | `pb-16 pt-10 md:pb-12` — responsive vertical padding |

**Issues:**
- Line 132: `style={{ borderColor: "#ffffff", opacity: 0.3 }}` — hardcoded white border color. If a CMS setting changes the footer background to a non-dark color, the white border will be invisible. Should use a CSS variable.
- Line 27: `style={{ backgroundColor: footerBg, color: "var(--footer-text)" }}` — the footer text color is always white (`--footer-text` is hardcoded to `#ffffff` in both `:root` and `buildAestheticStyle`), even if the background color changes. If a CMS admin sets a light footer background, text would be unreadable. This is a **high-priority** issue for the CMS customization feature.

### 4.3 Hero / Banners

**Component:** `src/components/hero-section.tsx`

| Feature | Status | Notes |
|---------|--------|-------|
| Height | Good | `hero-h-responsive` class: `clamp(60vh, 80vw, 70vh)` mobile → `clamp(70vh, 70vw, 80vh)` tablet → `86vh` desktop |
| Content max-width | Good | `max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl` |
| Badge pill | Good | Fluid padding via `sm:px-4 sm:py-2` |
| Title typography | Good | `text-fluid-5xl sm:text-fluid-6xl md:text-fluid-7xl` — uses clamp-based fluid sizes |
| Intro text | Good | `max-w-md sm:max-w-xl` constrained |
| CTA buttons | Good | `flex flex-col gap-3 sm:flex-row sm:gap-4` — stacks on mobile, row on tablet+ |
| Quick links | Good | `flex flex-wrap gap-1.5 sm:gap-2` with `sm:px-4 sm:py-2` padding on pills |
| Gradient overlay | Good | Dark gradient overlay for text readability on background images |

### 4.4 Cards

**SafariCard** (`src/components/safari-card.tsx`):
- Image height: `img-h-sm` mobile → `sm:img-h-md` (uses `clamp()` heights)
- Padding: `p-5 sm:p-6`
- Content: All text uses fluid typography classes (`text-fluid-xs`, `text-fluid-sm`, `text-fluid-xl`, `text-fluid-lg`)
- CTA button: `btn-h-responsive` (min 44px touch target)
- **Status: Good**

**DestinationHighlightCard** (`src/components/destination-highlight-card.tsx`):
- Same responsive pattern as SafariCard
- **Status: Good**

**Experience cards** (`src/app/experiences/page.tsx`, lines 104-133):
- Image height: `img-h-lg` (larger than card default)
- Grid: `grid gap-6 sm:grid-cols-2`
- **Status: Good**

**Destination cards** (`src/app/destinations/page.tsx`, lines 93-123):
- Image height: `img-h-md`
- Grid: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`
- **Status: Good**

**Review cards** (`src/app/reviews/page.tsx`, lines 67-96):
- Reviewer avatar: `h-10 w-10` (fixed 40px — this is acceptable for avatars)
- Rating stars: `gap-1` (compact)
- Grid: `grid gap-5 sm:grid-cols-2 md:grid-cols-3`
- **Status: Good**

**Travel Guide article cards** (`src/app/travel-guide/page.tsx`, lines 102-130):
- Image: `h-40 w-full` (fixed height, but `w-full` is responsive)
- Grid: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`
- **Status: Good**

### 4.5 Forms

**QuoteForm** (`src/components/quote-form.tsx` + `quote-form-server.tsx`):
- Layout: `grid gap-4 rounded-[var(--brand-radius)] border bg-white p-5 sm:p-6`
- Travel dates + group size: `grid gap-4 sm:grid-cols-2` (stacks on mobile)
- All inputs use `input-h-responsive` (min 44px on mobile)
- Submit button uses `btn-h-responsive`
- Textarea: `min-h-[100px]` with `resize-y` (note: `resize-y` is not a valid Tailwind class — should be `resize-y` which is NOT standard; the correct class is just `resize` or `resize-y` which IS valid in Tailwind as `resize-y`). Let me verify... Actually `resize-y` IS a valid Tailwind class that sets `resize: vertical`. So this is fine.
- **Status: Good**

**Contact Info Cards** (`src/app/contact/page.tsx`):
- Uses `QuoteForm` component and contact info cards grid
- Grid: `grid gap-10 lg:grid-cols-[0.8fr_1.2fr]` — 1 col mobile, 2 cols at lg+
- **Status: Good**

**Request Quote Info Cards** (`src/app/request-quote/page.tsx`):
- Grid: `grid gap-10 lg:grid-cols-[1.1fr_0.8fr]` — 1 col mobile, 2 cols at lg+
- **Status: Good**

**Admin Settings Form** (`src/app/admin/settings/page.tsx`):
- Uses `container-responsive` wrapper with `max-w-4xl`
- Grid: `grid gap-4 sm:grid-cols-2` for business info fields
- Color inputs: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`
- Typography selectors: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`
- Layout feel selectors: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`
- Save button: `btn-h-responsive w-full`
- **Status: Acceptable for admin — some fields use `text-sm` which may be small on mobile, but admin users are typically on desktop.**

### 4.6 Tables

**Admin tables** (found in `src/app/admin/safaris/page.tsx`, `destinations/page.tsx`, `experiences/page.tsx`, `reviews/page.tsx`, `gallery/page.tsx`, `pages/page.tsx`, `pages/content/page.tsx`, `pages/heroes/page.tsx`):

| Feature | Status | Notes |
|---------|--------|-------|
| Table wrapper | Acceptable | All wrapped in `overflow-x-auto` |
| Table width | Acceptable | `min-w-full` — tables expand to fill container |
| Cell padding | Concern | `px-6 py-4` — fixed 24px horizontal, 16px vertical. On small screens, this wastes precious horizontal space. Should use `px-3 py-2 sm:px-6 sm:py-4` for mobile optimization. |
| Font size | Concern | `text-sm` (14px) on table cells, `text-xs` on headers — small but readable. Admin context mitigates this. |
| Column count | Concern | Most tables have 4-5 columns (Title, Duration/Region, Status, Actions). On mobile, some columns may truncate or stack poorly. The `sr-only` Actions header is good for accessibility. |

### 4.7 Typography

**Responsive typography system** in `globals.css`:

| Element | Mobile (clamp min) | Desktop (clamp max) | Classes Used |
|---------|-------------------|---------------------|-------------|
| `h1` | 1.75rem (28px) | 2.75rem (44px) | `text-fluid-5xl`, `text-fluid-6xl`, `text-fluid-7xl` |
| `h2` | 1.375rem (22px) | 2rem (32px) | `text-fluid-3xl`, `text-fluid-4xl` |
| `h3` | 1.2rem (19.2px) | 1.625rem (26px) | `text-fluid-xl` |
| `h4` | 1.075rem (17.2px) | 1.375rem (22px) | `text-fluid-lg` |
| Base text | `clamp(1rem, 0.5vw + 0.75rem, 1.125rem)` | — | `text-fluid-base`, `text-fluid-sm`, `text-fluid-xs` |
| HTML root | `clamp(16px, 0.75vw + 14.5px, 17px)` | — | Fluid base font size |

**Assessment:** Typography is excellent — uses `clamp()` for fluid scaling, `rem` units throughout, no fixed `px` font sizes in any component. The only exceptions are:
- `tours/page.tsx` line 13: `text-3xl font-bold` (not fluid — should use `text-fluid-3xl`)
- `tours/page.tsx` line 35: `text-xl font-bold` (not fluid)
- `tours/page.tsx` line 44: `text-sm text-gray-600` (not fluid)
- Admin components use `text-sm`, `text-xs`, `text-lg`, `text-xl` (static Tailwind sizes, acceptable for admin UI)

### 4.8 Images

**Background-image divs (component images):** Use `bg-cover bg-center` — responsive by default. Heights use `clamp()` via CSS variables (`--card-image-h-sm`, `--card-image-h-md`, `--card-image-h-lg`).

**Inline `<img>` tags:**
| Location | Classes | Max-width | Status |
|----------|---------|-----------|--------|
| `about/page.tsx` line 283 | `mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-2 ring-black/10` | `h-24 w-24` (96x96px fixed) | Acceptable — team avatar is a fixed-size circle |
| `reviews/page.tsx` line 75 | `h-10 w-10 rounded-full object-cover` | `h-10 w-10` (40x40px fixed) | Acceptable — reviewer avatar |
| `travel-guide/page.tsx` line 113 | `mb-4 h-40 w-full rounded-[var(--brand-radius)] object-cover ring-1 ring-black/5` | `w-full` | Good — responsive width |
| `travel-guide/[slug]/page.tsx` | Via `CmsRichText` `prose` — images injected by CMS content | Depends on CMS | **Concern** — CMS-injected `<img>` tags from `dangerouslySetInnerHTML` may not have `max-width: 100%` unless Tailwind's `prose` class handles it |
| `full-width-gallery.tsx` line 45 | `h-36 w-full object-cover sm:h-40` | `w-full` | Good — responsive width |
| `experience-gallery.tsx` line 412 | `max-h-[85vh] max-w-[90vw] rounded-[var(--brand-radius)] object-contain` | `max-w-[90vw]` | Good — viewport-constrained |
| `admin/settings/_components/FormFields.tsx` line 177 | `size-20 rounded-lg object-cover border border-gray-200` | `size-20` (80x80px fixed) | Acceptable — image preview thumbnail |

**`srcset`/`sizes` attributes:** NO images in the codebase use `srcset`, `sizes`, `<picture>`, or Next.js `<Image>` component. All images use plain `<img src="...">` or CSS `background-image`. This is a **significant concern** for performance and responsive image loading — there is no responsive image sizing, no WebP/AVIF negotiation, and no lazy loading for CSS background images. Only the `Logo` component in `accreditation-logos.tsx` uses `loading="lazy"`.

---

## 5. Interactivity Audit

### 5.1 Hover-Only Interactions (Broken on Touch)

**Public-facing components with hover-only interactions:**

| Component | File | Line | Interaction | Concern Level |
|-----------|------|------|-------------|---------------|
| Header nav links | `site-header.tsx` | 105 | `hover:bg-[#eef3eb]` | Low — hover is enhancement, click works without it |
| Header CTA | `site-header.tsx` | 116 | `hover:bg-[#0f2d22]` | Low — hover is enhancement |
| Desktop nav (mobile drawer) | `site-header.tsx` | 157 | `hover:bg-[#eef3eb]` | Low — hover is enhancement; mobile uses checkbox toggle |
| Accreditation logos | `accreditation-logos.tsx` | 45 | `hover:opacity-100` (pause animation) | Medium — the logos slide continuously on desktop via CSS animation. On touch, the `hover:opacity-100` never triggers, but the animation still runs. The `@media (min-width: 768px) and (prefers-reduced-motion: no-preference)` guard is good. However, on mobile the animation is disabled (good), so logos are static. The `hover:opacity-100` only enhances desktop experience. |
| Hero quick links | `hero-section.tsx` | 133 | `hover:bg-white/20` | Low — enhancement only |
| Safari card CTA | `safari-card.tsx` | 39 | `hover:bg-[#e5ad17]` | Low — enhancement only |
| Experience card | `page.tsx` (experiences) | 243 | `group-hover:scale-[1.03]` | Low — enhancement only |
| Destination card | `destinations/page.tsx` | 101 | `group-hover:scale-[1.03]` | Low — enhancement only |
| Destination card CTA | `destinations/page.tsx` | 116 | `group-hover:text-[var(--brand-primary)]` | Low — enhancement only |
| Travel guide article card | `travel-guide/page.tsx` | 107 | `hover:shadow-lg` + `group-hover:text-[var(--brand-primary)]` | Low — enhancement only |
| Footer links | `site-footer.tsx` | 76, 118, 141 | `hover:underline`, `hover:text-[var(--brand-accent)]` | Low — enhancement only |
| Review card | `page.tsx` (reviews) | 97 | `hover:shadow-lg` | Low — enhancement only |
| About staff cards | `about/page.tsx` | 277 | `hover:shadow-lg` | Low — enhancement only |
| FullWidthGallery tile | `full-width-gallery.tsx` | 66 | `group-hover:bg-black/5` | Low — enhancement only |
| ExperienceGallery tile | `experience-gallery.tsx` | 211 | `hover:scale-105 hover:shadow-md` | Low — enhancement only |
| ExperienceGallery grid modal | `experience-gallery.tsx` | 300 | `hover:scale-[1.02]` | Low — enhancement only |
| Carousel nav buttons | `carousel.tsx` | 109, 117 | `hover:bg-white` | Medium concern — nav buttons have `opacity-0` and only appear on hover OR focus. On touch, users must tap to focus first, which reveals the button, then tap again to activate. The `focus:` state does make them visible, but this is a known UX friction. |
| Carousel pagination dots | `carousel.tsx` | 137 | `hover:bg-gray-400` | Low — dots always visible |

**RelatedGallery hover-only elements** (`related-gallery.tsx`):
- Line 94: Hero image info overlay — `opacity-0 transition-opacity ... group-hover:opacity-100`
- Lines 117, 125: Nav arrows — `opacity-0 ... group-hover:opacity-100` with `focus:opacity-100` fallback
- Line 172: Thumbnail hover ring — `hover:border-[var(--brand-accent)]`

These rely on `group-hover` which means on touch, the overlays are invisible. The nav arrows do have `focus:opacity-100` as a fallback, which is good. The hero info overlay does NOT have a focus fallback — on mobile, photo info/caption is hidden until a hover interaction occurs.

### 5.2 JS Event Handlers Relying on Desktop Events

| File | Line | Handler | Analysis |
|------|------|---------|----------|
| `carousel.tsx` | 38-44 | `window.addEventListener("resize", handleResize)` | Good — handles viewport changes |
| `carousel.tsx` | 56 | `container.addEventListener("scroll", updateActive)` | Good — updates pagination dots |
| `related-gallery.tsx` | 34-59 | `window.addEventListener("keydown", handleKeydown)` | Good — keyboard arrow navigation |
| `site-header.tsx` | 42-61 | `hashchange` + `Escape` key listeners | Good — closes mobile drawer |
| `admin-shell.tsx` | 28-34 | `keydown` Escape listener | Good — closes mobile admin sidebar |
| `admin-shell.tsx` | 37-46 | Body scroll lock when sidebar open | Good — prevents background scroll |
| `experience-gallery.tsx` | 96-104 | Body scroll lock when modal/lightbox open | Good |
| `experience-gallery.tsx` | 107-120 | Keyboard navigation (Escape, ArrowLeft, ArrowRight) | Good — lightbox keyboard support |
| `experience-gallery.tsx` | 268 | `onClick={(e) => e.target === backdropRef.current && onClose()}` | Good — click outside to close |
| `cms-form-controls.tsx` | 359-362 | `onMouseDown` (not onClick) for execCommand | Standard pattern for contentEditable — prevents losing focus |
| `delete-button.tsx` | 29 | `window.confirm(confirmMessage)` | Desktop and mobile compatible |
| `AdminLoadingIndicator.tsx` | 34-93 | Multiple event listeners (click, submit, invalid, beforeunload) | Good — covers all transition states |

**No `mouseenter`/`mouseout` (vs. `mouseover`/`mouseout`) handlers found** that would break on touch. The codebase correctly avoids `mouseenter`/`mouseleave` in favor of `hover` CSS classes and `focus` states.

### 5.3 Touch Targets

| Element | Size | Minimum (44px) | Status |
|--------|------|-----------------|--------|
| Mobile nav toggle (hamburger) | `size-12` (48px) | 44px | Good |
| Header desktop nav links | `px-3 py-2` → ~44-56px height with `btn-h-responsive` | 44px | Good (`btn-h-responsive` min-height is `clamp(44px, ...)`) |
| Header desktop CTA | `px-5 py-2` + `btn-h-responsive` | 44px | Good |
| Mobile drawer links | `px-4 py-3` → ~44px | 44px | Good — py-3 = 12px × 2 + text height ≈ 44px minimum |
| Mobile drawer CTA | `px-4 py-3` | 44px | Good |
| Mobile CTA bar (WhatsApp) | `min-h-[48px]` | 44px | Good |
| Mobile CTA bar (Request Quote) | `min-h-[48px]` | 44px | Good |
| Carousel nav buttons | `size-10` implicit (ChevronLeft size={20} in a button with padding) — button has no explicit padding, so touch target ≈ 20px + any implicit button padding. **This is potentially below 44px.** | 44px | **Concern — Medium** |
| Carousel pagination dots | `h-2.5 w-2.5` (10px) — **well below 44px** | 44px | **Concern — Medium** |
| Footer social links | Text only, `font-semibold` — no min height | 44px | **Concern — Low** (text links on mobile are generally tappable) |
| Quote form submit button | `btn-h-responsive` | 44px | Good |
| About page CTAs | `btn-h-responsive` | 44px | Good |
| Accreditation logos | `h-14` (56px) — but logos are inline images in a flex row, not buttons | N/A | Not interactive |
| Review card links | `text-fluid-sm` link — small touch target | 44px | **Concern — Low** |
| Experience gallery grid thumbnails | `aspect-square` with `size-16` ring — but the button has no padding beyond content. Touch target ≈ 64px (size-16 = 4rem). | 44px | Good |
| Experience gallery close button | `size-10` (40px) — **below 44px** | 44px | **Concern — Low** |
| Experience gallery nav arrows | `size-10` (40px) — **below 44px** | 44px | **Concern — Low** |
| RelatedGallery nav arrows | `size-9` mobile → `sm:size-10` — **below 44px** | 44px | **Concern — Low** |
| Admin sidebar close button | `size-9` (36px) — **below 44px** | 44px | **Concern — Low** (admin context) |
| Admin sidebar nav links | `px-4 py-2.5` → ~40px height | 44px | **Concern — Low** (admin context) |
| Admin form buttons | `px-4 py-2.5` → ~40px height for text buttons | 44px | **Concern — Low** (admin context) |
| Error boundary reload button | `px-4 py-2` → ~36px height | 44px | **Concern — Low** |

---

## 6. Issues List (Prioritized)

### Critical — Anything that breaks layout on mobile

1. **`tours/page.tsx` does not use the responsive design system.** Lines 12-14 use `min-h-screen bg-[var(--background)] p-8` with `text-3xl font-bold` instead of fluid typography (`text-fluid-3xl`). The grid at line 32 uses `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` but lacks the `container-responsive` wrapper. This page renders a completely different visual style from the rest of the site and is not part of the main navigation.
   - File: `src/app/tours/page.tsx`
   - Lines: 12, 13, 30, 32, 44
   - Fix: Apply `container-responsive` wrapper, use `text-fluid-3xl` instead of `text-3xl`, use `text-fluid-sm` instead of `text-sm`

2. **Footer text color is hardcoded to white regardless of background.** In `src/app/layout.tsx` line 102, `buildAestheticStyle()` sets `--footer-text: "#ffffff"` and `--footer-muted-text: "#ffffff"` unconditionally. If a CMS admin changes the footer background to a light color via `footer_background_color`, all footer text becomes invisible.
   - File: `src/app/layout.tsx`, lines 102-103
   - Fix: Derive footer text color from the footer background color (light/dark contrast logic) or add a separate `footer_text_color` CMS setting.

3. **Footer copyright border color is hardcoded white.** In `src/components/site-footer.tsx` line 132, `style={{ borderColor: "#ffffff", opacity: 0.3 }}` will be invisible if the footer background is changed to white or light.
   - File: `src/components/site-footer.tsx`, line 132
   - Fix: Use `var(--footer-text)` or `var(--footer-muted-text)` instead of hardcoded `#ffffff`.

### High — Components that look bad or are hard to use on mobile

4. **Carousel navigation buttons may be below 44px touch target minimum.** The button itself has no explicit padding — it only contains a `ChevronLeft`/`ChevronRight` icon at `size={20}` (20px). The button's actual dimensions depend on browser default button padding, likely around 32-40px.
   - File: `src/components/carousel.tsx`, lines 105-120
   - Fix: Add `size-12` or `p-2` to ensure 44px+ touch targets, or increase icon size.

5. **Carousel pagination dots are 10px — far below 44px minimum.** The dots use `h-2.5 w-2.5` (10px). Even with the active dot being accent-colored, they are unusable as touch targets.
   - File: `src/components/carousel.tsx`, line 134
   - Fix: Increase to `h-3 w-3` minimum, or wrap in a larger invisible touch area (e.g., `p-2` with the dot centered).

6. **RelatedGallery hero image info overlay is hidden on touch and never shows.** The overlay at line 94 uses `group-hover:opacity-100` with no `focus:opacity-100` fallback. On mobile, the photo caption and photographer name are completely hidden.
   - File: `src/components/related-gallery.tsx`, line 94
   - Fix: Add a tap/click mechanism to toggle the overlay, or make the overlay always visible on mobile.

7. **ExperienceGallery lightbox close and nav buttons are 40px (below 44px).** The close button uses `size-10` (40px) and nav arrows use `size-10`.
   - File: `src/components/experience-gallery.tsx`, lines 363, 374, 382
   - Fix: Use `size-12` or add padding to reach 44px+.

8. **Travel guide article hero strip lacks `hero-h-responsive`.** Uses bare `bg-cover bg-center text-white` with `py-16 sm:py-24` instead of the consistent `hero-h-responsive` class. On mobile, the hero strip height is determined by content, which may be too short or too tall depending on content length.
   - File: `src/app/travel-guide/[slug]/page.tsx`, lines 76-105
   - Fix: Add `hero-h-responsive` class for consistent hero heights across all pages.

9. **Travel guide article CTA card uses `flex items-center justify-between` on mobile.** At line 123, the CTA card uses a flex layout with `justify-between` that places text and button side by side. On very narrow screens, this could crowd the button.
   - File: `src/app/travel-guide/[slug]/page.tsx`, line 123
   - Fix: Add `flex-col sm:flex-row` to stack on mobile.

10. **No `srcset` or responsive image attributes anywhere.** All images use plain `src` attributes or CSS `background-image`. No WebP/AVIF format negotiation. No lazy loading for content images (only accreditation logos use `loading="lazy"`).
    - Files: All component files using `src=` or `backgroundImage:`
    - Fix: Migrate to Next.js `<Image>` component or implement `srcset`/`sizes` attributes. Add `loading="lazy"` to all content images.

### Medium — Suboptimal spacing, typography

11. **Admin table cell padding wastes horizontal space on mobile.** All admin tables use `px-6 py-3` (text) and `px-6 py-4` (body) cells. On mobile, `px-6` (24px) is excessive for small screens, reducing room for actual content.
    - Files: `src/app/admin/safaris/page.tsx` (lines 38-69), `src/app/admin/pages/page.tsx`, `src/app/admin/pages/content/page.tsx` (lines 90-108), `src/app/admin/pages/heroes/page.tsx`, `src/app/admin/destinations/page.tsx`, `src/app/admin/experiences/page.tsx`, `src/app/admin/reviews/page.tsx`, `src/app/admin/gallery/page.tsx`, `src/app/admin/travel-insights/page.tsx`, `src/app/admin/leads/page.tsx`
    - Fix: Use `px-3 py-2 sm:px-6 sm:py-4` for responsive cell padding.

12. **Admin form buttons are 40px — below 44px minimum.** Admin submit buttons use `px-4 py-2.5` (≈40px height) and text links use `px-4 py-2` or `px-3 py-1.5`.
    - Files: `src/app/admin/_components/cms-form-controls.tsx` (lines 77, 88, 149, 160), `src/app/admin/safaris/[id]/EditSafariForm.tsx` (lines 236, 242), `src/app/admin/settings/page.tsx` (line 454)
    - Fix: Increase to `py-3` or minimum height 44px for form buttons.

13. **Admin sidebar close button is 36px.** Uses `size-9` (36px).
    - File: `src/app/admin/_components/admin-shell.tsx`, line 65
    - Fix: Use `size-10` (40px) or larger.

14. **`prose` class on About page founder story may produce non-responsive content from CMS.** The `prose prose-lg max-w-3xl` wrapper at `src/app/about/page.tsx` line 183 renders CMS-provided HTML. While Tailwind's `prose` class handles basic responsive typography, the CMS content is rendered via `dangerouslySetInnerHTML` through `CmsRichText`, which does not apply Tailwind's `prose` styles (it only outputs raw HTML).
    - File: `src/app/about/page.tsx`, lines 183-188
    - Fix: Apply `prose` classes to the `CmsRichText` className, or wrap the output in a `prose` container.

15. **Travel guide article body uses `prose lg:prose-lg` in `CmsRichText`.** The `prose` class is applied as a Tailwind utility but `CmsRichText` renders via `dangerouslySetInnerHTML`. Tailwind's `prose` requires the class to be on the container element, which it is (`className="prose lg:prose-lg max-w-none"`). **This is actually correct.** (Removed from issue list — confirmed working.)

16. **`section-responsive` has redundant media query definitions.** In `globals.css` lines 328-346, both the CSS variable approach (lines 83-99) and the `.section-responsive` class approach (lines 328-346) define the same values with overlapping but different media query ranges. The `.section-responsive` uses explicit `max-width` ranges (e.g., `min-width: 640px) and (max-width: 1023px)`) while the `--section-spacing` variable uses simple `min-width` ranges. This creates no conflict but is redundant.
    - File: `src/app/globals.css`, lines 83-99 and 328-346
    - Note: Not a bug, but code duplication that complicates maintenance.

17. **`text-fluid-base` may be slightly large for dense CMS content.** The fluid base text size ranges from 16px to 18px, which could make long-form content feel too roomy.
    - File: `src/app/globals.css`, line 120
    - Note: Subjective preference; not a technical issue.

### Low — Minor polish items

18. **No `title` attributes on many links for accessibility.** Links like "View destination", "Explore experience", "View itinerary" do not have `title` attributes. Screen readers will read the link text, so this is minor.
    - Files: Multiple page files
    - Fix: Add descriptive `title` props for enhanced accessibility.

19. **Admin form submit buttons lack consistent `focus-visible` rings.** Some admin buttons have `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]` while others (e.g., `src/app/admin/safaris/page.tsx` line 28 New Safari button) have no focus ring.
    - Files: Various admin pages
    - Fix: Add consistent `focus-visible` styling to all buttons.

20. **Error boundary reload button lacks `focus-visible` ring.** `src/components/ErrorBoundary.tsx` line 39 uses `hover:bg-blue-700` but no `focus-visible` ring.
    - File: `src/components/ErrorBoundary.tsx`, line 39
    - Fix: Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`.

21. **Global error page (`src/app/error.tsx`) uses inline `<style>` and `dangerouslySetInnerHTML` for error data.** While functional, the inline script could be replaced with a more standard error display.
    - File: `src/app/error.tsx`, lines 22-38
    - Note: This is intentional for client-side error data capture — not a responsive issue.

22. **Admin `WysiwygEditor` toolbar buttons use `onMouseDown` with `event.preventDefault()`.** This is correct for `contentEditable` (prevents losing focus), but the buttons are `px-2 py-1` (≈24px height) — small but acceptable for admin editing.

23. **No `@viewport` or `viewport` meta tag issues.** The `layout.tsx` does not explicitly set `<meta name="viewport">`. Next.js automatically injects `<meta name="viewport" content="width=device-width, initial-scale=1">` in the App Router. **Confirmed — no issue.** (The global error page at `src/app/error.tsx` does include it manually, which is correct for that standalone HTML document.)

24. **Footer copyright text uses `text-center` on mobile only.** The copyright div at `src/components/site-footer.tsx` line 131 uses `text-center text-fluid-xs` with no breakpoint override — it stays centered on all devices. The Quick Links section above it uses `text-center sm:text-left`. This is intentional and consistent.

25. **`MobileCta` uses `grid-cols-2` with a `ml-2` on the second column.** The gap between the two mobile CTA buttons is handled by `ml-2` on the second button rather than a `gap` on the grid. This is a minor inconsistency but works visually.
    - File: `src/components/mobile-cta.tsx`, line 21 (`className="ml-2"`)
    - Fix: Use `gap-2` on the grid and remove `ml-2`.

---

## 7. Breakpoint Coverage Summary

| Target Device Width | Status | Notes |
|-------------------|--------|-------|
| 375px (iPhone SE) | Fully covered | Mobile-first base styles apply. All components use fluid `clamp()` sizing and responsive grids. |
| 390px (iPhone 15) | Fully covered | Same as above. |
| 414px (iPhone Plus) | Fully covered | Same as above. |
| 768px (iPad) | Fully covered | `md:` breakpoint activates at 768px. Grid columns expand, typography scales up. |
| 1024px (iPad Pro / Laptop) | Fully covered | `lg:` breakpoint activates. Sidebar layouts appear, 3-4 column grids activate. |
| 1280px (Desktop) | Fully covered | Tailwind `xl:` breakpoint activates. Content max-width caps at 1280px. |
| 1440px (Large Desktop) | Fully covered | Explicit `@media (min-width: 1440px)` queries in globals.css handle section spacing. |

**Overall breakpoint coverage is excellent for the public-facing site.** The only pages not following the responsive system are `tours/page.tsx` (legacy page) and admin pages (functional but not as polished).

---

## 8. Recommendations Summary

### Immediate Priority (Critical)
1. Fix footer text color to adapt to background color changes (not hardcoded white)
2. Bring `tours/page.tsx` into compliance with the responsive design system
3. Replace hardcoded `#ffffff` border color in footer copyright divider

### Short-Term Priority (High)
4. Increase carousel nav button and pagination dot touch targets to 44px+
5. Add touch interaction for RelatedGallery hero overlay (currently hover-only)
6. Increase lightbox close/nav button sizes to 44px+
7. Add `hero-h-responsive` class to travel guide article hero
8. Migrate to Next.js `<Image>` component or add `srcset`/`sizes`/lazy-loading to all images

### Medium Priority
9. Reduce admin table cell padding on mobile (`px-6` → `px-3 sm:px-6`)
10. Increase admin form button touch targets to 44px+
11. Fix travel guide CTA card to stack on mobile
12. Clean up redundant `.section-responsive` media queries in globals.css

### Low Priority (Polish)
13. Add `title` attributes to links for accessibility
14. Add consistent `focus-visible` rings to all admin buttons
15. Fix the `ml-2` gap inconsistency in `MobileCta`

---

## 9. Overall Assessment

**The public-facing site is well-architected for responsive design.** The `globals.css` file establishes a comprehensive design system with fluid typography, responsive spacing, proper media queries, and touch-friendly minimum sizes. The mobile-first approach is consistently applied across all public components and pages.

**The admin interface is functional but not optimized.** Admin pages use basic Tailwind classes and standard table/form patterns that work on mobile but lack the polish and touch-target optimization of the public-facing site. This is acceptable for an admin interface where most users will be on desktop, but the mobile sidebar drawer and admin shell do provide basic mobile support.

**The single largest risk area is the footer color customization.** The CMS allows admins to change the footer background color, but the text color is hardcoded to white. If an admin selects a light background, the footer becomes unreadable. This is a design-system integration issue, not a responsive issue per se, but it directly impacts mobile usability where the footer is always visible.

**The legacy `tours/page.tsx` is a completely separate styling system** that does not use any of the responsive design tokens. It should either be integrated into the main design system or removed from navigation entirely.