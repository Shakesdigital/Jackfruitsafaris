import type { Metadata } from "next";
import { ArrowRight, Map } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { SafariCard } from "@/components/safari-card";
import { safaris as hardcodedTours, pageHeroFallbacks, safariIntroFallback } from "@/lib/content";
import {
  getPublishedSafaris,
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import {
  getPageSection,
  getSectionText,
} from "@/lib/cms-page-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uganda Safari Tours | Jackfruit Safaris",
  description:
    "Explore Uganda's premier safari tours including gorilla trekking in Bwindi, wildlife safaris in Murchison Falls, cultural experiences, Nile adventures, and custom private packages.",
};

export default async function ToursPage() {
  const [cmsTours, hero, pageSections] = await Promise.all([
    getPublishedSafaris(),
    getPageHero("/tours"),
    getPublishedPageContentSections("/tours"),
  ]);
  const fallback = pageHeroFallbacks["/safaris"];

  // Use CMS data if available, otherwise fall back to hardcoded content
  let tours: any[] = [];

  if (cmsTours && cmsTours.length > 0) {
    tours = cmsTours.map((s: any) => {
      const hardcoded = hardcodedTours.find((hs) => hs.slug === s.slug);
      return {
        slug: s.slug,
        title: s.title,
        duration: s.duration || hardcoded?.duration || "",
        summary: s.summary || hardcoded?.summary || "",
        price: s.price_from
          ? `from USD ${s.price_from.toLocaleString()} per person`
          : hardcoded?.price || "quoted after dates and preferences",
        comfort: (s.comfort_levels || []).join(", ") || hardcoded?.comfort || "Budget to luxury",
        image: s.featured_image_url || s.image || hardcoded?.image || "",
      };
    });
  } else {
    tours = hardcodedTours.map((s) => ({
      slug: s.slug,
      title: s.title,
      duration: s.duration,
      summary: s.summary,
      price: s.price,
      comfort: s.comfort,
      image: s.image,
    }));
  }

  return (
    <>
      <HeroSection
        badgeText={hero?.badge_text || fallback?.badgeText}
        title={hero?.title || fallback?.title || "Choose Proven Route"}
        subtitle={hero?.subtitle || fallback?.subtitle || "Make It Yours"}
        intro={hero?.intro || fallback?.intro || safariIntroFallback.intro}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        quickLinks={hero?.quick_links || fallback?.quickLinks}
        ariaLabel="Safari tours"
      />

      <Section
        eyebrow={hero?.badge_text || fallback?.badgeText}
        title={hero?.title || fallback?.title || "Tour Packages We Curate"}
        intro={
          <p className="max-w-3xl text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">
            {hero?.intro ||
              fallback?.intro ||
              "Whether you have three days or two weeks, Jackfruit Safaris can help you experience Uganda's landscapes and wildlife as budget, mid-range, or luxury private trips."}
          </p>
        }
      >
        <div className="container-responsive grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour: any) => (
            <SafariCard
              key={tour.slug}
              safari={{
                slug: tour.slug,
                title: tour.title,
                duration: tour.duration,
                summary: tour.summary,
                price: tour.price,
                comfort: tour.comfort,
                image: tour.image,
              }}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
