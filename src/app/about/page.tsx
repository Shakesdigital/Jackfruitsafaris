import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Heart, Map, Sprout, Users } from "lucide-react";
import { CmsRichText } from "@/components/cms-rich-text";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import {
  pageHeroFallbacks,
  teamMembers,
} from "@/lib/content";
import { getPageHero, getPublishedPageContentSections, getPublishedTeamMembers } from "@/lib/cms-data";
import {
  getPageSection,
  getSectionLink,
  getSectionObjectList,
  getSectionText,
  getSectionStringList,
} from "@/lib/cms-page-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "About Jackfruit Safaris — Local Roots, Practical Planning",
  description:
    "Jackfruit Safaris is a registered Ugandan tour company born from a simple idea: tourism should support the communities that call Uganda home. Founded by Elvis, a former orphan from Jinja, every safari helps orphaned and vulnerable children through education, healthcare, and community programs.",
};

type TeamMember = {
  slug: string;
  name: string;
  position: string;
  bio?: string | null;
  photo_url?: string | null;
  email?: string | null;
  phone?: string | null;
};

export default async function AboutPage() {
  const [hero, pageSections, cmsTeamMembers] = await Promise.all([
    getPageHero("/about"),
    getPublishedPageContentSections("/about"),
    getPublishedTeamMembers(),
  ]);

  const fallback = pageHeroFallbacks["/about"];

  // ---- Section lookups -------------------------------------------------
  const introCardsSection = getPageSection(pageSections, "intro_cards");
  const whatMakesUniqueSection = getPageSection(pageSections, "what_makes_unique");
  const staffIntroSection = getPageSection(pageSections, "staff_intro");
  const planningSection = getPageSection(pageSections, "planning_safari");

  // ---- Hero content (content JSONB on page_heroes) ---------------------
  const heroContent =
    (hero?.content as Record<string, string> | undefined) ??
    fallback?.content ??
    {};

  // ---- Intro cards (3 cards: name, where operates, giving journey) -----
  const defaultAboutContent = [
    {
      icon: "sprout",
      title: "Why the name Jackfruit",
      body:
        "The jackfruit is common and beloved across Uganda. It symbolises local abundance, generosity, and the everyday discoveries that authentic travel is made of.",
    },
    {
      icon: "map",
      title: "Where we operate",
      body:
        "From Jinja, we run private safaris across Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Lake Mburo, Lake Bunyonyi, and the Nile — plus custom routes for your dates and interests.",
    },
    {
      icon: "heart",
      title: "Our giving journey",
      body:
        "Jackfruit Safaris was founded so that travel could give back. A portion of every safari supports orphaned and vulnerable children across Uganda through education, healthcare, and community-led programs.",
    },
  ];

  const aboutContent = getSectionObjectList(
    introCardsSection,
    "items",
    defaultAboutContent,
  ).map((item, index) => ({
    icon: typeof item.icon === "string" ? item.icon : defaultAboutContent[index]?.icon,
    title:
      typeof item.title === "string"
        ? item.title
        : defaultAboutContent[index]?.title || "",
    body:
      typeof item.body === "string"
        ? item.body
        : defaultAboutContent[index]?.body || "",
  }));

  // ---- "What makes Jackfruit Safaris unique" (replaces services_grid) ---
  const defaultUniqueItems = [
    "Client-first satisfaction — we listen, adapt, and follow up before, during, and after your safari.",
    "Fully custom routes built around your dates, pace, budget, and interests — not a one-size-fits-all itinerary.",
    "Travel with purpose — every booking helps orphaned and vulnerable children in Uganda through direct reinvestment from safari profits.",
  ];

  const uniqueItems = getSectionStringList(
    whatMakesUniqueSection,
    "items",
    defaultUniqueItems,
  );
  const uniqueIntro = getSectionText(
    whatMakesUniqueSection,
    "intro",
    "Every Jackfruit Safari is designed around you — your dates, pace, budget, and interests. What sets us apart is how we plan, how we guide, and how we give back.",
  );

  // ---- Staff data ------------------------------------------------------
  const staffToDisplay = (cmsTeamMembers && cmsTeamMembers.length > 0
    ? cmsTeamMembers
    : teamMembers
  ) as TeamMember[];

  const staffHeading = staffIntroSection?.title || "Staff at Jackfruit Safaris";
  const staffEyebrow = staffIntroSection?.subtitle || "Our team";
  const staffDescription = getSectionText(
    staffIntroSection,
    "intro",
    "Our team are Ugandan locals who know these parks, roads, and communities personally. From founder Elvis's guiding philosophy to our drivers' safety expertise, every role is rooted in authentic experience and guest care.",
  );
  const staffCtaLabel = getSectionText(
    staffIntroSection,
    "cta_label",
    "Plan a safari with our team",
  );
  const staffCtaHref = getSectionLink(staffIntroSection, "cta_href", "/request-quote");

  // ---- Planning the safari ----------------------------------------------
  const defaultPlanningItems = [
    "Share your travel details — dates, group size, budget, and must-do experiences.",
    "We recommend a realistic route, lodge level, and activity plan with price guidance.",
    "Once the plan feels right, we check live availability for permits and lodges, then confirm before payment.",
  ];

  const planningItems = getSectionStringList(
    planningSection,
    "items",
    defaultPlanningItems,
  );
  const planningIntro = getSectionText(
    planningSection,
    "intro",
    "Planning a Uganda safari doesn't have to feel overwhelming. We keep it simple and transparent — from your first message through the final confirmation.",
  );

  // Icon lookup for intro cards
  const iconMap: Record<string, typeof BadgeCheck> = {
    sprout: Sprout,
    map: Map,
    heart: Heart,
  };

  return (
    <>
      {/* Hero */}
      <HeroSection
        title={hero?.title || fallback?.title || "Local Roots, Practical Planning"}
        subtitle={hero?.subtitle || fallback?.subtitle || "Warm Guest Care"}
        intro={hero?.intro || fallback?.intro || ""}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        icon={<BadgeCheck size={18} aria-hidden="true" />}
        ctaPrimary={{
          label: hero?.cta_primary || fallback?.ctaPrimary?.label || "Plan My Safari",
          href: hero?.cta_primary_href || fallback?.ctaPrimary?.href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || fallback?.ctaSecondary?.label || "View Safari Packages",
          href: hero?.cta_secondary_href || fallback?.ctaSecondary?.href || "/safaris",
        }}
        ariaLabel="About Jackfruit Safaris"
      />

      {/* Founder's story / brief intro — rendered from page_heroes.content.intro_body */}
      <Section introImage={hero?.intro_image || fallback?.introImage}>
        <CmsRichText
          className="prose prose-lg max-w-3xl text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]"
          html={heroContent.intro_body || fallback?.content?.intro_body || ""}
        />
      </Section>

      {/* Intro cards: name, where operates, giving journey */}
      <Section
        eyebrow={introCardsSection?.subtitle || undefined}
        title={introCardsSection?.title || undefined}
      >
        <div className="grid gap-8 lg:grid-cols-3">
          {aboutContent.map((item) => {
            const IconComponent = iconMap[item.icon] || BadgeCheck;
            return (
              <article
                key={item.title}
                className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6"
              >
                <IconComponent
                  className="text-[var(--brand-secondary)]"
                  size={26}
                  aria-hidden="true"
                />
                <h2 className="mt-4 text-fluid-xl font-black text-[var(--foreground)]">
                  {item.title}
                </h2>
                <CmsRichText
                  className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]"
                  html={item.body}
                />
              </article>
            );
          })}
        </div>
      </Section>

      {/* What makes Jackfruit Safaris unique */}
      <Section
        className="bg-[#eef3eb]"
        eyebrow={
          whatMakesUniqueSection?.subtitle ||
          "What makes Jackfruit Safaris unique"
        }
        title={
          whatMakesUniqueSection?.title ||
          "Satisfaction, custom routes, and a cause worth traveling for"
        }
        intro={<CmsRichText html={uniqueIntro} />}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {uniqueItems.map((item) => (
            <p
              key={item}
              className="flex items-start gap-3 rounded-[var(--brand-radius)] bg-white p-4 text-fluid-sm font-black text-[var(--foreground)]"
            >
              <BadgeCheck
                className="shrink-0 text-[var(--brand-secondary)]"
                size={18}
                aria-hidden="true"
              />
              <span>{item}</span>
            </p>
          ))}
        </div>
        <Link
          href={getSectionLink(
            whatMakesUniqueSection,
            "cta_href",
            "/request-quote",
          )}
          className="mt-8 btn-h-responsive inline-flex rounded-full bg-[var(--brand-primary)] px-6 py-3 text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        >
          {getSectionText(whatMakesUniqueSection, "cta_label", "Plan your safari")}
        </Link>
      </Section>

      {/* Staff at Jackfruit Safaris */}
      <Section
        eyebrow={staffEyebrow}
        title={staffHeading}
        intro={
          <CmsRichText
            className="text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]"
            html={staffDescription}
          />
        }
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {staffToDisplay.map((member) => (
            <article
              key={member.slug}
              className="group rounded-[var(--brand-radius)] border border-black/10 bg-white p-6 text-center transition-shadow hover:shadow-lg"
            >
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-2 ring-black/10"
                  loading="lazy"
                  decoding="async"
                  sizes="96px"
                />
              ) : (
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                  <Users size={32} />
                </div>
              )}
              <h3 className="text-fluid-lg font-black text-[var(--foreground)]">
                {member.name}
              </h3>
              <p className="mt-1 text-fluid-sm font-bold text-[var(--brand-secondary)]">
                {member.position}
              </p>
              {member.bio && (
                <CmsRichText
                  className="mt-3 text-fluid-xs leading-6 text-[var(--brand-muted-text)]"
                  html={member.bio}
                />
              )}
              {member.email && (
                <p className="mt-2 text-fluid-xs text-[var(--brand-muted-text)]">
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:text-[var(--brand-primary)]"
                  >
                    {member.email}
                  </a>
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={staffCtaHref}
            className="btn-h-responsive inline-flex items-center justify-center rounded-full bg-[var(--brand-accent)] px-6 text-fluid-sm font-black text-[var(--foreground)] transition hover:bg-[#e5ad17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            {staffCtaLabel}
          </Link>
        </div>
      </Section>

      {/* Planning the safari with Jackfruit */}
      <Section
        className="bg-[#eef3eb]"
        eyebrow={planningSection?.subtitle || "Three simple steps"}
        title={planningSection?.title || "Planning the safari with Jackfruit"}
        intro={<CmsRichText html={planningIntro} />}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {planningItems.map((item, index) => (
            <div
              key={item}
              className="flex items-start gap-4 rounded-[var(--brand-radius)] bg-white p-6"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-secondary)] text-white text-fluid-sm font-black">
                {index + 1}
              </span>
              <p className="text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/request-quote"
            className="btn-h-responsive inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-6 py-3 text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Start planning
          </Link>
        </div>
      </Section>
    </>
  );
}
