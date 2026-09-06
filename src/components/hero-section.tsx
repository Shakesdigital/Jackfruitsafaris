import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export type HeroSectionProps = {
  /** Eyebrow text above the title (shown with optional icon) */
  eyebrow?: string;
  /** Main page title (h1) */
  title: string;
  /** Optional subtitle rendered as an h2 between the title and intro */
  subtitle?: string;
  /** Intro / body text */
  intro: string;
  /** Background image URL; when absent a solid dark background is used */
  backgroundImage?: string;
  /** Optional icon element for the eyebrow badge */
  icon?: ReactNode;
  /** Primary CTA */
  ctaPrimary?: { label: string; href: string };
  /** Secondary CTA */
  ctaSecondary?: { label: string; href: string };
  /** Optional aria-label for the section */
  ariaLabel?: string;
};

/**
 * Shared hero section component.
 *
 * Renders a headline, optional subtitle, intro text, dual CTA buttons, and a
 * full-width background image with a gradient overlay for readability.
 */
export function HeroSection({
  eyebrow,
  title,
  subtitle,
  intro,
  backgroundImage,
  icon,
  ctaPrimary,
  ctaSecondary,
  ariaLabel,
}: HeroSectionProps) {
  const hasImage = Boolean(backgroundImage);

  return (
    <section
      className="relative hero-h-responsive bg-cover bg-center text-white"
      style={
        hasImage ? { backgroundImage: `url(${backgroundImage})` } : undefined
      }
      aria-label={ariaLabel}
    >
      {hasImage ? (
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#08170f]/55 via-[#08170f]/45 to-[#08170f]/35"
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--foreground)]" aria-hidden="true" />
      )}
      <div className="relative container-responsive flex min-h-[inherit] items-center py-8 sm:py-10 md:py-14 lg:py-16">
        <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          {eyebrow && (
            <p className="inline-flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              {icon}
              {eyebrow}
            </p>
          )}
          <h1 className="mt-4 text-fluid-5xl font-black leading-fluid-tight sm:mt-5 sm:text-fluid-6xl md:text-fluid-7xl">
            {title}
          </h1>
          {subtitle && (
            <h2 className="mt-3 text-fluid-4xl font-extrabold leading-fluid-tight text-white/95 sm:text-fluid-5xl">
              {subtitle}
            </h2>
          )}
          <p className="mt-4 max-w-md text-fluid-lg leading-fluid-relaxed text-white/84 sm:max-w-xl sm:mt-5 sm:text-fluid-xl">
            {intro}
          </p>

          {/* Dual CTAs */}
          {ctaPrimary && ctaSecondary && (
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:gap-4">
              <Link
                href={ctaPrimary.href}
                className="btn-h-responsive inline-flex items-center justify-center rounded-full bg-[var(--brand-accent)] px-5 py-2.5 text-fluid-sm font-black text-[var(--foreground)] transition hover:bg-[#e5ad17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] sm:px-6"
              >
                {ctaPrimary.label}
              </Link>
              <Link
                href={ctaSecondary.href}
                className="btn-h-responsive inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-fluid-sm font-black text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] sm:px-6"
              >
                {ctaSecondary.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
