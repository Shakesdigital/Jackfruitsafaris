import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";

export type QuickLink = {
  label: string;
  href: string;
};

export type HeroSectionProps = {
  /** Eyebrow text above the title (shown with optional icon) */
  eyebrow?: string;
  /** Badge pill text displayed above the headline */
  badgeText?: string;
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
  /** Quick links shown below the CTAs */
  quickLinks?: QuickLink[];
  /** Optional aria-label for the section */
  ariaLabel?: string;
};

const defaultQuickLinks: QuickLink[] = [
  { label: "Gorilla Trekking", href: "/experiences/gorilla-trekking" },
  { label: "Murchison Falls", href: "/safaris/3-days-murchison-falls" },
  { label: "10 Days Uganda", href: "/safaris/10-days-uganda-safari" },
  { label: "Jinja Activities", href: "/experiences/jinja-adventures" },
  { label: "Airport Transfer", href: "/transport/airport-transfers" },
];

/**
 * Shared hero section component.
 *
 * Mirrors the home page hero structure exactly — badge pill, dual CTA buttons,
 * quick links, content max-width, and gradient overlay — so every landing page
 * renders the same wording layout structure.
 */
export function HeroSection({
  eyebrow,
  badgeText,
  title,
  subtitle,
  intro,
  backgroundImage,
  icon,
  ctaPrimary,
  ctaSecondary,
  quickLinks = defaultQuickLinks,
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
          {badgeText && (
            <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-fluid-sm font-black uppercase tracking-[0.2em] text-[var(--brand-accent)] ring-1 ring-white/20 sm:px-4 sm:py-2">
              <BadgeCheck size={15} aria-hidden="true" />
              {badgeText}
            </p>
          )}
          {eyebrow && !badgeText && (
            <p className="mt-2 inline-flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
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

          {/* Quick links pills */}
          {quickLinks && quickLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5 sm:mt-7 sm:gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full bg-white/12 px-3 py-1.5 text-fluid-xs font-bold text-white ring-1 ring-white/18 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] sm:px-4 sm:py-2 sm:text-fluid-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
