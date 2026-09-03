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

  // Determine how many cards are visible based on viewport width
  function getVisibleCount() {
    if (typeof window === "undefined") return mobileCount;
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
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(index, itemCount - 1)));
    };

    container.addEventListener("scroll", updateActive);
    updateActive();
    return () => container.removeEventListener("scroll", updateActive);
  }, [itemCount, visibleCount]);

  function getCardStep() {
    const container = containerRef.current;
    if (!container) return 0;
    return container.offsetWidth / visibleCount;
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
            style={{ width: `${100 / visibleCount}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {itemCount > visibleCount && (
        <>
          <button
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft()}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white/90 text-[var(--foreground)] shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight()}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/90 text-[var(--foreground)] shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
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
            className={`h-2 w-2 rounded-full transition-colors ${
              idx === activeIndex
                ? "bg-[var(--brand-accent)]"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
