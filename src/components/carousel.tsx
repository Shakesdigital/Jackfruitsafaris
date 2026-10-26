"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: React.ReactNode[];
  /** Number of cards to show on mobile (default 1) */
  mobileCount?: number;
  /**
   * Number of cards to show on tablet (640px–1023px).
   * Falls back to mobileCount when not provided.
   */
  tabletCount?: number;
  /**
   * Number of cards to show on desktop/tablet (≥1024px).
   * When set, uses a single lg+ breakpoint instead of the default
   * xl(4)/lg(3) split. Omit to preserve the original responsive behavior.
   */
  desktopCount?: number;
  /**
   * When true, the carousel loops infinitely: the children are duplicated
   * so the user can scroll seamlessly from the last item back to the first.
   * Navigation arrows are always shown when itemCount > 1.
   */
  loop?: boolean;
};

export function Carousel({ children, mobileCount = 1, tabletCount, desktopCount, loop = false }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemCount = children.length;
  const isLooping = loop && itemCount > 1;

  /** Render each child wrapped in a fixed-width snap snap-point. */
  function renderSlides(items: React.ReactNode[]) {
    return items.map((child, idx) => (
      <div
        key={idx}
        className="scroll-snap-start flex-shrink-0"
        style={{ width: `${100 / visibleCount}%` }}
      >
        {child}
      </div>
    ));
  }

  // Determine how many cards are visible based on viewport width
  function getVisibleCount() {
    if (typeof window === "undefined") return mobileCount;
    if (desktopCount !== undefined) {
      if (window.innerWidth >= 1024) return desktopCount;
      if (window.innerWidth >= 640 && tabletCount !== undefined) return tabletCount;
      return mobileCount;
    }
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640 && tabletCount !== undefined) return tabletCount;
    return mobileCount;
  }

  const [visibleCount, setVisibleCount] = useState(mobileCount);

  useEffect(() => {
    function handleResize() {
      setVisibleCount(getVisibleCount());
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Infinite loop wrap on manual scroll ---
    if (isLooping) {
      const handleScroll = () => {
        const cardWidth = container.offsetWidth / visibleCount;
        if (cardWidth <= 0) return;
        const setWidth = cardWidth * itemCount;
        if (container.scrollLeft >= setWidth) {
          container.scrollLeft -= setWidth;
        } else if (container.scrollLeft < 0) {
          container.scrollLeft += setWidth;
        }
      };
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [itemCount, visibleCount, isLooping]);

  function getCardStep() {
    const container = containerRef.current;
    if (!container) return 0;
    return container.offsetWidth / visibleCount;
  }

  function scrollByCards(cards: number) {
    const container = containerRef.current;
    if (!container) return;
    const cardStep = getCardStep();

    if (isLooping) {
      const setWidth = cardStep * itemCount;
      let target = container.scrollLeft + cardStep * cards;
      if (target >= setWidth) target -= setWidth;
      if (target < 0) target += setWidth;
      container.scrollTo({ left: target, behavior: "smooth" });
    } else {
      container.scrollBy({ left: cardStep * cards, behavior: "smooth" });
    }
  }

  const canScrollLeft = () => {
    if (isLooping) return true;
    const container = containerRef.current;
    return container ? container.scrollLeft > 10 : false;
  };

  const canScrollRight = () => {
    if (isLooping) return true;
    const container = containerRef.current;
    if (!container) return false;
    return container.scrollLeft + container.offsetWidth < container.scrollWidth - 10;
  };

  const showNav = isLooping ? itemCount > 1 : itemCount > visibleCount;

  if (itemCount <= 0) return null;

  // When looping, duplicate the children so the animation wraps seamlessly.
  const renderedChildren = isLooping ? [...children, ...children] : children;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="carousel-container flex gap-3 overflow-x-auto scroll-p-4 scroll-smooth [-webkit-scrollbar:_] sm:gap-4"
      >
        {renderSlides(renderedChildren)}
      </div>

      {showNav && (
        <>
          <button
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft()}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--foreground)] shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <ChevronLeft size={24} className="text-[var(--brand-accent)]" aria-hidden="true" />
          </button>
          <button
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight()}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--foreground)] shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <ChevronRight size={24} className="text-[var(--brand-accent)]" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
