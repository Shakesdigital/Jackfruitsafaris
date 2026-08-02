import type { Metadata } from "next";
import Link from "next/link";
import { Award, Star } from "lucide-react";
import { Section } from "@/components/section";
import { testimonials as hardcodedTestimonials } from "@/lib/content";
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
  const gridSection = getPageSection(pageSections, "review_grid");
  const quoteCtaSection = getPageSection(pageSections, "quote_cta");

  // Use CMS data if available, otherwise fall back to hardcoded content
  const testimonials = reviews.length
    ? reviews.map((r: any) => ({
        guest_name: r.guest_name,
        trip_type: r.trip_type,
        quote: r.quote,
      }))
    : hardcodedTestimonials.map((t, i) => ({
        guest_name: t.name,
        trip_type: t.trip,
        quote: t.quote,
        id: i,
      }));

  return (
    <>
      <section
        className="relative hero-h-responsive bg-[var(--foreground)] bg-cover bg-center text-white"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
        aria-label="Guest reviews"
      >
        {hero?.background_image && <div className="absolute inset-0 bg-[var(--foreground)]/45" aria-hidden="true" />}
        <div className="relative container-responsive flex min-h-[inherit] items-center py-10 sm:py-16">
          <p className="inline-flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
            <Award size={18} aria-hidden="true" />
            {hero?.eyebrow || "Guest reviews"}
          </p>
          <h1 className="mt-4 text-fluid-4xl font-black leading-fluid-tight">
            {hero?.title || "Hear from travelers who explored Uganda with Jackfruit Safaris"}
          </h1>
          <p className="mt-5 max-w-3xl text-fluid-lg leading-fluid-relaxed text-white/76">
            {hero?.intro || "Review content imported only with permission or embedded according to review platform rules. The CMS includes permission and source fields for that reason."}
          </p>
        </div>
      </section>
      <Section
        eyebrow={gridSection?.subtitle || undefined}
        title={gridSection?.title || undefined}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((review: any, index: number) => (
            <article key={review.guest_name + index} className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6">
              <div className="flex gap-1 text-[var(--brand-accent)]" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-5 text-fluid-lg font-bold leading-8 text-[var(--foreground)]">
                "{review.quote}"
              </p>
              <p className="mt-5 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
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