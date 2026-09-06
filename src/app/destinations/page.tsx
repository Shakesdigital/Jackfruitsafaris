import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { destinations as hardcodedDestinations, pageHeroFallbacks } from "@/lib/content";
import {
  getPublishedDestinations,
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import { getPageSection, getSectionText } from "@/lib/cms-page-content";

type Destination = {
  slug: string;
  name: string;
  region: string | null;
  featured_image_url: string | null;
  overview: string | null;
  summary: string | null;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uganda Safari Destinations | Jackfruit Safaris",
  description:
    "Explore Uganda's premier adventure destinations including Bwindi Impenetrable National Park, Murchison Falls, Queen Elizabeth, Kibale Forest, Lake Mburo, Lake Bunyonyi, and Jinja at the source of the Nile.",
};

export default async function DestinationsPage() {
  const [destinations, hero, pageSections] = await Promise.all([
    getPublishedDestinations(),
    getPageHero("/destinations"),
    getPublishedPageContentSections("/destinations"),
  ]);
  const fallback = pageHeroFallbacks["/destinations"];
  const gridSection = getPageSection(pageSections, "destination_grid");
  const introSection = getPageSection(pageSections, "destination_intro");

  // Use CMS data if available, otherwise fall back to hardcoded content
  const displayedDestinations = destinations.length
    ? destinations.map((d: any) => ({
        slug: d.slug,
        name: d.name,
        region: d.region,
        featured_image_url: d.featured_image_url || hardcodedDestinations.find(hd => hd.slug === d.slug)?.image || "",
        overview: d.overview || d.summary,
      }))
    : hardcodedDestinations.map((d) => ({
      slug: d.slug,
      name: d.name,
      region: d.region,
      featured_image_url: d.image,
      overview: d.overview || d.summary,
    }));

  const introText = getSectionText(
    introSection,
    "intro",
    "Each destination below is chosen for its distinct wildlife, landscape, or adventure — from mountain gorillas in misty Bwindi to the roaring cataract of Murchison Falls, from chimpanzee tracking in Kibale to highland canoeing on Lake Bunyonyi, and the adventure capital of Jinja at the source of the Nile. Jackfruit Safaris plans the routes, timing, and logistics so you can focus on the experience.",
  );

  return (
    <>
      <HeroSection
        title={hero?.title || fallback?.title || "Uganda Safari Places"}
        subtitle={hero?.subtitle || fallback?.subtitle || "Routed With Care"}
        intro={hero?.intro || fallback?.intro || "Destination pages give travelers the practical why go, best time, recommended nights, and related route context they need before requesting a quote."}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        ariaLabel="Uganda safari destinations"
      />

      <Section
        eyebrow={gridSection?.subtitle || undefined}
        title={getSectionText(gridSection, "fallback_title", "Uganda's premier adventure destinations")}
        intro={
          <p className="max-w-3xl text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">
            {introText}
          </p>
        }
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedDestinations.map((destination: any) => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              title="View destination details"
              className="group overflow-hidden rounded-[var(--brand-radius)] border border-black/10 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            >
              <div
                className="img-h-md bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${destination.featured_image_url || ""})` }}
                aria-hidden="true"
              />
              <div className="p-5 sm:p-6">
                <p className="flex items-center gap-2 text-fluid-xs font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                  <Map size={15} aria-hidden="true" />
                  {destination.region}
                </p>
                <h2 className="mt-3 text-fluid-xl font-black text-[var(--foreground)]">
                  {destination.name}
                </h2>
                <p className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]">
                  {destination.overview}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-fluid-sm font-black text-[var(--brand-primary)]">
                  View destination
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
