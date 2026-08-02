import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SafariCard } from "@/components/safari-card";
import { Section } from "@/components/section";
import { getExperienceBySlug, getPublishedSafaris } from "@/lib/cms-data";

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
      <section
        className="relative hero-h-responsive bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${experience.featured_image_url || ""})` }}
        aria-label={`${experience.name} - Experience details`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/55 via-[#08170f]/45 to-[#08170f]/35" aria-hidden="true" />
        <div className="relative container-responsive flex min-h-[inherit] items-end py-10 sm:py-14">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              Uganda experience
            </p>
            <h1 className="mt-4 text-fluid-4xl font-black leading-fluid-tight">
              {experience.name}
            </h1>
            <p className="mt-5 max-w-3xl text-fluid-lg leading-fluid-relaxed text-white/82">
              {experience.summary}
            </p>
          </div>
        </div>
      </section>

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
          <QuoteForm sourcePage={experience.slug} defaultService={experience.name} />
        </div>
      </Section>
    </>
  );
}