import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  ShieldCheck,
  UserCircle2 as UserCircle,
} from "lucide-react";
import { CmsRichText } from "@/components/cms-rich-text";
import { HeroSection } from "@/components/hero-section";
import { SafariCard } from "@/components/safari-card";
import { Carousel } from "@/components/carousel";
import { Section } from "@/components/section";
import {
  experiences as hardcodedExperiences,
  iconMap,
  safaris as hardcodedSafaris,
  testimonials as hardcodedTestimonials,
  trustItems as hardcodedTrustItems,
  images,
  pageHeroFallbacks,
} from "@/lib/content";
import {
  getPublishedSafaris,
  getPublishedExperiences,
  getPublishedReviews,
  getPublishedQuickLinks,
  getPublishedTrustItems,
  getPublishedFeatures,
  getSiteSettings,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import {
  getPageSection,
  getSectionLink,
  getSectionStringList,
  getSectionText,
} from "@/lib/cms-page-content";
import { buildWhatsAppHref } from "@/lib/site-settings";
import type { PublicSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

// Helper to safely extract string values from settings or section objects
function getStringValue(
  source: Record<string, unknown> | null | undefined,
  key: string,
  fallback: string
): string {
  const value = source?.[key];
  if (typeof value === "string") return value;
  return fallback;
}

// Truncate a review quote into a brief preview
function truncateBrief(text: string | undefined, maxLen: number = 120): string {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}

// Normalize quick links from CMS into QuickLink[] shape
function normalizeQuickLinks(items: unknown): Array<{ label: string; href: string }> {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is { label?: string; href?: string } => typeof item === "object" && item !== null)
    .filter((item) => typeof item.label === "string" && typeof item.href === "string")
    .map((item) => ({ label: item.label!, href: item.href! }));
}

export default async function Home() {
  // Fetch CMS data
  const [cmsSafaris, cmsExperiences, cmsTestimonials, quickLinks, trustItems, features, settings, pageSections] = await Promise.all([
    getPublishedSafaris(),
    getPublishedExperiences(),
    getPublishedReviews(),
    getPublishedQuickLinks(),
    getPublishedTrustItems(),
    getPublishedFeatures(),
    getSiteSettings(),
    getPublishedPageContentSections("/"),
  ]);

  const trustBarSection = getPageSection(pageSections, "trust_bar");
  const whyUgandaSection = getPageSection(pageSections, "why_uganda");
  const featuredSafarisSection = getPageSection(pageSections, "featured_safaris");
  const experiencesSection = getPageSection(pageSections, "experiences");
  const reviewsSection = getPageSection(pageSections, "reviews");
  const quoteCtaSection = getPageSection(pageSections, "quote_cta");

  // Use hardcoded data as fallbacks when CMS returns empty
  const safaris = cmsSafaris.length ? cmsSafaris : hardcodedSafaris.map(s => ({
    slug: s.slug, title: s.title, duration: s.duration, summary: s.summary,
    price_from: s.price ? parseInt(s.price.match(/\d+/)?.[0] || "0") : null,
    comfort_levels: [s.comfort],
    featured_image_url: s.image,
  }));

  const experiences = cmsExperiences.length ? cmsExperiences : hardcodedExperiences.map(e => ({
    slug: e.slug, title: e.title, icon: e.icon, image: e.image, summary: e.summary,
  }));

  const testimonials = (cmsTestimonials.length ? cmsTestimonials : hardcodedTestimonials).map((t: any) => ({
    guest_name: t.guest_name || t.name,
    trip_type: t.trip_type || t.trip,
    quote: t.quote,
    image_url: t.image_url || (t as any).avatar_url,
  }));

  const fallbackFeatures = getSectionStringList(whyUgandaSection, "fallback_features", [
    "Private, flexible trips",
    "Clear package inclusions",
    "Permit and lodge guidance",
    "Warm care from arrival to departure",
  ]);
  const featuresList = features.length ? features : hardcodedSafaris.slice(0, 4).map((s, i) => ({
    id: i.toString(), text: fallbackFeatures[i] || "",
  }));
  const fallbackTrustItems = getSectionStringList(trustBarSection, "fallback_items", [
    "2024 Tripadvisor Travelers' Choice Award",
    "Registered tour company based in Jinja, Uganda",
    "Private and custom safari planning",
    "WhatsApp support before and during your trip",
  ]);

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        badgeText={getStringValue(settings, "badge_text", pageHeroFallbacks["/"]?.badgeText || "Local safari experts from Jinja")}
        title={getStringValue(settings, "hero_title", pageHeroFallbacks["/"]?.title || "Explore Uganda With Local Safari Experts")}
        intro={getStringValue(settings, "hero_subtitle", pageHeroFallbacks["/"]?.intro || "Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris from Jinja.")}
        backgroundImage={getStringValue(settings, "hero_image", images.hero)}
        ctaPrimary={{
          label: getStringValue(settings, "cta_primary", "Plan My Safari"),
          href: getStringValue(settings, "cta_primary_href", "/request-quote"),
        }}
        ctaSecondary={{
          label: getStringValue(settings, "cta_secondary", "View Safari Packages"),
          href: getStringValue(settings, "cta_secondary_href", "/safaris"),
        }}
        quickLinks={normalizeQuickLinks(quickLinks.length ? quickLinks : undefined) || undefined}
        ariaLabel="Jackfruit Safaris - Hero"
      />

      {/* Trust Bar */}
      <section className="border-y border-black/10 bg-white py-5 sm:py-6">
        <div className="container-responsive grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {trustItems.length ? trustItems.map((item: any) => (
            <div key={item.id || item.text} className="flex items-start gap-3 text-fluid-sm">
              <ShieldCheck className="mt-0.5 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
              <span className="font-bold leading-6 text-[var(--foreground)]">{item.text}</span>
            </div>
          )) : (
            fallbackTrustItems.map(item => (
              <div key={item} className="flex items-start gap-3 text-fluid-sm">
                <ShieldCheck className="mt-0.5 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
                <span className="font-bold leading-6 text-[var(--foreground)]">{item}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Why Uganda Section */}
      <Section
        eyebrow={getStringValue(whyUgandaSection, "subtitle", getStringValue(settings, "why_uganda_eyebrow", "Why Uganda"))}
        title={getStringValue(whyUgandaSection, "title", getStringValue(settings, "why_uganda_title", "One compact country, many safari worlds"))}
        intro={<CmsRichText html={getSectionText(whyUgandaSection, "intro", getStringValue(settings, "why_uganda_intro", "Uganda can take you from the River Nile to open savannah, roaring waterfalls, crater lakes, rainforest chimpanzees, and mountain gorillas in one carefully routed journey."))} />}
      >
        {(() => {
          const whyUgandaBgImage = getSectionText(whyUgandaSection, "background_image", "");
          return (
            <div className="space-y-8">
              <CmsRichText
                className="text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]"
                html={getSectionText(whyUgandaSection, "paragraph", getStringValue(settings, "why_uganda_paragraph", "Jackfruit Safaris helps you experience Uganda smoothly, with local guides who understand the roads, parks, permits, lodges, and small details that make a trip feel effortless."))}
              />
              {whyUgandaBgImage && (
                <div className="rounded-[var(--brand-radius)] overflow-hidden">
                  <img
                    src={whyUgandaBgImage}
                    alt="Uganda landscape — why travel with Jackfruit Safaris"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {featuresList.map((item: any) => (
                  <p key={item.id || item.text} className="flex items-center gap-3 font-bold">
                    <BadgeCheck className="text-[var(--brand-accent)]" size={18} aria-hidden="true" />
                    {item.text}
                  </p>
                ))}
              </div>
            </div>
          );
        })()}
      </Section>

      {/* Featured Safaris Section */}
      <Section
        className="bg-[#eef3eb]"
        eyebrow={getStringValue(featuredSafarisSection, "subtitle", "Featured safaris")}
        title={getStringValue(featuredSafarisSection, "title", "Start with a proven Uganda route")}
        intro={<CmsRichText html={getSectionText(featuredSafarisSection, "intro", "Choose a ready itinerary or ask Jackfruit Safaris to adjust the route, dates, accommodation tier, and pace around your group.")} />}
      >
        <Carousel>
          {safaris.map((safari: any) => (
            <SafariCard key={safari.slug} safari={{
              slug: safari.slug,
              title: safari.title,
              duration: safari.duration || "",
              summary: safari.summary || "",
              price: safari.price_from ? `from USD ${safari.price_from.toLocaleString()} per person` : (safari.price || "quoted"),
              comfort: (safari.comfort_levels || []).join(", ") || safari.comfort || "Budget to luxury",
              image: safari.featured_image_url || safari.image || "",
            }} />
          ))}
        </Carousel>
      </Section>

      {/* Experiences Section */}
      <Section
        eyebrow={getStringValue(experiencesSection, "subtitle", "Experiences")}
        title={getStringValue(experiencesSection, "title", "The right trip for your travel style")}
        intro={<CmsRichText html={getSectionText(experiencesSection, "intro", "Jackfruit Safaris can combine wildlife, primates, Nile adventure, culture, and transport into a single smooth plan.")} />}
      >
        <Carousel>
          {experiences.map((experience: any) => {
            const Icon = iconMap[experience.icon as keyof typeof iconMap];
            const IconComponent = Icon || BadgeCheck;
            return (
              <Link
                key={experience.slug}
                href={`/experiences/${experience.slug}`}
                className="group overflow-hidden rounded-[var(--brand-radius)] border border-black/10 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                <div
                  className="img-h-md bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${experience.image || experience.featured_image_url})` }}
                  aria-hidden="true"
                />
                <div className="p-5 sm:p-6">
                  <IconComponent className="text-[var(--brand-secondary)]" size={24} aria-hidden="true" />
                  <h3 className="mt-3 text-fluid-xl font-black text-[var(--foreground)]">
                    {experience.name || experience.title}
                  </h3>
                  <p className="mt-2 text-fluid-sm leading-6 text-[var(--brand-muted-text)]">
                    {experience.summary}
                  </p>
                </div>
              </Link>
            );
          })}
        </Carousel>
      </Section>

      {/* Reviews Section */}
      <Section
        className="bg-white"
        eyebrow={getStringValue(reviewsSection, "subtitle", "Reviews and planning proof")}
        title={getStringValue(reviewsSection, "title", "Confidence before the first road mile")}
        intro={<CmsRichText html={getSectionText(reviewsSection, "intro", "The new inquiry flow puts trust, price guidance, route logic, and WhatsApp access close to every major booking decision.")} />}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((review: any, index: number) => (
            <article key={review.guest_name || index} className="flex flex-col rounded-[var(--brand-radius)] border border-black/10 bg-[var(--background)] p-6">
              <div className="flex items-start gap-3">
                {review.image_url ? (
                  <img
                    src={review.image_url}
                    alt={review.guest_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle size={40} className="text-[var(--brand-muted-text)]" />
                )}
                <p className="text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                  {review.trip_type}
                </p>
              </div>
              <p className="mt-4 text-fluid-lg font-normal leading-8 text-[var(--foreground)]">
                "{truncateBrief(review.quote)}"
              </p>
              <p className="mt-4 text-fluid-sm font-bold text-[var(--brand-muted-text)]">
                {review.guest_name}
              </p>
              <Link
                href="/reviews"
                className="mt-auto inline-flex items-center gap-1 self-start text-fluid-sm font-bold text-[var(--brand-secondary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Read more
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="grid gap-8 rounded-[var(--brand-radius)] bg-[var(--brand-accent)] p-6 sm:p-8 lg:p-10 lg:grid-cols-[1fr_0.6fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              <MapPin size={18} aria-hidden="true" />
              {getStringValue(quoteCtaSection, "subtitle", getStringValue(settings, "cta_eyebrow", "Ready to plan?"))}
            </p>
            <h2 className="mt-4 text-fluid-3xl font-black leading-fluid-tight text-[var(--foreground)]">
              {getStringValue(quoteCtaSection, "title", getStringValue(settings, "cta_title", "Tell us your dates, group size, budget, and dream experiences."))}
            </h2>
            <CmsRichText
              className="mt-4 max-w-2xl text-fluid-lg leading-fluid-relaxed text-[var(--foreground)]"
              html={getSectionText(quoteCtaSection, "intro", getStringValue(settings, "cta_intro", "Jackfruit Safaris will recommend the best route and quote, with clear inclusions, exclusions, and items that need live checking."))}
            />
          </div>
          <div className="grid gap-3">
            <Link href={getSectionLink(quoteCtaSection, "primary_href", "/request-quote")} className="btn-h-responsive inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-6 text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
              {getSectionText(quoteCtaSection, "primary_label", getStringValue(settings, "cta_button", "Request a Custom Quote"))}
            </Link>
            <a href={buildWhatsAppHref(settings)} className="btn-h-responsive inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 text-fluid-sm font-black text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
              <MessageCircle size={18} aria-hidden="true" />
              {getSectionText(quoteCtaSection, "secondary_label", "WhatsApp Jackfruit")}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}