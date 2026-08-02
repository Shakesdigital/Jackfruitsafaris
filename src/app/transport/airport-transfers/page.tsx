import type { Metadata } from "next";
import { Car, CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { CmsRichText } from "@/components/cms-rich-text";
import { Section } from "@/components/section";
import { images } from "@/lib/content";
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
      <section
        className="relative hero-h-responsive bg-cover bg-center text-white"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
        aria-label="Airport transfers and transport services"
      >
        {hero?.background_image && <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/55 via-[#08170f]/45 to-[#08170f]/35" aria-hidden="true" />}
        <div className="relative container-responsive flex min-h-[inherit] items-end py-10 sm:py-14">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              <Car size={18} aria-hidden="true" />
              {hero?.eyebrow || "Transport"}
            </p>
            <h1 className="mt-4 text-fluid-4xl font-black leading-fluid-tight">
              {hero?.title || "Airport Pickups and Transport Services"}
            </h1>
            <p className="mt-5 max-w-3xl text-fluid-lg leading-fluid-relaxed text-white/82">
              {hero?.intro || "Reliable airport pickups, hotel transfers, Jinja transfers, and safari transport with professional drivers."}
            </p>
          </div>
        </div>
      </section>

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