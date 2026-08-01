import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/section";
import { experiences as hardcodedExperiences, iconMap } from "@/lib/content";
import {
  getPublishedExperiences,
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import { getPageSection } from "@/lib/cms-page-content";

export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  const [experiences, hero, pageSections] = await Promise.all([
    getPublishedExperiences(),
    getPageHero("/experiences"),
    getPublishedPageContentSections("/experiences"),
  ]);
  const gridSection = getPageSection(pageSections, "experience_grid");

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
      <section
        className="relative bg-[var(--foreground)] bg-cover bg-center py-16 text-white sm:py-20"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
      >
        {hero?.background_image && <div className="absolute inset-0 bg-[var(--foreground)]/65" />}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
            {hero?.eyebrow || "Experiences"}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {hero?.title || "Build your Uganda trip around the moments that matter"}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
            {hero?.intro || "Choose primates, wildlife, Nile adventure, cultural visits, or reliable transport, then ask Jackfruit Safaris to connect the pieces into a realistic itinerary."}
          </p>
        </div>
      </section>
      <Section
        eyebrow={gridSection?.subtitle || undefined}
        title={gridSection?.title || undefined}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {displayedExperiences.map((experience: any) => {
            const Icon = iconMap[experience.icon as keyof typeof iconMap] || ArrowRight;
            return (
              <Link
                key={experience.slug}
                href={`/experiences/${experience.slug}`}
                className="group overflow-hidden rounded-[var(--brand-radius)] border border-black/10 bg-white shadow-sm"
              >
                <div
                  className="h-64 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${experience.featured_image_url || experience.image || ""})` }}
                />
                <div className="p-6">
                  <Icon className="text-[var(--brand-secondary)]" size={26} />
                  <h2 className="mt-3 text-2xl font-black text-[var(--foreground)]">
                    {experience.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted-text)]">
                    {experience.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--brand-primary)]">
                    Explore experience
                    <ArrowRight size={16} />
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
