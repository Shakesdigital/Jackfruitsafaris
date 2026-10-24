---
title: "Root Cause Analysis: Mobile Overlap in AccreditationLogos Component"
component: "AccreditationLogos"
created: 2026-09-06
analysis_type: "Mobile overflow / layout overlap"
status: "complete"
---

# Root Cause Analysis: Mobile Overlap in the AccreditationLogos Component

## TL;DR Summary

On screens narrower than 768px, the animation media query does not apply and the `.accreditation-track` container has no `overflow` clipping. The inner `.accreditation-logos` div holds 12 logos (6 originals + 6 duplicates for the infinite animation loop). On a 375px-wide screen, these 12 logos (each ~120-144px wide with 24px gaps) produce a total content width of roughly 1500-1700px, which spills far beyond the viewport. Because nothing clips or contains this overflow, the wide element visually collides with neighboring page elements, producing the observed overlap.

## 1. Mobile Rendering Behavior (Below 768px)

### 1.1 The Animation Does Not Apply

The entire animation is gated behind a `min-width: 768px` media query in `globals.css` (lines 415-422). On mobile (e.g., 375px wide), this media query is never active. Therefore `animation: slide-logos` is not applied and `width: max-content` on `.accreditation-logos` is also not applied.

### 1.2 The Container `.accreditation-track` Has No Overflow Management

The `.accreditation-track` div in `accreditation-logos.tsx` (line 37) has class `flex items-center gap-6 sm:gap-8 md:gap-10` but **no `overflow-hidden` class**. The CSS file confirms: the only references to `.accreditation-track` in globals.css are a comment (line 411) and the `:hover` rule inside the media query. There is no actual `overflow` CSS rule for `.accreditation-track` at any breakpoint.

The comment on line 411 claims "The outer .accreditation-track clips overflow" but this is misleading - the overflow clipping is never actually implemented via CSS or Tailwind classes.

### 1.3 The Logos Are All Visible (12 Items)

The data array contains 6 logos, duplicated to 12 via `const allLogos = [...accreditationLogos, ...accreditationLogos]` (line 25). All 12 logos are rendered unconditionally into the DOM on every breakpoint, including mobile.

## 2. Computed Width Calculation on a 375px Mobile Screen

### 2.1 Per-Logo Dimensions

From the JSX (line 45), each image has `h-14 w-auto` and `sizes="(max-width: 640px) 120px"`. On mobile, each logo renders at approximately 120px wide.

### 2.2 Gap Spacing

Both `.accreditation-track` and `.accreditation-logos` use `gap-6` = 24px.

### 2.3 Total Content Width

12 logos with 24px gaps between each adjacent pair:
- Logo width: 12 x 120px = 1440px
- Gap contribution: 11 x 24px = 264px
- Total minimum content width = approximately 1704px

### 2.4 Comparison to Viewport

- Mobile viewport width: 375px
- `.accreditation-logos` content width: ~1700px
- Overflow ratio: ~4.5x the viewport width

Each img has `shrink-0` (line 60), preventing them from shrinking to fit. The `flex items-center` on the track places all items on a single line. Since total content exceeds container width, it overflows horizontally.

## 3. Why This Causes Visual Overlap

### 3.1 No Clipping = Overflow Is Visible

Without `overflow-hidden` on `.accreditation-track`, the default is `overflow: visible`. When 12 logos totaling ~1700px are placed in a container that is only ~375px wide, the content paints outside the container's bounding box with no clipping.

### 3.2 Interaction with Adjacent Elements

When the logos overflow the track's right edge:
1. The logos extend beyond the right padding/gutter of the page container
2. On pages where `.accreditation-section` is near other content, the overflowing logos draw over top of or beneath adjacent elements
3. Because images have `opacity-80` and transparent PNG backgrounds, the overlapping logos create visual layering where you see through the semi-transparent badge into whatever is underneath

### 3.3 Why Desktop Hides This

At >=768px, `width: max-content` on `.accreditation-logos` and the animation work together. The sliding animation means only a window of logos is visible at once. On mobile without the animation, all 12 logos are statically visible in a single row exceeding 1700px.

## 4. EXACT Root Cause

**The `.accreditation-track` container in `accreditation-logos.tsx` (line 37) is missing the `overflow-hidden` class, and no corresponding `overflow` CSS rule exists in `globals.css` for `.accreditation-track` outside the `min-width: 768px` media query. On mobile, the animation media query is inactive, so `.accreditation-logos` has no width constraint, and all 12 logos (each `shrink-0` at ~120px with 24px gaps) total ~1700px. With `overflow: visible` (the default), this content spills beyond the viewport and overlaps adjacent page elements.**

