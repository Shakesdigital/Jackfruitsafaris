---
name: homepage-mobile-overflow-audit
description: Full home page mobile overflow sections audit
metadata:
  type: reference
---

## Homepage Mobile Overflow Audit (375px viewport)

All sections verified for horizontal overflow/risk. Only **AccreditationLogos** is the primary culprit.

| Section | Overflow risk | Verdict |
|---|---|---|
| 1. HeroSection | None | Safe |
| 2. Trust Bar (page.tsx:137) | None | Safe |
| 3. Why Uganda (page.tsx:156) | None | Safe |
| 4. Featured Safaris Carousel (page.tsx:201) | None (contained) | Safe |
| 5. Experiences Carousel (page.tsx:222) | None (contained) | Safe |
| 6. Reviews Carousel (page.tsx:259) | None (contained) | Safe |
| 7. CTA Section (page.tsx:298) | None | Safe |
| 8. AccreditationLogos (page.tsx:326) | **High** | **Primary culprit** |

**Why other sections are safe:**
- Carousels use `overflow-x-auto` on `.carousel-container` + each slide capped to `width: 100/visibleCount%`
- HeroSection backgrounds set via inline `style` (not `<img>`)
- `Section` wraps children in `container-responsive` (max-width 80rem)
- No global `overflow-x-hidden` on `<body>` — so each component must self-contain

**Key contrast:** The carousels deliberately use `overflow-x-auto` and capped slide widths. AccreditationLogos is the only section with 12 items in a flex row with no overflow containment and no width constraint on mobile.
