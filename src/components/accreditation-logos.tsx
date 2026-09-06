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
 * dependencies). The animation pauses on hover and is disabled entirely
 * under prefers-reduced-motion.
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

        <div
          ref={trackRef as RefObject<HTMLDivElement>}
          className="accreditation-track relative mt-6 flex items-center gap-6 sm:gap-8 md:gap-10"
        >
          <div className="accreditation-logos flex items-center gap-6 sm:gap-8 md:gap-10">
            {allLogos.map((logo, index) => (
              <Logo
                key={`${logo.alt}-${index}`}
                src={logo.src}
                alt={logo.alt}
                className="h-14 w-auto opacity-80 transition-opacity duration-300 hover:opacity-100 sm:h-16"
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
      sizes="(max-width: 640px) 120px, 144px"
      {...props}
    />
  );
}
