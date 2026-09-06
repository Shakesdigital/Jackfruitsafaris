"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: React.ReactNode[];
  /** Number of cards to show on mobile (default 1) */
  mobileCount?: number;
  /**
   * Number of cards to show on desktop/tablet (≥1024px).
   * When set, uses a single lg+ breakpoint instead of the default
   * xl(4)/lg(3) split. Omit to preserve the original responsive behavior.
   */
  desktopCount?: number;
  /**
   * When true, the carousel loops infinitely: the children are duplicated
   * so the user can scroll seamlessly from the last item back to the first.
   * Navigation arrows and pagination dots are always shown (when itemCount > 1).
   */
  loop?: boolean;
};

export function Carousel({ children, mobileCount = 1, desktopCount, loop = false }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
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
      return mobileCount;
    }
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
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

    const updateActive = () => {
      const cardWidth = container.offsetWidth / visibleCount;
      if (cardWidth <= 0) return;

      // --- Infinite loop wrap on manual scroll ---
      if (isLooping) {
        const setWidth = cardWidth * itemCount;
        if (container.scrollLeft >= setWidth) {
          container.scrollLeft -= setWidth;
        } else if (container.scrollLeft < 0) {
          container.scrollLeft += setWidth;
        }
      }

      const rawIndex = Math.round(container.scrollLeft / cardWidth);
      if (isLooping) {
        // Map the raw (possibly overscrolled) index into 0..itemCount-1
        const normalized = ((rawIndex % itemCount) + itemCount) % itemCount;
        setActiveIndex(normalized);
      } else {
        setActiveIndex(Math.max(0, Math.min(rawIndex, itemCount - 1)));
      }
    };

    container.addEventListener("scroll", updateActive);
    updateActive();
    return () => container.removeEventListener("scroll", updateActive);
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
            className="absolute left-1 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[var(--foreground)] shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight()}
            aria-label="Next"
            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[var(--foreground)] shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
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
              // When looping, ensure we're in the first set before jumping
              if (isLooping) {
                const cardStep = getCardStep();
                const setWidth = cardStep * itemCount;
                if (container.scrollLeft >= setWidth) {
                  container.scrollLeft -= setWidth;
                }
              }
              container.scrollLeft = getCardStep() * idx;
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className="flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <span
              className={`block h-3 w-3 rounded-full transition-colors ${
                idx === activeIndex
                  ? "bg-[var(--brand-accent)]"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
