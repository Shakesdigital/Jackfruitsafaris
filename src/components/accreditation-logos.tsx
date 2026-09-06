"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const accreditationLogos = [
  { src: "/images/tripadvisor-logo.png", alt: "Tripadvisor Travelers' Choice Award" },
  { src: "/images/uganda-safari-guides-association.png", alt: "Uganda Safari Guides Association" },
  { src: "/images/uganda-wildlife-authority-logo.png", alt: "Uganda Wildlife Authority" },
  { src: "/images/tourism-uganda.png", alt: "Tourism Uganda" },
  { src: "/images/association-of-uganda-tour-operators.png", alt: "Association of Uganda Tour Operators" },
  { src: "/images/friend-a-gorilla.png", alt: "Friend a Gorilla" },
];

export function AccreditationLogos() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Duplicate the logos so the animation can loop seamlessly
  const allLogos = [...accreditationLogos, ...accreditationLogos];

  useEffect(() => {
    const container = trackRef.current?.parentElement;
    if (!container) return;

    const update = () => {
      setCanScrollLeft(container.scrollLeft > 8);
      setCanScrollRight(
        container.scrollLeft + container.offsetWidth < container.scrollWidth - 8
      );
    };

    update();
    container.addEventListener("scroll", update);
    return () => container.removeEventListener("scroll", update);
  }, []);

  const scrollBy = (distance: number) => {
    const container = trackRef.current?.parentElement;
    if (!container) return;
    container.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <section className="accreditation-section bg-white py-10 sm:py-12">
      <div className="container-responsive">
        <p className="text-center text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-muted-text)]">
          Trusted by leading Ugandan tourism bodies
        </p>

        <div
          className="accreditation-track relative mt-6 flex items-center gap-6 overflow-x-auto scroll-smooth [-webkit-scrollbar:_] sm:gap-8 md:gap-10"
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          <button
            onClick={() => scrollBy(-120)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 text-[var(--foreground)] shadow-md opacity-0 transition-opacity hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            style={{ opacity: showArrows ? 1 : 0 }}
          >
            <ChevronLeft size={20} />
          </button>

          <div ref={trackRef} className="accreditation-logos flex items-center gap-6 sm:gap-8 md:gap-10">
            {allLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="accreditation-logo flex h-16 w-auto shrink-0 items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-full w-auto object-contain opacity-75 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollBy(120)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 text-[var(--foreground)] shadow-md opacity-0 transition-opacity hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            style={{ opacity: showArrows ? 1 : 0 }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
