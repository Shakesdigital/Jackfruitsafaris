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
        className="relative bg-[var(--foreground)] bg-cover bg-center py-16 text-white sm:py-20"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
      >
        {hero?.background_image && <div className="absolute inset-0 bg-[var(--foreground)]/82" />}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
            <Award size={18} />
            {hero?.eyebrow || "Guest reviews"}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {hero?.title || "Hear from travelers who explored Uganda with Jackfruit Safaris"}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
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
              <div className="flex gap-1 text-[var(--brand-accent)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-lg font-bold leading-8 text-[var(--foreground)]">
                &quot;{review.quote}&quot;
              </p>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                {review.trip_type}
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--brand-muted-text)]">
                {review.guest_name}
              </p>
            </article>
          ))}
        </div>
        <Link href={getSectionLink(quoteCtaSection, "href", "/request-quote")} className="mt-8 inline-flex rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-black text-white">
          {quoteCtaSection?.title || "Plan your trip"}
        </Link>
      </Section>
    </>
  );
}
