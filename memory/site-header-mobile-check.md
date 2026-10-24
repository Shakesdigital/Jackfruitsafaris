---
name: site-header-mobile-check
description: Site header mobile responsiveness verification
metadata:
  type: reference
---

## SiteHeader mobile check

**File:** `src/components/site-header.tsx`

**Verdict: SAFE** — does not contribute to the mobile overlap issue.

- `&lt;header className="sticky top-0 z-50 border-b border-black/10 bg-white/92 backdrop-blur-xl"&gt;` — sticky, properly z-indexed (z-50), has backdrop blur
- Inner wrapper: `container-responsive flex items-center justify-between py-3 sm:py-4` — bounded by `container-responsive` (max-width: 80rem)
- Logo: `logo-responsive` uses `clamp(48px, 6vw + 30px, 72px)` — never exceeds viewport
- Brand text: `hidden sm:block` — collapses to just first name on mobile (`sm:hidden`)
- Desktop nav: `hidden ... lg:flex` — hidden on mobile
- Mobile drawer: `absolute top-full right-0 z-50 mt-2 flex w-[calc(100vw-2rem)] max-w-xs` — uses `calc(100vw-2rem)` which is viewport-relative, properly constrained. `peer-checked:opacity-100` for visibility toggle
- Mobile drawer overlay: `fixed inset-0 z-40 flex bg-black/50 opacity-0 transition-opacity peer-checked:opacity-100` — semi-transparent overlay, correct z-stacking

**Git diff:** The working tree was clean (`git diff` returned nothing) — site-header.tsx modifications from the responsive audit (touch target fixes) were already committed.

**No overflow or overlap issues found in site-header.tsx or mobile-cta.tsx.**
