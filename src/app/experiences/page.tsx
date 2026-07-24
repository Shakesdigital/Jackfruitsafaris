import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/section";
import { experiences as hardcodedExperiences, iconMap } from "@/lib/content";
import { getPublishedExperiences, getPageHero, getSiteSettings } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  const [experiences, hero] = await Promise.all([
    getPublishedExperiences(),
    getPageHero("/experiences"),
  ]);

  // Use CMS data if available, otherwise fall back to hardcoded content
  const displayedExperiences = experiences.length
    ? experiences.map((e: any) => ({
        slug: e.slug,
        title: e.title,
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
      <section className="bg-[#10251b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
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
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {displayedExperiences.map((experience: any) => {
            const Icon = iconMap[experience.icon as keyof typeof iconMap] || ArrowRight;
            return (
              <Link
                key={experience.slug}
                href={`/experiences/${experience.slug}`}
                className="group overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm"
              >
                <div
                  className="h-64 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${experience.featured_image_url || experience.image || ""})` }}
                />
                <div className="p-6">
                  <Icon className="text-[#2d6f55]" size={26} />
                  <h2 className="mt-3 text-2xl font-black text-[#10251b]">
                    {experience.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#536154]">
                    {experience.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#143c2d]">
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