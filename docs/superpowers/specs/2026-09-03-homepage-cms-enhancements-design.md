# Homepage Carousel + CMS Enhancements Design Spec

## Subject, Audience, Job

- **Subject**: Jackfruit Safaris homepage — a Uganda-focused safari tour operator site
- **Audience**: Travelers planning a Uganda safari (gorilla trekking, wildlife, Nile adventures, cultural experiences), plus CMS content editors who manage homepage content
- **Page job**: Convert visitors into safari inquiries through compelling destination highlights, social proof, and a clear call-to-action

## Design Tokens

### Color
Carries the existing palette (unchanged):
- `--brand-primary: #143c2d` — deep forest green (links, nav text, CTA backgrounds)
- `--brand-secondary: #2d6f55` — muted forest (eyebrows, icons)
- `--brand-accent: #f5bf2f` — warm gold (badges, ring focus, carousel nav)
- `--foreground: #10251b` — dark text
- `--background: #fbfaf5` — off-white surface
- `--brand-muted-text: #536154` — secondary text

### Typography
- **Display**: `font-geist-sans` (Inter-like), weight 900, fluid scale via `clamp()`
- **Body**: `font-geist-sans`, weight 400, line-height 1.6
- **Review quote**: adjusted to `font-normal` (was bold) at `text-fluid-lg` for readability

### Layout Concept
- Scroll-snap horizontal carousel: cards snap to nearest position, one card visible on mobile, multiple on wider screens
- Navigation via chevron buttons + pagination dots
- Responsive card count: mobile=1, tablet (sm≥640px)=1 but with peek, desktop (lg≥1024px)=3, wide (xl≥1280px)=4
- Carousel scrolls by one card per interaction for precise control

### Signature Element
Custom-built, dependency-free CSS scroll-snap carousel with:
- Arrow buttons with gold accent background
- Dot pagination that reflects active scroll position
- Smooth momentum scrolling with `scroll-behavior: smooth`
- Keyboard-accessible arrow navigation (arrow keys left/right)
- No JavaScript library — uses native browser scroll-snap + scroll event listeners for dot sync

## Changes Summary

### 1. Why Uganda section (homepage)
- **Remove**: the green background card (`bg-[var(--brand-primary)]` block with body text + feature list)
- **Remove**: the "Plan your trip" form (`QuoteForm` with `compact` prop)
- **Replace with**:
  - A heading (from CMS `title`, fallback "Why Uganda")
  - A description (from CMS `intro`, fallback the existing Uganda intro text)
  - An image upload/display field (from CMS `background_image` URL field)
- **Section type**: remains `feature_split_with_quote_form` in the CMS, but the editor gets a new `background_image` field

### 2. Featured Safaris section → carousel
- Replace the static `md:grid-cols-2 xl:grid-cols-4` grid with a horizontal scroll-snap carousel
- Reuse existing `SafariCard` component inside the carousel
- Add carousel wrapper with arrow nav + dots
- Responsive slides: 1 (mobile), 1 (tablet with peek), 3 (desktop), 4 (wide desktop)

### 3. Experiences section → carousel
- Replace the static `md:grid-cols-2 lg:grid-cols-4` grid with a horizontal scroll-snap carousel
- Reuse existing experience cards (Link + image + icon structure) inside the carousel
- Add same carousel wrapper

### 4. Reviews section
- **Keep** the review card structure
- **Adjust**: make the quote `font-normal` instead of `font-bold`, keep `text-fluid-lg` size
- **Add**: reviewer avatar as an icon/avatar element at the top of each review card
  - Use the existing `image_url` field from the `reviews` table
  - Display as a small circular image; fallback to an icon if no image
- Update both:
  - `src/app/page.tsx` (homepage reviews section)
  - `src/app/reviews/page.tsx` (dedicated reviews page)

### 5. Travel Guide section
- **Remove** the Travel Guide section from the homepage entirely
- Keep the `/travel-guide` route page itself (it's a separate page)

## CMS Backend Changes

### page_content_sections table
- No schema change needed — the `content` column is JSONB and can already accept a `background_image` string

### PageContentEditor (`src/app/admin/_components/page-content-editor.tsx`)
- Add a new field type `"image_url"` to the `SectionField` type
- Add `background_image` to the `why_uganda` section fields:
  - `{ name: "background_image", label: "Background Image", type: "url" }`
- Add a render branch for `type === "url"` to render a URL input (already handled, just need to add the field)

### Page Content Editor field rendering
- The existing `resolveFields` function already falls back to dynamic rendering for unknown fields
- Adding `background_image` to the `why_uganda` `SECTION_FIELDS` array makes it editable in the CMS

## Files To Create/Modify

### New files
- `src/components/carousel.tsx` — reusable responsive scroll-snap carousel component

### Modified files
1. `src/app/page.tsx` — Why Uganda section rewrite, Featured Safaris → carousel, Experiences → carousel, Reviews avatar, remove Travel Guide
2. `src/app/reviews/page.tsx` — Reviews avatar
3. `src/app/admin/_components/page-content-editor.tsx` — add background_image field for why_uganda section
4. No migration needed (content JSONB accepts new keys)

## Data Flow

### Homepage data (page.tsx)
```
CMS page_content_sections (page_slug='/')
  → why_uganda section: title, intro, background_image (new)
  → featured_safaris section: intro (unchanged)
  → experiences section: intro (unchanged)
  → reviews section: intro (unchanged)
  → quote_cta section: (unchanged)
```

### Carousel component data
```
Page component receives:
  - safaris[] or experiences[] (from CMS or hardcoded fallback)
Carousel renders cards in horizontal scroll-snap container
  - Arrow buttons call container.scrollBy({ left: cardWidth })
  - Dot pagination reflects scrollLeft position
```

### Review avatar data flow
```
getPublishedReviews() already SELECT * (includes image_url)
→ homepage maps reviews to testimonials array
  → add image_url to the mapped object
→ review card component displays avatar if image_url present
```

## Edge Cases

1. **Carousel with fewer items than visible**: arrows disabled, no pagination dots overflow
2. **Review without image_url**: fall back to a default user icon (lucide `User` or `UserCircle`)
3. **Why Uganda image not set in CMS**: section renders with heading + description only (no image), layout adjusts gracefully
4. **Empty safari/experience lists**: CMS returns empty → falls back to hardcoded data → carousel still works
5. **Mobile touch**: native touch scrolling works with scroll-snap, no extra JS needed

## Testing Considerations

- Verify carousel scrolls horizontally on mobile (touch + arrow keys)
- Verify dots update on scroll (both wheel and arrow navigation)
- Verify review avatar appears when `image_url` is set
- Verify review fallback icon when `image_url` is null
- Verify Why Uganda section shows image when `background_image` is set in CMS
- Verify Travel Guide section is removed from homepage
- Verify build passes TypeScript type-check
- Verify Netlify build succeeds
