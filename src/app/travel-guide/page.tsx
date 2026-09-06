import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { CmsRichText } from "@/components/cms-rich-text";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import {
  getPublishedTravelGuideArticles,
  getPublishedTravelGuideArticleCount,
  getPageHero,
} from "@/lib/cms-data";
import { pageHeroFallbacks } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Travel Guide — Articles & Insights on Uganda Safaris",
  description:
    "Practical insights, articles, and blogs about traveling in Uganda, from gorilla trekking to the best time to visit and what to pack.",
};

const ARTICLES_PER_PAGE = 9;

type TravelGuideArticle = {
  id: string;
  slug: string;
  title: string;
  category?: string | null;
  author?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featured_image_url?: string | null;
  status: string;
  order_column: number;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
};

export default async function TravelGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  // Fetch hero (left as-is) and paginated articles in parallel
  const [hero, articles, totalCount] = await Promise.all([
    getPageHero("/travel-guide"),
    getPublishedTravelGuideArticles({ limit: ARTICLES_PER_PAGE, offset }),
    getPublishedTravelGuideArticleCount(),
  ]);

  const fallback = pageHeroFallbacks["/travel-guide"];
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  return (
    <>
      {/* Hero — left unchanged */}
      <HeroSection
        badgeText={hero?.badge_text || fallback?.badgeText}
        title={hero?.title || fallback?.title || "Practical Travel Articles"}
        subtitle={hero?.subtitle || fallback?.subtitle || "That Answer Your Booking Questions"}
        intro={hero?.intro || fallback?.intro || "These are ready as CMS article topics for SEO, buyer education, and AI-search visibility."}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        icon={<BookOpen size={18} aria-hidden="true" />}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        quickLinks={hero?.quick_links || fallback?.quickLinks}
        ariaLabel="Uganda safari travel guide"
      />

      {/* Travel Insight intro — small heading + brief paragraph */}
      <Section>
        <div className="mb-10 max-w-3xl">
          <h2 className="text-fluid-3xl font-black leading-fluid-tight text-[var(--foreground)]">
            Travel Insight
          </h2>
          <p className="mt-4 max-w-2xl text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">
            The Travel Insight space is where Jackfruit Safaris shares articles
            and blogs about travel in Uganda — from gorilla trekking tips and
            permit guidance to the best time to visit, what to pack, and how
            much a safari costs. Browse the latest articles below, read the full
            story on each detail page, and reach out when you're ready to plan
            your own Ugandan adventure.
          </p>
        </div>
      </Section>

      {/* Article cards — 3 per row, paginated */}
      <Section className="-mt-6">
        {articles.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article: TravelGuideArticle) => (
                <Link
                  key={article.id}
                  href={`/travel-guide/${article.slug}`}
                  className="group block rounded-[var(--brand-radius)] border border-black/10 bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  {article.featured_image_url && (
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="mb-4 h-40 w-full rounded-[var(--brand-radius)] object-cover ring-1 ring-black/5"
                    />
                  )}
                  <h3 className="text-fluid-xl font-black text-[var(--foreground)] group-hover:text-[var(--brand-primary)] transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <CmsRichText
                      className="mt-3 text-fluid-sm leading-6 text-[var(--brand-muted-text)]"
                      html={article.excerpt}
                    />
                  )}
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[var(--brand-secondary)]">
                    Read the full story →
                  </p>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="mt-10 flex items-center justify-center gap-2"
                aria-label="Travel Insight pagination"
              >
                {currentPage > 1 && (
                  <Link
                    href={`/travel-guide?page=${currentPage - 1}`}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/travel-guide?page=${currentPage + 1}`}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <p className="text-fluid-sm text-[var(--brand-muted-text)]">
            No articles have been published yet. Check back soon for Travel
            Insights from Jackfruit Safaris.
          </p>
        )}
      </Section>
    </>
  );
}
