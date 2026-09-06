import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsRichText } from "@/components/cms-rich-text";
import { Section } from "@/components/section";
import { getPublishedTravelGuideArticleBySlug } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

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
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_image_url?: string | null;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedTravelGuideArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  const title = article.meta_title || article.title;
  const description =
    article.meta_description || article.excerpt || undefined;

  return {
    title: `${title} — Jackfruit Safaris Travel Insight`,
    description,
    openGraph: {
      title,
      description,
      images: article.meta_image_url || article.featured_image_url
        ? [article.meta_image_url || article.featured_image_url || ""]
        : undefined,
    },
  };
}

export default async function TravelGuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = (await getPublishedTravelGuideArticleBySlug(
    slug,
  )) as TravelGuideArticle | null;

  if (!article) {
    notFound();
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      {/* Hero strip — uses featured image or solid background */}
      <section
        className="relative hero-h-responsive bg-cover bg-center text-white"
        style={
          article.featured_image_url
            ? {
                backgroundImage: `linear-gradient(rgba(8, 23, 15, 0.55), rgba(8, 23, 15, 0.55)), url(${article.featured_image_url})`,
              }
            : undefined
        }
      >
        <div className="container-responsive py-16 sm:py-24">
          <div className="max-w-3xl">
            {article.category && (
              <p className="inline-flex rounded-full bg-white/12 px-4 py-2 text-fluid-sm font-black uppercase tracking-[0.2em] text-[var(--brand-accent)] ring-1 ring-white/20">
                {article.category}
              </p>
            )}
            <h1 className="mt-6 text-fluid-5xl font-black leading-fluid-tight">
              {article.title}
            </h1>
            {(formattedDate || article.author) && (
              <p className="mt-4 text-sm text-white/70">
                {formattedDate && <time dateTime={article.published_at || undefined}>{formattedDate}</time>}
                {article.author && formattedDate && " · "}
                {article.author && <span>{article.author}</span>}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Article body */}
      <Section>
        <div className="mx-auto max-w-3xl">
          {article.excerpt && (
            <p className="text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">
              {article.excerpt}
            </p>
          )}

          <div className="mt-8">
            <CmsRichText
              className="prose lg:prose-lg max-w-none text-[var(--brand-muted-text)]"
              html={article.content || ""}
            />
          </div>

          <div className="mt-12 flex flex-col gap-4 rounded-[var(--brand-radius)] border border-black/10 bg-[#eef3eb] p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <p className="text-fluid-sm font-black text-[var(--foreground)]">
              Ready to plan your Uganda safari?
            </p>
            <Link
              href="/request-quote"
              title="Request a custom quote for your Uganda safari"
              className="rounded-full bg-[var(--brand-primary)] px-6 py-3 text-fluid-sm font-black text-white transition hover:bg-[#e5ad17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            >
              Request a Custom Quote
            </Link>
          </div>

          <div className="mt-10">
            <Link
              href="/travel-guide"
              title="Back to travel guide articles"
              className="text-fluid-sm font-medium text-[var(--brand-secondary)] hover:underline"
            >
              ← Back to Travel Insights
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
