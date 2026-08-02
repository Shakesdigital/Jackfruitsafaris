import type { Metadata } from "next";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { CmsRichText } from "@/components/cms-rich-text";
import { Section } from "@/components/section";
import { site } from "@/lib/content";
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
      <section
        className="relative hero-h-responsive bg-cover bg-center text-white"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
        aria-label="Request a safari quote"
      >
        {hero?.background_image && <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/55 via-[#08170f]/45 to-[#08170f]/35" aria-hidden="true" />}
        <div className="relative container-responsive flex min-h-[inherit] items-center py-10 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              {hero?.eyebrow || "Request quote"}
            </p>
            <h1 className="mt-4 text-fluid-4xl font-black leading-fluid-tight">
              {hero?.title || "Tell Jackfruit Safaris what you want from Uganda"}
            </h1>
            <p className="mt-5 max-w-3xl text-fluid-lg leading-fluid-relaxed text-white/76">
              {hero?.intro || "Dates, group size, budget, activity interests, and comfort level are enough to start a practical route recommendation."}
            </p>
          </div>
        </div>
      </section>
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