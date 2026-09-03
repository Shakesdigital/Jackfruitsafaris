# Homepage Carousel + CMS Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the homepage to feature a custom carousel for Featured Safaris and Experiences, rewrite the Why Uganda section with a CMS-managed image, add reviewer avatars to review cards, and remove the Travel Guide section — all backed by CMS updates.

**Architecture:** Create a reusable scroll-snap carousel component, integrate it into the homepage replacing static grids, add a CMS-managed image field to the Why Uganda section editor, and extend the review data flow to include `image_url` for reviewer avatars.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, Supabase (CMS backend), TypeScript, React 19

**Spec:** docs/superpowers/specs/2026-09-03-homepage-cms-enhancements-design.md

## Global Constraints
- Next.js 16.2.9
- Tailwind CSS v4
- React 19.2.4
- TypeScript 5.x
- No new npm dependencies (use native CSS scroll-snap)
- `fable-mode-pro` workflow: verify-then-flag at each stage
- Commit after each task with clear messages
- Push all changes to main at the end

---

### Task 1: Create reusable Carousel component

**Files:**
- Create: `src/components/carousel.tsx`

**Interfaces:**
- Consumes: `ReactNode[]` children (cards)
- Produces: `<Carousel>` component used by homepage safari + experience sections

The carousel is a client component using CSS scroll-snap:
- Horizontal `overflow-x-auto` scroll container with `scroll-snap-type-x mandatory`
- Each child has `scroll-snap-align: start` + `flex: 0 0 auto` + calculated width based on `scrollWidth/cardCount`
- Visible card count changes by CSS breakpoint: 1 (mobile), 1 (sm, peek), 3 (lg), 4 (xl)
- Arrow buttons (left/right) that call `container.scrollBy({ left: cardStep, behavior: 'smooth' })`
- Dot pagination: one dot per card, active dot reflects `Math.round(scrollLeft / cardWidth)`
- `useEffect` on `scroll` event to sync dots
- Keyboard support: arrow left/right keys scroll container
- Disabled arrow states when at scroll boundary

- [ ] **Step 1: Write the Carousel component**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: React.ReactNode[];
  /** Number of cards to show on mobile (default 1) */
  mobileCount?: number;
};

