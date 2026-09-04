import type { Metadata } from "next";
import { Car, CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { CmsRichText } from "@/components/cms-rich-text";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { pageHeroFallbacks } from "@/lib/content";
import {
  getPageHero,
  getPublishedPageContentSections,
} from "@/lib/cms-data";
import {
  getPageSection,
  getSectionStringList,
  getSectionText,
} from "@/lib/cms-page-content";

export const metadata: Metadata = {
  title: "Airport Pickups and Transport Services",
  description:
    "Book reliable Entebbe airport pickups, Kampala and Jinja transfers, hotel transfers, safari vehicle hire, and group transport with Jackfruit Safaris.",
};

export const dynamic = "force-dynamic";

export default async function AirportTransfersPage() {
  const [hero, pageSections] = await Promise.all([
    getPageHero("/transport/airport-transfers"),
    getPublishedPageContentSections("/transport/airport-transfers"),
  ]);
  const fallback = pageHeroFallbacks["/transport/airport-transfers"];
  const introSection = getPageSection(pageSections, "transport_intro");
  const servicesSection = getPageSection(pageSections, "services_list");
  const quoteFormSection = getPageSection(pageSections, "quote_form");

  const services = getSectionStringList(servicesSection, "items", [
    "Entebbe airport pickup",
    "Entebbe to Kampala transfer",
    "Entebbe or Kampala to Jinja transfer",
    "Hotel transfers",
    "Safari vehicle hire with driver",
    "Group transport",
    "Late-night or early-morning transfers by arrangement",
  ]);

  const defaultService = getSectionText(quoteFormSection, "default_service", "Airport transfer");
  const sourcePage = getSectionText(quoteFormSection, "source_page", "airport-transfers");

  return (
    <>
      <HeroSection
        badgeText={hero?.badge_text || fallback?.badgeText}
        title={hero?.title || fallback?.title || "Airport Pickups and Transport"}
        subtitle={hero?.subtitle || fallback?.subtitle || "Reliable, Professional Service"}
        intro={hero?.intro || fallback?.intro || "Reliable airport pickups, hotel transfers, Jinja transfers, and safari transport with professional drivers."}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        icon={<Car size={18} aria-hidden="true" />}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        quickLinks={hero?.quick_links || fallback?.quickLinks}
        ariaLabel="Airport transfers and transport services"
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <CmsRichText
              className="text-fluid-2xl font-black text-[var(--foreground)]"
              html={getSectionText(introSection, "intro", "Jackfruit Safaris provides airport pickup from Entebbe International Airport and safe transfers to hotels, Jinja, Kampala, or your next safari destination.")}
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {services.map((service: any) => (
                <p
                  key={service}
                  className="flex gap-3 rounded-[var(--brand-radius)] bg-[#eef7f0] p-4 text-fluid-sm font-bold leading-6 text-[var(--foreground)]"
                >
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
                  {service}
                </p>
              ))}
            </div>
          </div>
          <QuoteForm sourcePage={sourcePage} defaultService={defaultService} />
        </div>
      </Section>
    </>
  );
}