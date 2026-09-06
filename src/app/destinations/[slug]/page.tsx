import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, MapPin, Sparkles } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { QuoteForm } from "@/components/quote-form";
import { Section } from "@/components/section";
import { SafariCard } from "@/components/safari-card";
import { Carousel } from "@/components/carousel";
import { DestinationHighlight } from "@/components/destination-highlight-card";
import {
  getDestinationBySlug,
  getPublishedSafaris,
  getSafarisByDestination,
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import { pageHeroFallbacks } from "@/lib/content";
import { getPageSection, getSectionText } from "@/lib/cms-page-content";

type Props = {
  params: Promise<{ slug: string }>;
};

type Safari = {
  slug: string;
  title: string;
  duration: string;
  summary: string;
  price: string;
  comfort: string;
  image: string;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return {};
  }

  return {
    title: `${destination.name} Safari Guide`,
    description: destination.overview || destination.summary || "",
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  // Fetch the page_heroes row for this destination detail page (CMS-editable
  // title/subtitle split, badge text, CTAs, quick links, background image).
  const heroSlug = `/destinations/${slug}`;
  const hero = await getPageHero(heroSlug);
  const heroFallback = (pageHeroFallbacks[heroSlug] ?? pageHeroFallbacks["/destinations"]) as {
    badgeText?: string;
    title: string;
    subtitle?: string;
    intro?: string;
    backgroundImage?: string;
    quickLinks?: Array<{ label: string; href: string }>;
  };

  // Fetch editable content sections for this destination detail page
  const pageSections = await getPublishedPageContentSections(heroSlug);

  // Fetch destination-specific safaris from CMS; fall back to all published
  // safaris if no destination-specific safaris are tagged.
  const cmsSafaris = await getSafarisByDestination(slug);
  const allSafaris = cmsSafaris.length
    ? cmsSafaris
    : await getPublishedSafaris();

  const displaySafaris = allSafaris.map((s: any) => ({
    slug: s.slug,
    title: s.title,
    duration: s.duration || "",
    summary: s.summary || "",
    price: s.price_from
      ? `from USD ${s.price_from.toLocaleString()} per person`
      : "quoted after dates and preferences",
    comfort: (s.comfort_levels || []).join(", ") || "Budget to luxury",
    image: s.featured_image_url || "",
  }));

  // Ensure arrays and objects have safe defaults
  const overview = destination.overview || destination.summary || "";
  const whyGo = Array.isArray(destination.why_go) ? destination.why_go : [];
  const howToGetThere = Array.isArray(destination.how_to_get_there)
    ? destination.how_to_get_there
    : [];
  const bestTime = destination.best_time || "";
  const recommendedNights = destination.recommended_nights || "";
  const keyHighlights = Array.isArray(destination.key_highlights)
    ? destination.key_highlights
    : [];

  // CMS-editable overview section for the destination detail page
  const overviewSection = getPageSection(pageSections, "destination_overview");
  const overviewTitle = getSectionText(overviewSection, "title", "Destination overview");
  const overviewBody = getSectionText(overviewSection, "intro", overview);

  return (
    <>
      <HeroSection
        badgeText={hero?.badge_text || destination.region || heroFallback?.badgeText}
        title={hero?.title || destination.name || heroFallback?.title}
        subtitle={hero?.subtitle || destination.region || heroFallback?.subtitle}
        intro={hero?.intro || destination.summary || heroFallback?.intro || ""}
        backgroundImage={hero?.background_image || destination.featured_image_url || heroFallback?.backgroundImage}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        quickLinks={hero?.quick_links || heroFallback?.quickLinks}
        ariaLabel={`${destination.name} - Destination details`}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <article className="space-y-10">
            {/* Destination Overview */}
            <div>
              <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                {overviewTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">
                {overviewBody}
              </p>
            </div>

            {/* Activity Cards (Why Go) */}
            {whyGo.length > 0 && (
              <div>
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  Why go here
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {whyGo.map((item: string) => (
                    <div
                      key={item}
                      className="rounded-[var(--brand-radius)] bg-[#eef7f0] p-5"
                    >
                      <Sparkles
                        className="text-[var(--brand-secondary)]"
                        size={22}
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-fluid-sm font-black text-[var(--foreground)]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Get There Cards */}
            {howToGetThere.length > 0 && (
              <div>
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  How to get there
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {howToGetThere.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin
                          className="mt-0.5 shrink-0 text-[var(--brand-secondary)]"
                          size={20}
                          aria-hidden="true"
                        />
                        <p className="text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                          {item}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best Time and Recommended Stay */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6">
                <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                  <CalendarCheck size={17} aria-hidden="true" />
                  Best time to visit
                </p>
                <p className="mt-4 text-fluid-base leading-8 text-[var(--brand-muted-text)]">
                  {bestTime}
                </p>
              </div>
              <div className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6">
                <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                  <MapPin size={17} aria-hidden="true" />
                  Recommended stay
                </p>
                <p className="mt-4 text-fluid-base leading-8 text-[var(--brand-muted-text)]">
                  {recommendedNights}
                </p>
              </div>
            </div>

            {/* Key Highlights with Images */}
            {keyHighlights.length > 0 && (
              <div>
                <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                  Key highlights
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {keyHighlights.map((highlight: any, index: number) => (
                    <DestinationHighlight
                      key={index}
                      highlight={{
                        title: highlight.title || "",
                        description: highlight.description || "",
                        image_url: highlight.image_url || "",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Related Safari Carousel */}
            {displaySafaris.length > 0 && (
              <div>
                <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                  Related Uganda safaris
                </h2>
                <div className="mt-6">
                  <Carousel desktopCount={2}>
                    {displaySafaris.map((safari: Safari) => (
                      <SafariCard
                        key={safari.slug}
                        safari={safari}
                      />
                    ))}
                  </Carousel>
                </div>
              </div>
            )}

            {/* Route Note */}
            <div className="rounded-[var(--brand-radius)] bg-[var(--brand-primary)] p-6 text-white">
              <h2 className="text-fluid-2xl font-black">Route note</h2>
              <p className="mt-3 text-fluid-sm leading-7 text-white/76">
                Uganda routing works best when park sectors, lodge locations,
                permit times, and drive days are planned together. Jackfruit
                Safaris will adjust the sequence before quoting.
              </p>
              <Link
                href="/request-quote"
                className="mt-5 btn-h-responsive inline-flex rounded-full bg-[var(--brand-accent)] px-5 py-3 text-fluid-sm font-black text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Match me with a route
              </Link>
            </div>
          </article>
          <QuoteForm sourcePage={destination.slug} defaultService="custom safari" />
        </div>
      </Section>
    </>
  );
}
