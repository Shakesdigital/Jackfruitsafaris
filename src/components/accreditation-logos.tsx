"use client";

import { type ComponentPropsWithoutRef, type RefObject, useRef } from "react";

const accreditationLogos = [
  { src: "/images/tripadvisor-logo.png", alt: "Tripadvisor Travelers' Choice Award" },
  { src: "/images/uganda-safari-guides-association.png", alt: "Uganda Safari Guides Association" },
  { src: "/images/uganda-wildlife-authority-logo.png", alt: "Uganda Wildlife Authority" },
  { src: "/images/tourism-uganda.png", alt: "Tourism Uganda" },
  { src: "/images/association-of-uganda-tour-operators.png", alt: "Association of Uganda Tour Operators" },
  { src: "/images/friend-a-gorilla.png", alt: "Friend a Gorilla" },
];

/**
 * AccreditationLogos — a horizontal, continuously-sliding carousel of
 * accreditation / partnership badges with a transparent background that
 * blends seamlessly into the section behind it.
 *
 * The logos slide horizontally via a CSS keyframe animation (no external
 * dependencies). The animation runs on all screen sizes and is disabled
 * entirely under prefers-reduced-motion. It pauses on hover.
 *
 * The logo set is duplicated (2×) so the animation loops seamlessly
 * end-to-end. On mobile fewer badges are visible at once, but the
 * continuous sliding ensures the full set is discoverable.
 */
export function AccreditationLogos() {
  // Duplicate the set so the animation loops seamlessly end-to-end.
  const allLogos = [...accreditationLogos, ...accreditationLogos];
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="accreditation-section bg-white py-10 sm:py-12">
      <div className="container-responsive">
        <p className="text-center text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-muted-text)]">
          Trusted by leading Ugandan tourism bodies
        </p>

        {/*
          overflow-hidden clips the sliding animation on every breakpoint.
          On mobile the badges still move but are contained within the track.
        */}
        <div
          ref={trackRef as RefObject<HTMLDivElement>}
          className="accreditation-track relative mt-6 flex items-center gap-4 overflow-hidden sm:gap-6 md:gap-8"
        >
          <div className="accreditation-logos flex items-center gap-4 sm:gap-6 md:gap-8">
            {allLogos.map((logo, index) => (
              <Logo
                key={`${logo.alt}-${index}`}
                src={logo.src}
                alt={logo.alt}
                className="h-10 w-auto opacity-80 transition-opacity duration-300 hover:opacity-100 sm:h-12 md:h-14"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type LogoProps = ComponentPropsWithoutRef<"img">;

function Logo({ className, ...props }: LogoProps) {
  return (
    <img
      className={`shrink-0 object-contain ${className ?? ""}`}
      loading="lazy"
      decoding="async"
      sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 144px"
      {...props}
    />
  );
}
