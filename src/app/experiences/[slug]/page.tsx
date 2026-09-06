import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SafariCard } from "@/components/safari-card";
import { Section } from "@/components/section";
import { HeroSection } from "@/components/hero-section";
import { ExperienceGallery } from "@/components/experience-gallery";
import {
  getExperienceBySlug,
  getGalleryMediaByExperience,
  getPublishedSafaris,
} from "@/lib/cms-data";
import type { GalleryMedia } from "@/components/experience-gallery";

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

type Experience = {
  slug: string;
  name: string;
  summary: string | null;
  featured_image_url: string | null;
  included: string[];
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    return {};
  }

  return {
    title: experience.meta_title || experience.name,
    description: experience.meta_description || experience.summary || "",
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  const galleryMedia = await getGalleryMediaByExperience(slug);

  const safaris = await getPublishedSafaris();
  const displaySafaris = safaris.slice(0, 2).map((s: { slug: string; title: string; duration?: string; summary?: string; price_from?: number; comfort_levels?: string[]; featured_image_url?: string }) => ({
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

  const bullets = experience.included || experience.bullets || [];

  return (
    <>
      <HeroSection
        title={experience.name}
        intro={experience.summary || ""}
        backgroundImage={experience.featured_image_url || undefined}
        ctaPrimary={{
          label: "Plan My Safari",
          href: "/request-quote",
        }}
        ctaSecondary={{
          label: "View All Safaris",
          href: "/safaris",
        }}
        ariaLabel={`${experience.name} - Experience details`}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <article className="space-y-10">
            <div className="grid gap-4 sm:grid-cols-2">
              {bullets.map((item: string) => (
                <p
                  key={item}
                  className="flex gap-3 rounded-[var(--brand-radius)] bg-[#eef7f0] p-4 text-fluid-sm font-bold leading-6 text-[var(--foreground)]"
                >
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
                  {item}
                </p>
              ))}
            </div>
            <div className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6">
              <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                How Jackfruit Safaris plans this
              </h2>
              <p className="mt-4 text-fluid-base leading-8 text-[var(--brand-muted-text)]">
                The team matches activities to your available time, transfer
                point, safety needs, and comfort level. Some experiences need
                live confirmation for weather, provider schedules, age limits,
                or park and permit rules.
              </p>
              <Link
                href="/request-quote"
                title="Add this experience to your safari trip"
                className="mt-5 btn-h-responsive inline-flex rounded-full bg-[var(--brand-primary)] px-5 py-3 text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Add this to my trip
              </Link>
            </div>
            <div>
              <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                Recommended safaris
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {displaySafaris.map((safari: Safari) => (
                  <SafariCard key={safari.slug} safari={safari} />
                ))}
              </div>
            </div>
          </article>
          <div className="space-y-8">
            <ExperienceGallery
              images={galleryMedia as GalleryMedia[]}
              experienceTitle={experience.name}
            />
            <QuoteForm sourcePage={experience.slug} defaultService={experience.name} />
          </div>
        </div>
      </Section>
    </>
  );
}