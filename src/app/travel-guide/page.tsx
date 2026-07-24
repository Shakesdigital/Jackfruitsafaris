import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, PenLine } from "lucide-react";
import { Section } from "@/components/section";
import { getHomepageGuideArticles, getPageHero } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function TravelGuidePage() {
  const [guideArticles, hero] = await Promise.all([
    getHomepageGuideArticles(),
    getPageHero("/travel-guide"),
  ]);

  // Default articles if none in CMS
  const defaultArticles = [
    "Best Time to Visit Uganda for Safari and Gorilla Trekking",
    "Gorilla Trekking Permit Guide",
    "What to Pack for a Uganda Safari",
    "How Many Days Do You Need in Uganda?",
    "Murchison Falls Safari Guide",
    "Jinja Adventure Guide",
  ];

  const articles = guideArticles.length ? guideArticles : defaultArticles;

  return (
    <>
      <section className="bg-[#10251b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
            <BookOpen size={18} />
            {hero?.eyebrow || "Uganda safari travel guide"}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {hero?.title || "Practical articles that answer booking questions"}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
            {hero?.intro || "These are ready as CMS article topics for SEO, buyer education, and AI-search visibility."}
          </p>
        </div>
      </section>
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((article: any) => (
            <article
              key={article.id || article}
              className="rounded-[8px] border border-black/10 bg-white p-6"
            >
              <PenLine className="text-[#2d6f55]" size={22} />
              <h2 className="mt-4 text-2xl font-black text-[#10251b]">
                {article.title || article}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#536154]">
                Draft this guide from the CMS with practical route advice, transparent cost notes, permit verification reminders, FAQs, and a quote CTA.
              </p>
            </article>
          ))}
        </div>
        <Link
          href="/request-quote"
          className="mt-8 inline-flex rounded-full bg-[#143c2d] px-6 py-3 text-sm font-black text-white"
        >
          Ask us to plan your route
        </Link>
      </Section>
    </>
  );
}