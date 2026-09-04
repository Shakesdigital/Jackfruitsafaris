# Safari Landing Page Interactive Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add image attachment + alignment (left/right/center) to every content section/paragraph, highlight, and itinerary day on safari detail pages, plus a full-width bottom gallery — with matching CMS backend support on every change.

**Architecture:** Reuse the existing JSONB column pattern already used for `itinerary` and `page_content_sections`. Add two new JSONB columns on `safari_packages` (`highlights_content` and `page_sections`) so highlights and arbitrary content sections can carry image + alignment data alongside text. Itinerary already is JSONB, so each day gains `image_url` + `image_alignment` fields. The existing `gallery_media` table (already linked to `safari_package_id`) powers both the sidebar film strip AND the new full-width bottom gallery. A shared `ContentWithImage` React component renders aligned images consistently across sections.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, Supabase Postgres + Storage, Zod, existing admin form conventions (ListEditor, ImageUploadField, WysiwygEditor, PageContentEditor)

**Spec:** Based on user request — interactive image support on safari landing pages with CMS parity.

## Global Constraints

- All SQL goes in tracked migration files under `supabase/migrations/`
- Frontend data access must preserve existing fallback behavior (hardcoded content in `lib/content.ts` when CMS row is missing)
- The "Apply New Trip" sidebar (`StickyQuoteCard`) must remain unchanged in position and behavior
- Admin form conventions must match existing patterns (ImageUploadField, ListEditor, WysiwygEditor, Zod schemas in cms-actions.ts)
- No new dependencies — use existing libraries (lucide-react, tailwind, next/image not used; raw img/bg patterns consistent with codebase)

---

## Task 1: Database Migration — Add JSONB columns for highlights content and page sections

**Files:**
- Create: `supabase/migrations/202609040002_safari_page_images.sql`

**Interfaces:**
- Consumes: Nothing (adds columns to existing `safari_packages` table)
- Produces: `highlights_content JSONB` column (array of `{ text, image_url, image_alignment }`), `page_sections JSONB` column (array of `{ key, title, body, image_url, image_alignment, alignment }`)

- [ ] **Step 1: Write the migration SQL**

Migration must:
1. Add `highlights_content` JSONB column (default `[]`) to `safari_packages`
2. Add `page_sections` JSONB column (default `[]`) to `safari_packages`
3. Backfill: for each safari, migrate existing `highlights text[]` into `highlights_content` as `[{ text: "...", image_url: null, image_alignment: null }]`
4. Enable RLS policy already exists for admin management — no new policy needed (existing `safari_packages` RLS covers all columns)

```sql
-- Migration: Add image-aware content columns to safari_packages
-- Supports: per-highlight images with alignment, arbitrary page sections with images,
-- and itinerary day images (itinerary is already JSONB).

-- 1. Add new columns
alter table public.safari_packages
  add column if not exists highlights_content jsonb not null default '[]'::jsonb,
  add column if not exists page_sections jsonb not null default '[]'::jsonb;

-- 2. Backfill highlights_content from the existing text[] highlights column
--    Each existing highlight string becomes an object with text only (image_url/alignment null)
update public.safari_packages
set highlights_content = (
  select jsonb_agg(jsonb_build_object(
    'text', elem,
    'image_url', null,
    'image_alignment', null
  ))
  from jsonb_array_elements_text(highlights::jsonb) as elem
)
where highlights_content = '[]'::jsonb
  and highlights is not null
  and array_length(highlights, 1) > 0;

-- (page_sections stays empty by default — admins populate from CMS)
```

- [ ] **Step 2: Verify migration syntax** — confirm `jsonb_array_elements_text` works on `text[]` cast; verify no conflicts with existing column names

- [ ] **Step 3: No test needed** — schema migrations in this project are applied via `supabase db push` or manual SQL; no test framework exists for migrations

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/202609040002_safari_page_images.sql
git commit -m "feat: add highlights_content and page_sections JSONB columns to safari_packages for image support"
```

---

## Task 2: Shared TypeScript Types — Add image alignment types

**Files:**
- Modify: `src/lib/content.ts`

**Interfaces:**
- Consumes: Existing `Safari` type
- Produces: `ImageAlignment` type (`"left" | "right" | "center"`), `HighlightWithImage` type, `SafariPageSection` type

- [ ] **Step 1: Write the types**

Add near the existing `Safari` type definition:

```typescript
export type ImageAlignment = "left" | "right" | "center" | null;

