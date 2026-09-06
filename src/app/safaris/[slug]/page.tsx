import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  HelpCircle,
  MapPin,
  XCircle,
} from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { StickyQuoteCard } from "@/components/sticky-quote-card";
import { RelatedGallery } from "@/components/related-gallery";
import { FullWidthGallery } from "@/components/full-width-gallery";
import { ContentWithImage } from "@/components/content-with-image";
import { getSafariBySlug, getGalleryMediaBySafari } from "@/lib/cms-data";
import type { GalleryImage } from "@/components/related-gallery";
import type { HighlightWithImage, SafariPageSection, SafariDayWithImage } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const safari = await getSafariBySlug(slug);

  if (!safari) {
    return {};
  }

  return {
    title: safari.meta_title || safari.title,
    description: safari.meta_description || safari.summary,
  };
}

export default async function SafariDetailPage({ params }: Props) {
  const { slug } = await params;
  const safari = await getSafariBySlug(slug);
  const galleryImages = await getGalleryMediaBySafari(slug);

  if (!safari) {
    notFound();
  }

  // Transform CMS data to match frontend expectations
  // highlights: use highlights_content if present, fall back to highlights text[]
  const rawHighlightsContent = safari.highlights_content as HighlightWithImage[] | undefined;
  const highlightsTextArray = (safari.highlights || []) as string[];
  const highlightsWithImages: HighlightWithImage[] =
    rawHighlightsContent && rawHighlightsContent.length > 0
      ? rawHighlightsContent.map((h: HighlightWithImage) => ({
          text: h.text,
          image_url: h.image_url ?? null,
          image_alignment: h.image_alignment ?? null,
        }))
      : highlightsTextArray.map((h: string) => ({ text: h, image_url: null, image_alignment: null }));

  const displayData = {
    slug: safari.slug,
    title: safari.title,
    duration: safari.duration || "",
    route: safari.route || "",
    startEnd: safari.start_point || "",
    summary: safari.summary || "",
    price: safari.price_from
      ? `from USD ${safari.price_from.toLocaleString()} per person`
      : "quoted after dates and preferences",
    comfort: (safari.comfort_levels || []).join(", ") || "Budget to luxury",
    image: safari.featured_image_url || "",
    highlights: highlightsTextArray,
    highlightsWithImages,
    itinerary: (safari.itinerary || []) as SafariDayWithImage[],
    pageSections: (safari.page_sections || []) as SafariPageSection[],
    accommodations: safari.accommodation_options || [],
    included: safari.included || [],
    excluded: safari.excluded || [],
    faqs: safari.faq || [],
    seoTitle: safari.meta_title || safari.title,
    seoDescription: safari.meta_description || safari.summary,
    note: safari.permit_rate_warning,
  };

  return (
    <>
      <HeroSection
        title={displayData.title}
        intro={displayData.summary}
        backgroundImage={displayData.image}
        ctaPrimary={{
          label: "Plan My Safari",
          href: "/request-quote",
        }}
        ctaSecondary={{
          label: "View All Safaris",
          href: "/safaris",
        }}
        ariaLabel={`${displayData.title} - Safari details`}
      />

      <section className="border-y border-black/10 bg-white py-5 sm:py-6">
        <div className="container-responsive grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[
            ["Duration", displayData.duration],
            ["Route", displayData.route],
            ["Comfort", displayData.comfort],
            ["Price", displayData.price],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[var(--brand-radius)] bg-[var(--background)] p-4 sm:p-5">
              <p className="text-fluid-xs font-black uppercase tracking-[0.14em] text-[var(--brand-secondary)]">
                {label}
              </p>
              <p className="mt-2 text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <article className="space-y-12">
            <div>
              <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                <MapPin size={17} aria-hidden="true" />
                Route logic
              </p>
              <h2 className="mt-3 text-fluid-3xl font-black text-[var(--foreground)]">
                {displayData.startEnd}
              </h2>
              <p className="mt-4 text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">
                {displayData.summary}
              </p>
            </div>

            <div>
              <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                Highlights
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {displayData.highlightsWithImages.map((highlight: HighlightWithImage, idx: number) => (
                  <div
                    key={highlight.text || idx}
                    className="flex gap-3 rounded-[var(--brand-radius)] bg-[#eef7f0] p-4 text-fluid-sm font-bold leading-6 text-[var(--foreground)]"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
                    <ContentWithImage
                      body={highlight.text}
                      imageUrl={highlight.image_url}
                      alignment={highlight.image_alignment}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                <CalendarDays size={17} aria-hidden="true" />
                Day by day
              </p>
              <div className="mt-6 space-y-4">
                {displayData.itinerary.map((day: SafariDayWithImage) => (
                  <div
                    key={`${day.day}-${day.title}`}
                    className="space-y-3 rounded-[var(--brand-radius)] border border-black/10 bg-white p-4 sm:p-5"
                  >
                    <p className="text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                      {day.day}
                    </p>
                    <h3 className="mt-2 text-fluid-xl font-black text-[var(--foreground)]">
                      {day.title}
                    </h3>
                    <div className="mt-3">
                      <ContentWithImage
                        body={day.body || ""}
                        imageUrl={day.image_url}
                        alignment={day.image_alignment}
                        altText={day.title}
                      />
                    </div>
                    <p className="mt-3 text-fluid-sm font-bold text-[var(--foreground)]">
                      Meal plan: {day.meals}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                <BadgeDollarSign size={17} aria-hidden="true" />
                Price guidance
              </p>
              <h2 className="mt-3 text-fluid-3xl font-black text-[var(--foreground)]">
                {displayData.price}
              </h2>
              <p className="mt-3 text-fluid-base leading-8 text-[var(--brand-muted-text)]">
                Prices are quoted as &ldquo;from&rdquo; guidance because permits, lodge
                category, season, group size, and vehicle logistics affect the
                final cost.
              </p>
              {displayData.note && (
                <p className="mt-4 rounded-[var(--brand-radius)] bg-[#fff7d7] p-4 text-fluid-sm font-bold leading-6 text-[#5c4a11]">
                  {displayData.note}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  Included
                </h2>
                <div className="mt-4 grid gap-3">
                  {displayData.included.map((item: string) => (
                    <p key={item} className="flex gap-3 text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  Excluded
                </h2>
                <div className="mt-4 grid gap-3">
                  {displayData.excluded.map((item: string) => (
                    <p key={item} className="flex gap-3 text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                      <XCircle className="mt-0.5 shrink-0 text-[#a04b36]" size={18} aria-hidden="true" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                Accommodation options
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {displayData.accommodations.map((item: { tier: string; options: string }) => (
                  <div
                    key={item.tier}
                    className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5"
                  >
                    <p className="text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                      {item.tier}
                    </p>
                    <p className="mt-3 text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                      {item.options}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {displayData.pageSections.length > 0 &&
              displayData.pageSections.map((section: SafariPageSection, idx: number) => (
                <Section
                  key={section.key || idx}
                  title={section.title || undefined}
                >
                  <ContentWithImage
                    body={section.body || ""}
                    imageUrl={section.image_url}
                    alignment={section.image_alignment}
                    altText={section.title || section.key || ""}
                  />
                </Section>
              ))}

            <div>
              <h2 className="flex items-center gap-2 text-fluid-3xl font-black text-[var(--foreground)]">
                <HelpCircle size={24} aria-hidden="true" />
                FAQs
              </h2>
              <div className="mt-5 grid gap-3">
                {displayData.faqs.map((faq: { question: string; answer: string }) => (
                  <details
                    key={faq.question}
                    className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5"
                  >
                    <summary className="cursor-pointer text-fluid-lg font-black text-[var(--foreground)]">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--brand-radius)] bg-[var(--brand-primary)] p-6 text-white">
              <h2 className="text-fluid-2xl font-black">Want this adjusted?</h2>
              <p className="mt-3 text-fluid-sm leading-7 text-white/76">
                Jackfruit Safaris can change the start point, lodge tier,
                pacing, activity mix, and final night based on flight timing or
                traveler energy.
              </p>
              <Link
                href="/request-quote"
                title="Request a custom safari quote for this itinerary"
                className="mt-5 btn-h-responsive inline-flex rounded-full bg-[var(--brand-accent)] px-5 py-3 text-fluid-sm font-black text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Customize this itinerary
              </Link>
            </div>
          </article>
          <div className="space-y-8">
            <RelatedGallery
              images={galleryImages as GalleryImage[]}
              safariTitle={displayData.title}
            />
            <StickyQuoteCard sourcePage={displayData.slug} defaultService={displayData.title} />
          </div>
        </div>
      </Section>
      <FullWidthGallery
        images={galleryImages as GalleryImage[]}
        title="Related safari photo gallery"
      />
    </>
  );
}