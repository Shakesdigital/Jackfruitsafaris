import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { CmsRichText } from "@/components/cms-rich-text";
import { Section } from "@/components/section";
import { experiences as hardcodedExperiences, iconMap, pageHeroFallbacks, experienceIntroFallback } from "@/lib/content";
import {
  getPublishedExperiences,
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import { getPageSection, getSectionText } from "@/lib/cms-page-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uganda Experiences | Jackfruit Safaris",
  description:
    "Explore Uganda's diverse experiences: gorilla trekking, wildlife safaris, Nile rafting, cultural visits, and airport transfers. All experiences can be combined and adjusted by Jackfruit Safaris.",
};

export default async function ExperiencesPage() {
  const [experiences, hero, pageSections] = await Promise.all([
    getPublishedExperiences(),
    getPageHero("/experiences"),
    getPublishedPageContentSections("/experiences"),
  ]);
  const fallback = pageHeroFallbacks["/experiences"];
  const gridSection = getPageSection(pageSections, "experience_grid");
  const introSection = getPageSection(pageSections, "experience_intro");

  // Use CMS data if available, otherwise fall back to hardcoded content
  const displayedExperiences = experiences.length
    ? experiences.map((e: any) => ({
        slug: e.slug,
        title: e.name || e.title,
        icon: e.icon || hardcodedExperiences.find(h => h.slug === e.slug)?.icon || "star",
        featured_image_url: e.featured_image_url || e.image,
        summary: e.summary,
      }))
    : hardcodedExperiences.map((e) => ({
      slug: e.slug,
      title: e.title,
      icon: e.icon,
      image: e.image,
      summary: e.summary,
    }));

  return (
    <>
      <HeroSection
        title={hero?.title || fallback?.title || "Choose Your Experience"}
        subtitle={hero?.subtitle || fallback?.subtitle || "Make It Yours"}
        intro={hero?.intro || fallback?.intro || "Choose primates, wildlife, Nile adventure, cultural visits, or reliable transport, then ask Jackfruit Safaris to connect the pieces into a realistic itinerary."}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        ariaLabel="Uganda safari experiences"
      />

      {introSection ? (
        <Section
          eyebrow={introSection?.subtitle || undefined}
          title={introSection?.title || undefined}
          introImage={hero?.intro_image || fallback?.introImage}
        >
          <CmsRichText
            className="text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]"
            html={getSectionText(introSection, "intro", experienceIntroFallback.intro)}
          />
          <CmsRichText
            className="mt-4 text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]"
            html={getSectionText(introSection, "body", experienceIntroFallback.body)}
          />
        </Section>
      ) : (
        <Section
          eyebrow={experienceIntroFallback.subtitle}
          title={experienceIntroFallback.title}
          introImage={hero?.intro_image || fallback?.introImage}
        >
          <CmsRichText
            className="text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]"
            html={experienceIntroFallback.intro}
          />
          <CmsRichText
            className="mt-4 text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]"
            html={experienceIntroFallback.body}
          />
        </Section>
      )}

      <Section
        eyebrow={gridSection?.subtitle || undefined}
        title={gridSection?.title || undefined}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {displayedExperiences.map((experience: any) => {
            const Icon = iconMap[experience.icon as keyof typeof iconMap] || ArrowRight;
            return (
              <Link
                key={experience.slug}
                href={`/experiences/${experience.slug}`}
                title="Explore experience details"
                className="group overflow-hidden rounded-[var(--brand-radius)] border border-black/10 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                <div
                  className="img-h-lg bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${experience.featured_image_url || experience.image || ""})` }}
                  aria-hidden="true"
                />
                <div className="p-5 sm:p-6">
                  <Icon className="text-[var(--brand-secondary)]" size={26} aria-hidden="true" />
                  <h2 className="mt-3 text-fluid-xl font-black text-[var(--foreground)]">
                    {experience.title}
                  </h2>
                  <p className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]">
                    {experience.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-fluid-sm font-black text-[var(--brand-primary)]">
                    Explore experience
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