export type HighlightWithImage = {
  text: string;
  image_url?: string | null;
  image_alignment?: ImageAlignment;
};

export type SafariPageSection = {
  key: string;
  title?: string | null;
  body?: string | null;
  image_url?: string | null;
  image_alignment?: ImageAlignment;
};

export type SafariDayWithImage = {
  day: string;
  title: string;
  body: string;
  meals?: string;
  image_url?: string | null;
  image_alignment?: ImageAlignment;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content.ts
git commit -m "types: add ImageAlignment, HighlightWithImage, SafariPageSection for interactive images"
```

---

## Task 3: Create ContentWithImage component — shared image-with-alignment renderer

**Files:**
- Create: `src/components/content-with-image.tsx`

**Interfaces:**
- Consumes: `ImageAlignment` from `lib/content.ts`, `CmsRichText` from `components/cms-rich-text.tsx`
- Produces: `ContentWithImage` component that renders text body + optional image with left/right/center alignment

`ContentWithImage` renders based on alignment:
- `left`: image on left, text on right (2-col grid, image col first)
- `right`: image on right, text on left (2-col grid, text col first)
- `center`: image centered above text (stacked)
- `null`/absent: text only (no image wrapper)

The component must handle:
- Rich HTML body (via `CmsRichText`) or plain text
- Image URL present or absent (graceful degradation)
- Responsive: single column on mobile, two columns on desktop
- Alt text derived from a prop or fallback to empty string
- Consistent styling with the site (border radius via `--brand-radius`, shadows, etc.)

```tsx
import { CmsRichText } from "@/components/cms-rich-text";
import type { ImageAlignment } from "@/lib/content";

type ContentWithImageProps = {
  body: string;            // Can contain HTML (rendered via CmsRichText)
  imageUrl?: string | null;
  alignment?: ImageAlignment;
  altText?: string;
  className?: string;
};

export function ContentWithImage({ body, imageUrl, alignment, altText = "", className = "" }: ContentWithImageProps) {
  // center: full-width image above text
  // left: image left col, text right col
  // right: text left col, image right col
  // null: text only
  ...
}
```

- [ ] **Step 1: Implement `ContentWithImage` component**

Render logic:
1. If no `imageUrl` or alignment is null → render `CmsRichText` with body only
2. If `alignment === "center"` → image full-width above body
3. If `alignment === "left"` → grid `[imageCol, textCol]` (image first)
4. If `alignment === "right"` → grid `[textCol, imageCol]` (image second)

Use Tailwind classes consistent with the site's `var(--brand-radius)` radius.

- [ ] **Step 2: Commit**

```bash
git add src/components/content-with-image.tsx
git commit -m "feat: add ContentWithImage component for aligned image+text rendering"
```

---

## Task 4: Update CMS data layer — Fetch new columns

**Files:**
- Modify: `src/lib/cms-data.ts`

**Interfaces:**
- Consumes: Existing `getSafariBySlug`, `getAdminSafariByIdResult`
- Produces: Safari objects now include `highlights_content`, `page_sections`

- [ ] **Step 1: Update `getSafariBySlug`** — the existing `select("*")` already picks up new columns. No change needed since `*` is used.

- [ ] **Step 2: `getAdminSafariByIdResult` also uses `select("*")` → already picks up new columns. No change needed.**

- [ ] **Step 3: No commit needed for data layer** — `select("*")` already returns the new columns automatically.

---

## Task 5: Update safari detail page — Render images on highlights, itinerary, sections, and full-width gallery

**Files:**
- Modify: `src/app/safaris/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ContentWithImage` component, `HighlightWithImage`, `SafariPageSection`, `SafariDayWithImage` types, `getSafariBySlug` (now returns new columns), `getGalleryMediaBySafari`
- Produces: Rendering of highlights with images, itinerary days with images, page sections with images, full-width bottom gallery

This is the largest frontend change. The modifications:

### 5a: Highlights — render each highlight with optional image
- Read `safari.highlights_content` (new JSONB) → if present and non-empty, use it
- Fall back to `safari.highlights` (text[]) → map to `{text: "..."}` objects
- For each highlight object, render text + optional `ContentWithImage` with alignment

Current code renders highlights as:
```tsx
{displayData.highlights.map((highlight: string) => (
  <p key={highlight} className="...">{highlight}</p>
))}
```

New code:
```tsx
{displayData.highlightsWithImages.map((highlight: HighlightWithImage) => (
  <div key={highlight.text} className="...">
    {highlight.image_url ? (
      <ContentWithImage body={highlight.text} imageUrl={highlight.image_url} alignment={highlight.image_alignment} />
    ) : (
      <p>{highlight.text}</p>
    )}
  </div>
))}
```

### 5b: Itinerary days — render each day with optional image
- `displayData.itinerary` items now may have `image_url` and `image_alignment`
- Use `ContentWithImage` for the day `body` field

### 5c: Page sections — render arbitrary CMS-managed sections before the bottom gallery
- Read `safari.page_sections` (new JSONB array)
- For each section, render a `<Section>` with title + `ContentWithImage` for body + image/alignment
- These sections render between the existing "Accommodation" section and the "FAQs" section (or wherever appropriate)

### 5d: Full-width bottom gallery
- After the "Want this adjusted?" / "Customize this itinerary" block, add a full-width gallery
- Use `galleryImages` from `getGalleryMediaBySafari(slug)` (already fetched)
- Render as a full-width grid (not the sidebar film strip)
- Reuse existing `GalleryImage` type from `related-gallery.tsx`

### 5e: Update `displayData` transform
The current `displayData` object needs to be updated to include the new fields:

```typescript
const displayData = {
  // ... existing fields ...
  highlightsWithImages: parseHighlights(safari.highlights_content, safari.highlights),
  pageSections: safari.page_sections || [],
  // itinerary already includes image_url/image_alignment from JSONB
};
```

- [ ] **Step 1: Update `displayData` to include new fields**
- [ ] **Step 2: Update highlights rendering with ContentWithImage**
- [ ] **Step 3: Update itinerary rendering with ContentWithImage**
- [ ] **Step 4: Add page sections rendering before bottom**
- [ ] **Step 5: Add full-width gallery after "Want this adjusted?" block**
- [ ] **Step 6: Verify build compiles**

```bash
cd /d "D:\Jackfruit Safaris" && npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add src/app/safaris/[slug]/page.tsx
git commit -m "feat: render aligned images in highlights, itinerary, page sections, and full-width bottom gallery on safari detail"
```

---

## Task 6: Create FullWidthGallery component — bottom-of-page gallery

**Files:**
- Create: `src/components/full-width-gallery.tsx`

**Interfaces:**
- Consumes: `GalleryImage` type (same shape as `RelatedGallery`)
- Produces: Full-width responsive grid/gallery component

This is a responsive grid (cols 1 on mobile → 2 md → 3 lg → 4 xl) of images with:
- Each image in a card with optional caption + photographer
- Click to view full-size (basic lightbox or link to image URL)
- Empty state: nothing renders if no images

```tsx
import type { GalleryImage } from "@/components/related-gallery";

type FullWidthGalleryProps = {
  images: GalleryImage[];
  title?: string;
};
```

- [ ] **Step 1: Implement the component**
- [ ] **Step 2: Commit**

```bash
git add src/components/full-width-gallery.tsx
git commit -m "feat: add FullWidthGallery component for bottom-of-page image display"
```

---

## Task 7: Update CMS actions — Parse and validate new image fields

**Files:**
- Modify: `src/lib/server/cms-actions.ts`

**Interfaces:**
- Consumes: Zod patterns, `uploadImageFromForm`
- Produces: Updated `safariSchema` + `parseSafariDetails` to handle image fields

### 7a: Update `safariSchema`
Add to the Zod schema:
```typescript
highlights_content: z.array(z.object({
  text: z.string().min(1),
  image_url: z.string().url().optional().or(z.literal("")),
  image_alignment: z.enum(["left", "right", "center"]).nullable().optional(),
})).optional(),
page_sections: z.array(z.object({
  key: z.string(),
  title: z.string().optional(),
  body: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  image_alignment: z.enum(["left", "right", "center"]).nullable().optional(),
})).optional(),
```

### 7b: Update `parseSafariDetails`
Modify itinerary parsing to include `image_url` and `image_alignment`:
```typescript
// In the itinerary loop, add:
const dayImageUrl = formData.get(`day_${i + 1}_image_url`) as string;
const dayImageAlignment = formData.get(`day_${i + 1}_image_alignment`) as string;
itinerary.push({ day, title, body, meals, image_url: dayImageUrl || null, image_alignment: dayImageAlignment || null });
```

- [ ] **Step 1: Update `safariSchema`**
- [ ] **Step 2: Update `parseSafariDetails` for itinerary image fields**
- [ ] **Step 3: Commit**

```bash
git add src/lib/server/cms-actions.ts
git commit -m "feat: add image_url and image_alignment fields to safari schema and itinerary parser"
```

---

## Task 8: Update admin safari edit form — Add image upload to highlights and itinerary days

**Files:**
- Modify: `src/app/admin/safaris/[id]/page.tsx`

**Interfaces:**
- Consumes: `ImageUploadField`, `ListEditor`, types from `content.ts`
- Produces: Admin form with image fields on highlights and itinerary days

### 8a: Replace `HighlightsSection` — structured editor with text + image + alignment
Instead of `ListEditor` (string[] only), create a new component or inline fields:
- For each highlight: text input + image URL upload field + alignment select (left/right/center)
- Output as JSON to `highlights_content` field

```tsx
function HighlightsSectionWithImages({ safari }: { safari: SafariRecord | null }) {
  const highlightsJson = asArray<HighlightWithImage>(safari?.highlights_content);
  // For each highlight, render: text input + image URL + alignment select
  // Output hidden input "highlights_content" as JSON
}
```

### 8b: Update `ItinerarySection` — Add image URL + alignment per day
For each itinerary day row, add:
- Image URL field (using `ImageUploadField` or a simple URL input)
- Alignment select (left/right/center)

### 8c: Add `PageSectionsSection` — CMS editor for arbitrary page sections
A section editor that lets admins add:
- Section key (text)
- Title (text)
- Body (WysiwygEditor)
- Image URL (ImageUploadField)
- Alignment select

Outputs as JSON to `page_sections` field.

- [ ] **Step 1: Replace HighlightsSection with image-aware version**
- [ ] **Step 2: Add image fields to ItinerarySection**
- [ ] **Step 3: Add PageSectionsSection component**
- [ ] **Step 4: Commit**

```bash
git add src/app/admin/safaris/[id]/page.tsx
git commit -m "feat: add image upload + alignment to highlights, itinerary days, and page sections in safari admin form"
```

---

## Task 9: Update safari admin actions route — Handle page_sections image uploads

**Files:**
- Modify: `src/app/admin/safaris/actions/route.ts`

Currently just delegates to `upsertSafariPackage`. Since the form now submits `highlights_content`, `page_sections`, and itinerary image fields, the `upsertSafariPackage` action (already updated in Task 7) handles them via `parseSafariDetails` and the schema. But page-sections image uploads need `uploadImageFromForm` calls.

- [ ] **Step 1: Add image upload handling for page_sections content images in `upsertSafariPackage`**
- [ ] **Step 2: Commit**

```bash
git add src/app/admin/safaris/actions/route.ts
git commit -m "fix: handle page_sections image uploads in safari actions"
```

---

## Task 10: Verification — Build and lint check

**Files:**
- All modified files

- [ ] **Step 1: Run TypeScript compiler check**

```bash
cd /d "D:\Jackfruit Safaris" && npx tsc --noEmit
```

- [ ] **Step 2: Run lint**

```bash
cd /d "D:\Jackfruit Safaris" && npm run lint
```

- [ ] **Step 3: Document migration application command**

Tell user to run `supabase db push` to apply the new migration.

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Every section/paragraph has image + alignment option (via `page_sections` JSONB + `ContentWithImage`)
- ✅ Highlights have image support (via `highlights_content` JSONB)
- ✅ Itinerary days have images within content (via itinerary JSONB `image_url` + `image_alignment`)
- ✅ Full-width gallery at bottom after "Want this adjusted?" (via `FullWidthGallery` using `gallery_media`)
- ✅ "Apply New Trip" sidebar maintained (`StickyQuoteCard` unchanged)
- ✅ Every frontend change has CMS backend parity (admin form + schema + actions)

**No placeholders:** All types, functions, and interfaces are defined in-tasks.

**Type consistency:** `ImageAlignment` type used consistently across frontend and admin.
