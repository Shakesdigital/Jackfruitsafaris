import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { CmsRichText } from "@/components/cms-rich-text";
import { Section } from "@/components/section";
import { cmsModels } from "@/lib/content";
import { getPageHero, getPublishedPageContentSections } from "@/lib/cms-data";
import {
  getPageSection,
  getSectionLink,
  getSectionObjectList,
  getSectionText,
} from "@/lib/cms-page-content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [hero, pageSections] = await Promise.all([
    getPageHero("/about"),
    getPublishedPageContentSections("/about"),
  ]);
  const introCardsSection = getPageSection(pageSections, "intro_cards");
  const servicesSection = getPageSection(pageSections, "services_grid");

  const defaultAboutContent = [
    {
      icon: "sprout",
      title: hero?.content?.why_jackfruit_title || "Why the name Jackfruit",
      body: hero?.content?.why_jackfruit_body || "The jackfruit is common and loved in Uganda. It reflects travel rooted in local life, generous experiences, and everyday discovery.",
    },
    {
      icon: "map",
      title: hero?.content?.where_operates_title || "Where the team operates",
      body: hero?.content?.where_operates_body || "Jinja, Entebbe, Kampala, Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Lake Mburo, Lake Bunyonyi, and custom routes.",
    },
    {
      icon: "heart",
      title: hero?.content?.guiding_style_title || "Guiding style",
      body: hero?.content?.guiding_style_body || "Personal, flexible, friendly, safe, and direct about what is included, what is optional, and what must be confirmed.",
    },
  ];
  const aboutContent = getSectionObjectList(
    introCardsSection,
    "items",
    defaultAboutContent,
  ).map((item, index) => ({
    icon: typeof item.icon === "string" ? item.icon : defaultAboutContent[index]?.icon,
    title: typeof item.title === "string" ? item.title : defaultAboutContent[index]?.title || "",
    body: typeof item.body === "string" ? item.body : defaultAboutContent[index]?.body || "",
  }));

  return (
    <>
      <section
        className="relative min-h-[86vh] bg-[var(--foreground)] bg-cover bg-center text-white"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
      >
        {hero?.background_image && <div className="absolute inset-0 bg-[var(--foreground)]/45" />}
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              {hero?.eyebrow || "About Jackfruit Safaris Uganda"}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              {hero?.title || "Local roots, practical planning, and warm guest care"}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
              {hero?.intro || "Jackfruit Safaris Uganda is a registered tour company based in Jinja, one of Uganda's most exciting travel hubs and the adventure capital of East Africa."}
            </p>
          </div>
        </div>
      </section>

      <Section
        eyebrow={introCardsSection?.subtitle || undefined}
        title={introCardsSection?.title || undefined}
      >
        <div className="grid gap-8 lg:grid-cols-3">
          {aboutContent.map((item) => (
            <article
              key={item.title}
              className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6"
            >
              <BadgeCheck className="text-[var(--brand-secondary)]" size={26} />
              <h2 className="mt-4 text-2xl font-black text-[var(--foreground)]">
                {item.title}
              </h2>
              <CmsRichText
                className="mt-3 text-sm leading-7 text-[var(--brand-muted-text)]"
                html={item.body}
              />
            </article>
          ))}
        </div>
      </Section>

      <Section
        className="bg-[#eef3eb]"
        eyebrow={servicesSection?.subtitle || "What Jackfruit organizes"}
        title={servicesSection?.title || hero?.content?.services_title || "Safari, adventure, culture, and logistics in one planning flow"}
        intro={<CmsRichText html={getSectionText(servicesSection, "intro", hero?.content?.services_intro || "The website is structured so staff can manage every front-end content area from a future Supabase CMS.")} />}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cmsModels.map((model) => (
            <p
              key={model}
              className="flex items-center gap-3 rounded-[var(--brand-radius)] bg-white p-4 text-sm font-black text-[var(--foreground)]"
            >
              <BadgeCheck className="shrink-0 text-[var(--brand-secondary)]" size={18} />
              {model}
            </p>
          ))}
        </div>
        <Link
          href={getSectionLink(servicesSection, "cta_href", "/request-quote")}
          className="mt-8 inline-flex rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-black text-white"
        >
          {getSectionText(servicesSection, "cta_label", "Plan your safari")}
        </Link>
      </Section>
    </>
  );
}
