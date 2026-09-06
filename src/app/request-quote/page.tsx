import type { Metadata } from "next";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { CmsRichText } from "@/components/cms-rich-text";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { site, pageHeroFallbacks } from "@/lib/content";
import {
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import {
  getPageSection,
  getSectionObjectList,
  getSectionText,
} from "@/lib/cms-page-content";

export const metadata: Metadata = {
  title: "Request a Uganda Safari Quote",
  description:
    "Request a custom Uganda safari quote from Jackfruit Safaris for gorilla trekking, wildlife safaris, Jinja activities, culture, and transport.",
};

export const dynamic = "force-dynamic";

export default async function RequestQuotePage() {
  const [hero, pageSections] = await Promise.all([
    getPageHero("/request-quote"),
    getPublishedPageContentSections("/request-quote"),
  ]);
  const fallback = pageHeroFallbacks["/request-quote"];
  const infoCardsSection = getPageSection(pageSections, "info_cards");
  const quoteFormSection = getPageSection(pageSections, "quote_form");

  const infoCards = getSectionObjectList(infoCardsSection, "items", [
    {
      icon: "Clock",
      title: "What happens next",
      body: "The team reviews your dates, preferred pace, route logic, permits, and lodge level before sending the next planning step.",
    },
    {
      icon: "ShieldCheck",
      title: "What gets verified",
      body: "Gorilla and chimp permits, park fees, lodge availability, vehicle routing, and optional activity schedules are confirmed before the final quote.",
    },
    {
      icon: "MessageCircle",
      title: "Prefer WhatsApp?",
      body: site.phone,
    },
  ]);

  const iconMap = { Clock, ShieldCheck, MessageCircle };

  return (
    <>
      <HeroSection
        title={hero?.title || fallback?.title || "Tell Us What You Want"}
        subtitle={hero?.subtitle || fallback?.subtitle || "From Uganda"}
        intro={hero?.intro || fallback?.intro || "Dates, group size, budget, activity interests, and comfort level are enough to start a practical route recommendation."}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        ariaLabel="Request a safari quote"
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.8fr]">
          <QuoteForm sourcePage={getSectionText(quoteFormSection, "source_page", "request-quote")} />
          <div className="space-y-4">
            {infoCards.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Clock;
              return (
                <article key={item.title} className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5 sm:p-6">
                  <Icon className="text-[var(--brand-secondary)]" size={24} aria-hidden="true" />
                  <h2 className="mt-4 text-fluid-xl font-black text-[var(--foreground)]">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}