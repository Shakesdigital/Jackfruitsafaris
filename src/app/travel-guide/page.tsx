import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, PenLine } from "lucide-react";
import { CmsRichText } from "@/components/cms-rich-text";
import { Section } from "@/components/section";
import {
  getHomepageGuideArticles,
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import {
  getPageSection,
  getSectionLink,
  getSectionStringList,
  getSectionText,
} from "@/lib/cms-page-content";

export const dynamic = "force-dynamic";

export default async function TravelGuidePage() {
  const [guideArticles, hero, pageSections] = await Promise.all([
    getHomepageGuideArticles(),
    getPageHero("/travel-guide"),
    getPublishedPageContentSections("/travel-guide"),
  ]);
  const gridSection = getPageSection(pageSections, "guide_topic_grid");
  const quoteCtaSection = getPageSection(pageSections, "quote_cta");

  // Default articles if none in CMS
  const defaultArticles = [
    "Best Time to Visit Uganda for Safari and Gorilla Trekking",
    "Gorilla Trekking Permit Guide",
    "What to Pack for a Uganda Safari",
    "How Many Days Do You Need in Uganda?",
    "Murchison Falls Safari Guide",
    "Jinja Adventure Guide",
  ];

  const articles = guideArticles.length
    ? guideArticles
    : getSectionStringList(
        gridSection,
        "fallback_articles",
        defaultArticles,
      );

  return (
    <>
      <section
        className="relative hero-h-responsive bg-[var(--foreground)] bg-cover bg-center text-white"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
        aria-label="Uganda safari travel guide"
      >
        {hero?.background_image && <div className="absolute inset-0 bg-[var(--foreground)]/45" aria-hidden="true" />}
        <div className="relative container-responsive flex min-h-[inherit] items-center py-10 sm:py-16">
          <p className="inline-flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
            <BookOpen size={18} aria-hidden="true" />
            {hero?.eyebrow || "Uganda safari travel guide"}
          </p>
          <h1 className="mt-4 text-fluid-4xl font-black leading-fluid-tight">
            {hero?.title || "Practical articles that answer booking questions"}
          </h1>
          <p className="mt-5 max-w-3xl text-fluid-lg leading-fluid-relaxed text-white/76">
            {hero?.intro || "These are ready as CMS article topics for SEO, buyer education, and AI-search visibility."}
          </p>
        </div>
      </section>
      <Section
        eyebrow={gridSection?.subtitle || undefined}
        title={gridSection?.title || undefined}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((article: any) => (
            <article
              key={article.id || article}
              className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6"
            >
              <PenLine className="text-[var(--brand-secondary)]" size={22} aria-hidden="true" />
              <h2 className="mt-4 text-fluid-xl font-black text-[var(--foreground)]">
                {article.title || article}
              </h2>
              <CmsRichText
                className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]"
                html={getSectionText(gridSection, "card_body", "Draft this guide from the CMS with practical route advice, transparent cost notes, permit verification reminders, FAQs, and a quote CTA.")}
              />
            </article>
          ))}
        </div>
        <Link
          href={getSectionLink(quoteCtaSection, "href", "/request-quote")}
          className="mt-8 btn-h-responsive inline-flex rounded-full bg-[var(--brand-primary)] px-6 py-3 text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        >
          {quoteCtaSection?.title || "Ask us to plan your route"}
        </Link>
      </Section>
    </>
  );
}