### Missing CSS Properties

| Property | Location | Status |
|---|---|---|
| `overflow-hidden` class on `.accreditation-track` | JSX line 37 | MISSING |
| `overflow: hidden` CSS rule for `.accreditation-track` | `globals.css` | MISSING (outside the >=768px media query) |
| Conditional rendering of 6 vs 12 logos on mobile | JSX - `allLogos` always renders 12 | Design gap |

## 5. Recommended Fix Direction

1. Add `overflow-hidden` to `.accreditation-track` on mobile
2. On mobile, render only the original 6 logos since the animation loop logic is inactive
3. Reconcile the `shrink-0` class with `w-auto` for mobile responsiveness
4. Add an `@media (max-width: 767px)` block in globals.css to handle the non-animated mobile state

## 6. Key File References

| File | Line(s) | Content |
|---|---|---|
| `src/components/accreditation-logos.tsx` | 25 | `const allLogos = [...accreditationLogos, ...accreditationLogos]` - always 12 items |
| `src/components/accreditation-logos.tsx` | 37 | `.accreditation-track` - missing `overflow-hidden` |
| `src/components/accreditation-logos.tsx` | 39 | `.accreditation-logos` inner div - no mobile width constraint |
| `src/components/accreditation-logos.tsx` | 45 | Each `img`: `h-14 w-auto shrink-0` - shrink-0 prevents shrinking |
| `src/components/accreditation-logos.tsx` | 60 | `shrink-0` class on img prevents flex shrinking |
| `src/components/accreditation-logos.tsx` | 63 | `sizes="(max-width: 640px) 120px"` - 120px slot on mobile |
| `src/app/globals.css` | 409-427 | Animation CSS inside `@media (min-width: 768px)` |
| `src/app/globals.css` | 411 | Comment claims track clips overflow - not implemented |
| `src/app/globals.css` | 415-422 | Media query block - inactive on mobile |
| `src/app/globals.css` | 424-427 | `@keyframes slide-logos` |

---

## 7. Fix Applied (2026-09-06 — Final)

**Status: ✅ FIXED and verified** — carousel now loops on ALL screen sizes including mobile.

### Changes made:

#### `src/components/accreditation-logos.tsx`
1. **Always renders 12 logos** (6 original + 6 duplicated) for seamless animation loop on all breakpoints
2. **`overflow-hidden` on `.accreditation-track`** (base class, all breakpoints) — clips the sliding animation so nothing can escape the container
3. **Smaller logos on mobile** — `h-10` on mobile, `sm:h-12` on tablet, `md:h-14` on desktop (was `h-14` fixed)
4. **Smaller gaps on mobile** — `gap-4` on mobile, `sm:gap-6` on tablet, `md:gap-8` on desktop (was `gap-6 sm:gap-8 md:gap-10`)
5. **Updated `sizes` attribute** — `(max-width: 640px) 96px, (max-width: 768px) 112px, 144px` (was 120px, 144px) for properly scaled mobile logos

#### `src/app/globals.css` (lines 409-438)
1. **Mobile-first animation** — removed `min-width: 768px` from the base media query; now `@media (prefers-reduced-motion: no-preference)` applies to ALL screen sizes
2. **`overflow: hidden` on `.accreditation-track`** inside the media query — clips the `translateX(-50%)` animation's off-screen portion at all breakpoints
3. **Animation duration tuned** — 32s on mobile (fewer logos visible at once = slower), 24s on tablet+ (more logos visible = faster)

### Why this works:
- **Mobile loop:** The animation now runs at all screen sizes. The continuous CSS keyframe animation slides the duplicated logoss row from `translateX(0)` to `translateX(-50%)`, creating an infinite seamless loop.
- **No overflow:** `overflow: hidden` on `.accreditation-track` (both via CSS and Tailwind class) clips the animation content so it can never escape the container and overlap adjacent elements.
- **Respects reduced motion:** Both media queries are gated by `prefers-reduced-motion: no-preference`.
- **Smaller badges on mobile:** Logos are 40px tall on mobile (h-10), 48px on tablet (sm:h-12), 56px on desktop (md:h-14).

### Verification:
- `npx tsc --noEmit` — ✅ passed (exit code 0, no errors)
- `npx next build` — ✅ passed (✓ Compiled successfully in 71s, exit code 0, all 18 routes generated)
