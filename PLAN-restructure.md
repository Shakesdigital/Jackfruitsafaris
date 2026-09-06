# PLAN-restructure.md — Mobile/Tablet Responsive Redesign Execution Plan

**Project:** Jackfruit Safaris — Mobile & Tablet Responsiveness  
**Date:** 2026-09-06  
**Mode:** Fable Mode Pro (staged execution)  
**Source of truth:** RESPONSIVE-AUDIT.md  

---

## Stage 1: Discovery & Audit — ✅ COMPLETE
Audit file: `RESPONSIVE-AUDIT.md` (762 lines).  
Findings: 3 Critical, 6 High, 7 Medium, 5 Low priority issues.

## Stage 2: Plan

### Breakpoint Strategy (Already Established — No Changes Needed)
| Breakpoint | Value | Purpose |
|---|---|---|
| Mobile (base) | 0–639px | iPhone SE through iPhone 15 Pro Max |
| sm | 640px | Tablet portrait transition |
| md | 768px | Tablet landscape transition |
| lg | 1024px | Laptop transition |
| xl | 1280px | Large desktop (Tailwind implicit) |
| Explicit | 1440px | Extra-large desktop spacing |

**Approach:** Mobile-first. All components already use this. No breakpoint changes needed.

### Work Areas (Parallel Agents)

| # | Area | Files | Priority | Agent |
|---|------|-------|----------|-------|
| A | Footer color logic + Tours page alignment | `src/components/site-footer.tsx`, `src/app/layout.tsx`, `src/app/tours/page.tsx` | Critical | Agent A |
| B | Carousel touch targets | `src/components/carousel.tsx`, `src/app/globals.css` (if needed) | High | Agent B |
| C | Gallery lightbox/gallery interactivity | `src/components/related-gallery.tsx`, `src/components/experience-gallery.tsx` | High | Agent C |
| D | Travel Guide page consistency | `src/app/travel-guide/[slug]/page.tsx`, `src/app/travel-guide/page.tsx` | High | Agent D |
| E | Image optimization (lazy-loading + srcset) | All public-facing pages + components using `<img>` | High | Agent E |
| F | Admin table & form touch targets | All `src/app/admin/**` pages, `src/app/admin/_components/*` | Medium + Low | Agent F |
| G | Misc fixes | `src/components/mobile-cta.tsx`, `src/components/ErrorBoundary.tsx`, about page prose | Low | Agent G |

### Dependency Graph
- Areas A–E are **fully independent** — no shared files.
- Area F (Admin) touches some shared components in `_components/` — run after E starts since they may touch the same form-control areas.
- Area G is independent.
- All areas can run in parallel.

### Pass Conditions Per Stage
- **Stage 3 (Implementation):** Each agent must report: (a) files changed, (b) build/lint passes, (c) no new TypeScript errors.
- **Stage 4 (Verification):** `npm run build` passes; all touch targets ≥44px on mobile; footer text color adapts to background; tours page uses design system tokens.
- **Stage 5 (Delivery):** No critical or high issues remain; medium/low issues either fixed or documented.

---

## Stage 3: Implementation (Fan-Out)

Agents will be dispatched in parallel per the areas above. Each agent receives:
- The audit findings specific to its area
- Exact file paths and line numbers
- Priority ordering of sub-tasks
- A requirement to run `npm run build` (or equivalent) and report results

### Agent A — Footer Color Logic + Tours Page Alignment (Critical)
**Tasks:**
1. Fix footer text color to adapt to background color (not hardcoded white) in `layout.tsx` `buildAestheticStyle()` and `site-footer.tsx`
2. Replace hardcoded `#ffffff` border color in footer copyright divider with `var(--footer-muted-text)`
3. Bring `tours/page.tsx` into the responsive design system (use `container-responsive`, `text-fluid-*`, `hero-h-responsive`)

### Agent B — Carousel Touch Targets (High)
**Tasks:**
1. Increase carousel nav button touch targets to 44px+ (add padding or size-12)
2. Increase pagination dots to 44px+ (wrap in larger touch area or increase size)
3. Ensure carousel buttons are keyboard-focusable and have visible focus rings

### Agent C — Gallery Interactivity on Touch (High)
**Tasks:**
1. Fix RelatedGallery hero image info overlay — add tap/click to toggle on mobile (or always visible on mobile)
2. Increase ExperienceGallery lightbox close and nav button sizes to 44px+ (`size-10` → `size-12` or add padding)

### Agent D — Travel Guide Page Consistency (High)
**Tasks:**
1. Add `hero-h-responsive` class to travel guide article hero strip
2. Fix CTA card to stack on mobile (`flex-col sm:flex-row`)

### Agent E — Image Optimization (High)
**Tasks:**
1. Add `loading="lazy"` to all content `<img>` tags
2. Add `srcset`/`sizes` or migrate to Next.js `<Image>` component for key images
3. Ensure all images have `max-width: 100%` via Tailwind classes or CSS

### Agent F — Admin Touch Targets (Medium + Low)
**Tasks:**
1. Reduce admin table cell padding on mobile (`px-6` → `px-3 sm:px-6`)
2. Increase admin form/submit button touch targets to 44px+
3. Increase admin sidebar close button size
4. Add consistent `focus-visible` rings to all admin buttons
5. Fix ErrorBoundary reload button focus ring

### Agent G — Misc Fixes (Low)
**Tasks:**
1. Fix `MobileCta` `ml-2` → `gap` pattern
2. Add `title` attributes to links for accessibility
3. Apply `prose` class to About page CMS content rendering for responsive CMS content

---

## Stage 4: Verification
- Run `npm run build` — must pass
- Verify all touch targets ≥44px on mobile
- Verify footer text color adapts to background changes
- Verify tours page uses design system tokens

## Stage 5: Self-Critique & Delivery
- Final review of all changes
- Document any remaining issues
- Write `DELIVERY-NOTES.md`
