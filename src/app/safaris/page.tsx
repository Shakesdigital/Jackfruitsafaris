import type { Metadata } from "next";
import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { CmsRichText } from "@/components/cms-rich-text";
import { SafariCard } from "@/components/safari-card";
import { Section } from "@/components/section";
import { safaris as hardcodedSafaris } from "@/lib/content";
import {
  getPublishedSafaris,
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import {
  getPageSection,
  getSectionLink,
  getSectionStringList,
  getSectionText,
} from "@/lib/cms-page-content";

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

export default async function SafarisPage() {
  const [cmsSafaris, hero, pageSections] = await Promise.all([
    getPublishedSafaris(),
    getPageHero("/safaris"),
    getPublishedPageContentSections("/safaris"),
  ]);
  const filtersSection = getPageSection(pageSections, "filters");
  const safariGridSection = getPageSection(pageSections, "safari_grid");
  const customPlanningSection = getPageSection(pageSections, "custom_planning");
  const quoteFormSection = getPageSection(pageSections, "quote_form");
  const filters = getSectionStringList(filtersSection, "filters", [
    "Duration: 1 day, 3 days, 4-7 days, 8-14 days, custom",
    "Interest: gorillas, wildlife, chimpanzees, culture, Nile adventure",
    "Comfort: budget, mid-range, luxury",
    "Start point: Entebbe, Kampala, Jinja",
  ]);

  // Use CMS data if available, otherwise fall back to hardcoded content
  let safaris: Safari[];

  if (cmsSafaris && cmsSafaris.length > 0) {
    safaris = cmsSafaris.map((s: any) => {
      // Find matching hardcoded safari for fallback values
      const hardcoded = hardcodedSafaris.find(hs => hs.slug === s.slug);
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
    // Use hardcoded safaris as fallback
    safaris = hardcodedSafaris.map((s) => ({
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
      <section
        className="relative bg-[var(--foreground)] bg-cover bg-center py-16 text-white sm:py-20"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
      >
        {hero?.background_image && <div className="absolute inset-0 bg-[var(--foreground)]/65" />}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
            {hero?.eyebrow || "Uganda safari packages"}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {hero?.title || "Choose a proven route, then make it yours"}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
            {hero?.intro || "Whether you have three days or two weeks, Jackfruit Safaris can help you experience Uganda's landscapes and wildlife as budget, mid-range, or luxury private trips."}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              {filters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[var(--foreground)]"
                >
                  <Filter size={15} />
                  {filter}
                </span>
              ))}
            </div>
            {safariGridSection || pageSections.length === 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {safaris.map((safari: Safari) => (
                  <SafariCard key={safari.slug} safari={safari} />
                ))}
              </div>
            ) : null}
          </div>
          <aside className="space-y-4">
            <div className="rounded-[var(--brand-radius)] bg-[#eef7f0] p-6">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                <SlidersHorizontal size={17} />
                {customPlanningSection?.subtitle || "Custom planning"}
              </p>
              <h2 className="mt-3 text-2xl font-black text-[var(--foreground)]">
                {customPlanningSection?.title || "Need a different route?"}
              </h2>
              <CmsRichText
                className="mt-3 text-sm leading-7 text-[var(--brand-muted-text)]"
                html={getSectionText(customPlanningSection, "body", "Share your dates, pace, budget, lodge style, and must-do activities. Jackfruit Safaris will match the route to your time and comfort level.")}
              />
              <Link
                href={getSectionLink(customPlanningSection, "button_href", "/safaris/custom-uganda-safari")}
                className="mt-5 inline-flex rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-black text-white"
              >
                {getSectionText(customPlanningSection, "button_label", "Build a custom safari")}
              </Link>
            </div>
            <QuoteForm
              sourcePage={getSectionText(quoteFormSection, "source_page", "safaris-index")}
              compact
            />
          </aside>
        </div>
      </Section>
    </>
  );
}
