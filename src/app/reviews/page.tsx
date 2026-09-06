import type { Metadata } from "next";
import Link from "next/link";
import { Star, UserCircle2 as UserCircle } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { testimonials as hardcodedTestimonials, pageHeroFallbacks } from "@/lib/content";
import {
  getPublishedReviews,
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import {
  getPageSection,
  getSectionLink,
} from "@/lib/cms-page-content";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [reviews, hero, pageSections] = await Promise.all([
    getPublishedReviews(),
    getPageHero("/reviews"),
    getPublishedPageContentSections("/reviews"),
  ]);
  const fallback = pageHeroFallbacks["/reviews"];
  const gridSection = getPageSection(pageSections, "review_grid");
  const quoteCtaSection = getPageSection(pageSections, "quote_cta");

  // Use CMS data if available, otherwise fall back to hardcoded content
  const testimonials = reviews.length
    ? reviews.map((r: any) => ({
        guest_name: r.guest_name,
        trip_type: r.trip_type,
        quote: r.quote,
        image_url: r.image_url,
      }))
    : hardcodedTestimonials.map((t) => ({
        guest_name: t.name,
        trip_type: t.trip,
        quote: t.quote,
        image_url: undefined,
      }));

  return (
    <>
      <HeroSection
        title={hero?.title || fallback?.title || "Hear From Travelers"}
        subtitle={hero?.subtitle || fallback?.subtitle || "Who Explored Uganda With Jackfruit Safaris"}
        intro={hero?.intro || fallback?.intro || "Review content imported only with permission or embedded according to review platform rules. The CMS includes permission and source fields for that reason."}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        ariaLabel="Guest reviews"
      />
      <Section
        eyebrow={gridSection?.subtitle || undefined}
        title={gridSection?.title || undefined}
      >
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map((review: any, index: number) => (
            <article key={review.guest_name + index} className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6">
              <div className="flex items-start gap-3">
                {review.image_url ? (
                  <img
                    src={review.image_url}
                    alt={review.guest_name}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="40px"
                  />
                ) : (
                  <UserCircle size={40} className="text-[var(--brand-muted-text)]" />
                )}
                <div className="flex gap-1 text-[var(--brand-accent)]" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-fluid-lg font-normal leading-8 text-[var(--foreground)]">
                "{review.quote}"
              </p>
              <p className="mt-4 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                {review.trip_type}
              </p>
              <p className="mt-1 text-fluid-sm font-bold text-[var(--brand-muted-text)]">
                {review.guest_name}
              </p>
            </article>
          ))}
        </div>
        <Link href={getSectionLink(quoteCtaSection, "href", "/request-quote")} className="mt-8 btn-h-responsive inline-flex rounded-full bg-[var(--brand-primary)] px-6 py-3 text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
          {quoteCtaSection?.title || "Plan your trip"}
        </Link>
      </Section>
    </>
  );
}