export function Carousel({ children, mobileCount = 1 }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemCount = children.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateActive = () => {
      const cardWidth = container.offsetWidth / getVisibleCount();
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(index, itemCount - 1)));
    };

    container.addEventListener("scroll", updateActive);
    updateActive();
    return () => container.removeEventListener("scroll", updateActive);
  }, [itemCount]);

  function getVisibleCount() {
    if (typeof window === "undefined") return mobileCount;
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    return mobileCount;
  }

  function getCardStep() {
    const container = containerRef.current;
    if (!container) return 0;
    return container.offsetWidth / getVisibleCount();
  }

  function scrollByCards(cards: number) {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: getCardStep() * cards, behavior: "smooth" });
  }

  const canScrollLeft = () => {
    const container = containerRef.current;
    return container ? container.scrollLeft > 10 : false;
  };

  const canScrollRight = () => {
    const container = containerRef.current;
    if (!container) return false;
    return container.scrollLeft + container.offsetWidth < container.scrollWidth - 10;
  };

  if (itemCount <= 0) return null;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="carousel-container flex gap-4 overflow-x-auto scroll-p-4 scroll-smooth"
      >
        {children.map((child, idx) => (
          <div
            key={idx}
            className="scroll-snap-start flex-shrink-0"
            style={{ width: `${100 / getVisibleCount()}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {itemCount > getVisibleCount() && (
        <>
          <button
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft()}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight()}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-md disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div className="mt-4 flex justify-center gap-1">
        {children.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const container = containerRef.current;
              if (!container) return;
              container.scrollLeft = getCardStep() * idx;
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 w-2 rounded-full ${
              idx === activeIndex
                ? "bg-[var(--brand-accent)]"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add CSS for carousel scroll-snap**

Add to `src/app/globals.css`:
```css
.carousel-container {
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.carousel-container::-webkit-scrollbar {
  display: none;
}
.carousel-container .scroll-snap-start {
  scroll-snap-align: start;
}
```

- [ ] **Step 3: Verify** — run `npx tsc --noEmit` to check TypeScript

- [ ] **Step 4: Commit** — `feat: add responsive carousel component for safari/experience cards`

```bash
git add src/components/carousel.tsx src/app/globals.css
git commit -m "feat: add responsive carousel component for safari/experience cards"
```

---

### Task 2: Update CMS PageContentEditor — add background_image field for Why Uganda

**Files:**
- Modify: `src/app/admin/_components/page-content-editor.tsx`

Add `"background_image"` to the `why_uganda` `SECTION_FIELDS` array:
```tsx
why_uganda: [
  { name: "section_title", label: "Section Title", type: "text" },
  { name: "intro", label: "Intro Text", type: "wysiwyg" },
  { name: "paragraph", label: "Body Text", type: "wysiwyg" },
  { name: "background_image", label: "Background Image URL", type: "url" },
],
```

The existing `resolveFields` already maps `"url"` type to a plain text input, so no additional rendering logic is needed — just adding the field entry is sufficient.

- [ ] **Step 1: Add background_image field to SECTION_FIELDS**

- [ ] **Step 2: Verify** — TypeScript compiles

- [ ] **Step 3: Commit** — `feat: add background_image field to Why Uganda CMS editor`

```bash
git add src/app/admin/_components/page-content-editor.tsx
git commit -m "feat: add background_image field to Why Uganda CMS editor"
```

---

### Task 3: Update homepage — Why Uganda section (remove green box + form, add image)

**Files:**
- Modify: `src/app/page.tsx`

**Current structure (lines 199-221):**
```tsx
<Section ...>
  <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
    <div className="rounded-[var(--brand-radius)] bg-[var(--brand-primary)] p-6 ...">
      <CmsRichText html={...body...} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {featuresList.map(...)}
      </div>
    </div>
    <QuoteForm sourcePage="homepage" compact />
  </div>
</Section>
```

**New structure:**
```tsx
<Section ...>
  <div className="space-y-8">
    <CmsRichText className="text-fluid-lg ..." html={...intro...} />
    {whyUgandaBgImage && (
      <div className="rounded-[var(--brand-radius)] overflow-hidden">
        <img src={whyUgandaBgImage} alt="Why Uganda — landscape" className="w-full h-auto object-cover" />
      </div>
    )}
  </div>
</Section>
```

Changes:
- Remove the green `bg-[var(--brand-primary)]` card box
- Remove the `QuoteForm` component
- Keep features list inside the intro or as separate bullets after the image
- Add `background_image` from the why_uganda section content: `getSectionText(whyUgandaSection, "background_image", "")`
- Remove the `QuoteForm` import

- [ ] **Step 1: Remove QuoteForm import**

```tsx
// Remove: import { QuoteForm } from "@/components/quote-form";
```

- [ ] **Step 2: Replace Why Uganda section JSX**

- [ ] **Step 3: Verify** — TypeScript compiles

- [ ] **Step 4: Commit** — `refactor: replace Why Uganda green box + form with CMS-managed heading, description, and image`

```bash
git add src/app/page.tsx
git commit -m "refactor: replace Why Uganda green box + form with CMS-managed heading, description, and image"
```

---

### Task 4: Update homepage — Featured Safaris → Carousel

**Files:**
- Modify: `src/app/page.tsx`

Replace:
```tsx
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
  {safaris.map((safari: any) => (
    <SafariCard key={safari.slug} safari={...} />
  ))}
</div>
```

With:
```tsx
<Carousel>
  {safaris.map((safari: any) => (
    <SafariCard key={safari.slug} safari={...} />
  ))}
</Carousel>
```

- [ ] **Step 1: Add Carousel import**

- [ ] **Step 2: Replace grid with Carousel**

- [ ] **Step 3: Verify** — TypeScript compiles

- [ ] **Step 4: Commit** — `feat: convert Featured Safaris section to responsive carousel`

```bash
git add src/app/page.tsx
git commit -m "feat: convert Featured Safaris section to responsive carousel"
```

---

### Task 5: Update homepage — Experiences → Carousel

**Files:**
- Modify: `src/app/page.tsx`

Same pattern as Task 4 — wrap the experience map in `<Carousel>` instead of the static grid.

- [ ] **Step 1: Replace grid with Carousel for experiences**

- [ ] **Step 2: Verify** — TypeScript compiles

- [ ] **Step 3: Commit** — `feat: convert Experiences section to responsive carousel`

```bash
git add src/app/page.tsx
git commit -m "feat: convert Experiences section to responsive carousel"
```

---

### Task 6: Update homepage — Reviews: smaller font + reviewer avatar

**Files:**
- Modify: `src/app/page.tsx`

**Changes to review card:**
- Change quote: `text-fluid-lg font-bold` → `text-fluid-lg font-normal` (or `text-fluid-base font-normal`)
- Add avatar at top-left of card using `image_url`:
```tsx
{review.image_url ? (
  <img src={review.image_url} alt={review.guest_name} className="h-10 w-10 rounded-full object-cover" />
) : (
  <UserCircle size={40} className="text-[var(--brand-muted-text)]" />
)}
```

**Changes to data mapping:**
- Update the homepage testimonial mapping to include `image_url`:
```tsx
const testimonials = cmsTestimonials.length ? cmsTestimonials.map(t => ({
  guest_name: t.guest_name,
  trip_type: t.trip_type,
  quote: t.quote,
  image_url: t.image_url,
})) : ...
```

- [ ] **Step 1: Import UserCircle icon from lucide-react**

- [ ] **Step 2: Add image_url to testimonial mapping**

- [ ] **Step 3: Update review card JSX with avatar and adjusted font**

- [ ] **Step 4: Remove Travel Guide section from homepage** (Task 6b)

Remove the entire `<Section>` block for travel_guide (lines 312-332 in current page.tsx)

- [ ] **Step 5: Verify** — TypeScript compiles

- [ ] **Step 6: Commit** — `refactor: adjust review card font + add reviewer avatars, remove Travel Guide section`

```bash
git add src/app/page.tsx
git commit -m "refactor: adjust review card font + add reviewer avatars, remove Travel Guide section"
```

---

### Task 7: Update reviews page — add reviewer avatar

**Files:**
- Modify: `src/app/reviews/page.tsx`

Apply the same changes as Task 6:
- Include `image_url` in the reviews mapping
- Add avatar to each review card
- Make quote `font-normal` instead of `font-bold`

- [ ] **Step 1: Update reviews data mapping to include image_url**

- [ ] **Step 2: Update review card JSX with avatar and adjusted font**

- [ ] **Step 3: Verify** — TypeScript compiles

- [ ] **Step 4: Commit** — `refactor: add reviewer avatars and adjust review card font on reviews page`

```bash
git add src/app/reviews/page.tsx
git commit -m "refactor: add reviewer avatars and adjust review card font on reviews page"
```

---

### Task 8: Verify build and push

- [ ] **Step 1: Run TypeScript type-check** — `npx tsc --noEmit`
- [ ] **Step 2: Run Next.js build** — `npm run build`
- [ ] **Step 3: Push all commits to main**
```bash
git push origin main
```
- [ ] **Step 4: Report final status**
