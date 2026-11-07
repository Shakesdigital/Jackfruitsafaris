import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MapPin, XCircle } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SafariCard } from "@/components/safari-card";
import { Section } from "@/components/section";
import { HeroSection } from "@/components/hero-section";
import { CmsRichText } from "@/components/cms-rich-text";
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
  description: string | null;
  duration: string | null;
  price_from: number | null;
  featured_image_url: string | null;
  included: string[];
  excluded: string[];
  safety_notes: string | null;
  cta_label: string | null;
  cta_url: string | null;
  category: string | null;
  location: string | null;
  wildlife: string | null;
};

/** Returns a contextual "what to expect" description based on the experience slug. */
function getExperienceExpectations(slug: string): string {
  const expectations: Record<string, string> = {
    "gorilla-trekking":
      "<p>Mountain gorilla trekking is a physically demanding but profoundly rewarding experience. Treks typically last 2–6 hours depending on the gorilla family's location. You'll be guided by experienced Uganda Wildlife Authority rangers and local trackers. Once the gorillas are located, you spend up to one hour observing them in their natural habitat. Jackfruit Safaris provides fitness preparation tips, packing guidance, and sector-aware lodge planning to make your encounter seamless.</p>",
    "jinja-adventures":
      "<p>Jinja adventures offer a range of adrenaline-pumping activities on the Nile. White-water rafting trips run from half-day to full-day excursions through Class III–V rapids. Quad biking, cycling, horseback riding, and the famous Source of the Nile boat tour are also available. All activities are led by certified local operators with full safety equipment. Morning departures are typical, with transport arrangements from Kampala, Entebbe, or your safari lodge.</p>",
    "cultural-experiences":
      "<p>Cultural experiences in Uganda connect you with local communities through authentic, respectful encounters. Activities include village walks, traditional cooking sessions, craft workshops, music and dance performances, and storytelling with local elders. Visits are community-led and contribute directly to local income. Jackfruit Safaris ensures all interactions follow ethical tourism principles and benefit the communities directly.</p>",
    "wildlife-safaris":
      "<p>Uganda's wildlife safaris span from the savannah of Murchison Falls to the misty forests of Bwindi. Morning game drives offer the best wildlife viewing, while afternoon boat safaris provide unique perspectives along rivers and lakes. Rhino tracking at Ziwa Sanctuary, chimpanzee tracking in Kibale, and forest walks in Lake Mburo showcase Uganda's incredible biodiversity. Private 4x4 vehicles with pop-up roofs ensure optimal wildlife photography and comfort.</p>",
  };
  return expectations[slug] || "<p>Jackfruit Safaris matches activities to your available time, transfer point, safety needs, and comfort level. Our local guides provide on-ground expertise and ensure you have a safe, memorable experience.</p>";
}

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

  const includedItems = experience.included || experience.bullets || [];
  const excludedItems = experience.excluded || [];

  const ctaLabel = experience.cta_label || "Plan My Safari";
  const ctaHref = experience.cta_url || "/request-quote";

  return (
    <>
      <HeroSection
        title={experience.name}
        intro={experience.summary || ""}
        backgroundImage={experience.featured_image_url || undefined}
        ctaPrimary={{
          label: ctaLabel,
          href: ctaHref,
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
            {(experience.duration || experience.price_from) && (
              <div className="flex flex-wrap gap-4 text-fluid-sm font-bold">
                {experience.duration && (
                  <span className="inline-flex items-center gap-1 text-[var(--brand-secondary)]">
                    <span className="text-xs uppercase tracking-wider">Duration:</span>
                    {experience.duration}
                  </span>
                )}
                {experience.category && (
                  <span className="inline-flex items-center gap-1 text-[var(--brand-secondary)]">
                    <span className="text-xs uppercase tracking-wider">Category:</span>
                    {experience.category}
                  </span>
                )}
                {experience.location && (
                  <span className="inline-flex items-center gap-1 text-[var(--brand-secondary)]">
                    <MapPin size={16} aria-hidden="true" />
                    {experience.location}
                  </span>
                )}
                {experience.price_from && (
                  <span className="inline-flex items-center gap-1 text-[var(--brand-secondary)]">
                    <span className="text-xs uppercase tracking-wider">From:</span>
                    USD {experience.price_from.toLocaleString()} per person
                  </span>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {includedItems.map((item: string) => (
                <p
                  key={item}
                  className="flex gap-3 rounded-[var(--brand-radius)] bg-[#eef7f0] p-4 text-fluid-sm font-bold leading-6 text-[var(--foreground)]"
                >
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
                  {item}
                </p>
              ))}
            </div>

            {excludedItems.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-fluid-xl font-black text-[var(--foreground)]">
                  What's Not Included
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {excludedItems.map((item: string) => (
                    <p
                      key={item}
                      className="flex gap-3 rounded-[var(--brand-radius)] bg-gray-50 p-4 text-fluid-sm font-bold leading-6 text-[var(--brand-muted-text)]"
                    >
                      <XCircle className="mt-0.5 shrink-0 text-red-500" size={18} aria-hidden="true" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {experience.safety_notes && (
              <div className="rounded-[var(--brand-radius)] border border-amber-200 bg-amber-50 p-6">
                <h2 className="text-fluid-xl font-black text-[var(--foreground)]">
                  Safety Notes
                </h2>
                <p className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]">
                  {experience.safety_notes}
                </p>
              </div>
            )}

            {experience.description && (
              <div className="space-y-4">
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  About This Experience
                </h2>
                <p className="text-fluid-base leading-8 text-[var(--brand-muted-text)]">
                  {experience.description}
                </p>
              </div>
            )}

            {experience.location && (
              <div>
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  Where This Takes Place
                </h2>
                <div className="mt-4 rounded-[var(--brand-radius)] bg-[#eef7f0] p-5">
                  <p className="text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                    {experience.location}
                  </p>
                </div>
              </div>
            )}

            {experience.wildlife && (
              <div>
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  Wildlife & Highlights
                </h2>
                <CmsRichText
                  className="mt-4 text-fluid-base leading-8 text-[var(--brand-muted-text)]"
                  html={experience.wildlife}
                />
              </div>
            )}

            <div>
              <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                What to Expect
              </h2>
              <CmsRichText
                className="mt-4 text-fluid-base leading-8 text-[var(--brand-muted-text)]"
                html={getExperienceExpectations(experience.slug)}
              />
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
                href={ctaHref}
                title={ctaLabel}
                className="mt-5 btn-h-responsive inline-flex rounded-full bg-[var(--brand-primary)] px-5 py-3 text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                {ctaLabel === "Plan My Safari" ? "Add this to my trip" : ctaLabel}
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
