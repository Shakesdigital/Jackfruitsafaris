import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SafariCard } from "@/components/safari-card";
import { Section } from "@/components/section";
import {
  iconMap,
} from "@/lib/content";
import {
  getPublishedSafaris,
  getPublishedExperiences,
  getPublishedReviews,
  getHomepageGuideArticles,
  getPublishedQuickLinks,
  getPublishedTrustItems,
  getPublishedFeatures,
  getSiteSettings,
} from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch CMS data
  const [safaris, experiences, testimonials, guideArticles, quickLinks, trustItems, features, settings] = await Promise.all([
    getPublishedSafaris(),
    getPublishedExperiences(),
    getPublishedReviews(),
    getHomepageGuideArticles(),
    getPublishedQuickLinks(),
    getPublishedTrustItems(),
    getPublishedFeatures(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[86vh] bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/90 via-[#08170f]/62 to-[#08170f]/20" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#f5bf2f] ring-1 ring-white/20">
              <BadgeCheck size={17} />
              {settings?.badge_text || "Local safari experts from Jinja"}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] sm:text-7xl">
              {settings?.hero_title || "Explore Uganda With Local Safari Experts"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
              {settings?.hero_subtitle || "Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris Uganda from Jinja."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request-quote"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f5bf2f] px-6 text-sm font-black text-[#10251b] transition hover:bg-[#e5ad17]"
              >
                {settings?.cta_primary || "Plan My Safari"}
              </Link>
              <Link
                href="/safaris"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-black text-white transition hover:bg-white/10"
              >
                {settings?.cta_secondary || "View Safari Packages"}
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {(quickLinks?.length ? quickLinks : [
                { label: "Gorilla Trekking", href: "/experiences/gorilla-trekking" },
                { label: "Murchison Falls", href: "/safaris/3-days-murchison-falls" },
                { label: "10 Days Uganda", href: "/safaris/10-days-uganda-safari" },
                { label: "Jinja Activities", href: "/experiences/jinja-adventures" },
                { label: "Airport Transfer", href: "/transport/airport-transfers" },
              ]).map((item: any) => (
                <Link
                  key={item.id || item.href}
                  href={item.href}
                  className="rounded-full bg-white/12 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/18 hover:bg-white/20"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-black/10 bg-white py-5">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {(trustItems?.length ? trustItems : [
            "2024 Tripadvisor Travelers' Choice Award",
            "Registered tour company based in Jinja, Uganda",
            "Private and custom safari planning",
            "WhatsApp support before and during your trip",
          ]).map((item: any) => (
            <div key={item.id || item} className="flex items-start gap-3 text-sm">
              <ShieldCheck className="mt-0.5 text-[#2d6f55]" size={18} />
              <span className="font-bold leading-6 text-[#27382b]">{item.text || item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Uganda Section */}
      <Section
        eyebrow={settings?.why_uganda_eyebrow || "Why Uganda"}
        title={settings?.why_uganda_title || "One compact country, many safari worlds"}
        intro={settings?.why_uganda_intro || "Uganda can take you from the River Nile to open savannah, roaring waterfalls, crater lakes, rainforest chimpanzees, and mountain gorillas in one carefully routed journey."}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[8px] bg-[#143c2d] p-8 text-white sm:p-10">
            <p className="text-xl leading-9 text-white/82">
              {settings?.why_uganda_paragraph || "Jackfruit Safaris helps you experience Uganda smoothly, with local guides who understand the roads, parks, permits, lodges, and small details that make a trip feel effortless."}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {(features?.length ? features : [
                "Private, flexible trips",
                "Clear package inclusions",
                "Permit and lodge guidance",
                "Warm care from arrival to departure",
              ]).map((item: any) => (
                <p key={item.id || item.text || item} className="flex items-center gap-3 font-bold">
                  <BadgeCheck className="text-[#f5bf2f]" size={18} />
                  {item.text || item}
                </p>
              ))}
            </div>
          </div>
          <QuoteForm sourcePage="homepage" compact />
        </div>
      </Section>

      {/* Featured Safaris Section */}
      <Section
        className="bg-[#eef3eb]"
        eyebrow="Featured safaris"
        title="Start with a proven Uganda route"
        intro="Choose a ready itinerary or ask Jackfruit Safaris to adjust the route, dates, accommodation tier, and pace around your group."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {safaris.map((safari: any) => (
            <SafariCard key={safari.slug} safari={safari} />
          ))}
        </div>
      </Section>

      {/* Experiences Section */}
      <Section
        eyebrow="Experiences"
        title="The right trip for your travel style"
        intro="Jackfruit Safaris can combine wildlife, primates, Nile adventure, culture, and transport into a single smooth plan."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {experiences.map((experience: any) => {
            const Icon = iconMap[experience.icon as keyof typeof iconMap];
            const IconComponent = Icon || BadgeCheck;
            return (
              <Link
                key={experience.slug}
                href={`/experiences/${experience.slug}`}
                className="group overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm"
              >
                <div
                  className="h-44 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${experience.image})` }}
                />
                <div className="p-5">
                  <IconComponent className="text-[#2d6f55]" size={24} />
                  <h3 className="mt-3 text-xl font-black text-[#10251b]">
                    {experience.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#536154]">
                    {experience.summary}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Reviews Section */}
      <Section
        className="bg-white"
        eyebrow="Reviews and planning proof"
        title="Confidence before the first road mile"
        intro="The new inquiry flow puts trust, price guidance, route logic, and WhatsApp access close to every major booking decision."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((review: any) => (
            <article
              key={review.name || review.id}
              className="rounded-[8px] border border-black/10 bg-[#fbfaf5] p-6"
            >
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                {review.trip || review.trip_type}
              </p>
              <p className="mt-4 text-lg font-bold leading-8 text-[#10251b]">
                &quot;{review.quote}&quot;
              </p>
              <p className="mt-4 text-sm font-bold text-[#536154]">
                {review.name || review.guest_name}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Travel Guide Section */}
      <Section
        className="bg-[#143c2d] text-white"
        eyebrow="Travel guide"
        title="Helpful planning content for safari buyers"
        intro="Priority guide topics are ready for CMS publishing, SEO expansion, and AI-search visibility."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {(guideArticles?.length ? guideArticles : [
            "Best Time to Visit Uganda for Safari and Gorilla Trekking",
            "Gorilla Trekking Permit Guide",
            "What to Pack for a Uganda Safari",
            "How Many Days Do You Need in Uganda?",
            "Murchison Falls Safari Guide",
            "Jinja Adventure Guide",
          ]).map((article: any) => (
            <Link
              key={article.id || article}
              href="/travel-guide"
              className="flex items-center justify-between rounded-[8px] bg-white/8 p-4 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/12"
            >
              {article.title || article}
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="grid gap-8 rounded-[8px] bg-[#f5bf2f] p-8 sm:p-10 lg:grid-cols-[1fr_0.6fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#143c2d]">
              <MapPin size={18} />
              {settings?.cta_eyebrow || "Ready to plan?"}
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-[#10251b] sm:text-5xl">
              {settings?.cta_title || "Tell us your dates, group size, budget, and dream experiences."}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#27382b]">
              {settings?.cta_intro || "Jackfruit Safaris will recommend the best route and quote, with clear inclusions, exclusions, and items that need live checking."}
            </p>
          </div>
          <div className="grid gap-3">
            <Link
              href="/request-quote"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#143c2d] px-6 text-sm font-black text-white"
            >
              {settings?.cta_button || "Request a Custom Quote"}
            </Link>
            <a
              href={settings?.whatsappHref || "https://wa.me/256772550268?text=Hello%20Jackfruit%20Safaris%2C%20I%20would%20like%20help%20planning%20a%20Uganda%20trip."}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-[#143c2d]"
            >
              <MessageCircle size={18} />
              WhatsApp Jackfruit
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}