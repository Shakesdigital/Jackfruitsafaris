import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { CmsRichText } from "@/components/cms-rich-text";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { site, pageHeroFallbacks } from "@/lib/content";
import {
  getPageHero,
  getPublishedPageContentSections,
  getSiteSettings,
} from "@/lib/cms-data";
import {
  getPageSection,
  getSectionObjectList,
  getSectionText,
} from "@/lib/cms-page-content";

export const metadata: Metadata = {
  title: "Contact Jackfruit Safaris",
  description:
    "Contact Jackfruit Safaris by email, phone, WhatsApp, or inquiry form for safaris, Jinja activities, and airport transfers.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [hero, pageSections, settings] = await Promise.all([
    getPageHero("/contact"),
    getPublishedPageContentSections("/contact"),
    getSiteSettings(),
  ]);
  const fallback = pageHeroFallbacks["/contact"];
  const contactInfoSection = getPageSection(pageSections, "contact_info");
  const quoteFormSection = getPageSection(pageSections, "quote_form");

  const contactItems = getSectionObjectList(contactInfoSection, "items", [
    { icon: "Mail", label: "Email", value: site.email },
    { icon: "Phone", label: "Phone/WhatsApp", value: site.phone },
    { icon: "Phone", label: "Alternate phone", value: site.alternatePhone },
    { icon: "MapPin", label: "Location", value: site.location },
  ]);

  const iconMap = { Mail, Phone, MapPin };

  // Resolve values from site_settings where available, fallback to hardcoded site
  const resolvedItems = contactItems.map((item) => {
    const itemData = item as any;
    let value = itemData.value || "";
    if (itemData.value_source && settings) {
      const sourceKey = itemData.value_source.replace("site_settings.", "");
      if (settings[sourceKey]) {
        value = settings[sourceKey] as string;
      }
    }
    return { ...item, value };
  });

  return (
    <>
      <HeroSection
        badgeText={hero?.badge_text || fallback?.badgeText}
        title={hero?.title || fallback?.title || "Plan Your Uganda Safari"}
        subtitle={hero?.subtitle || fallback?.subtitle || "Send us your travel details"}
        intro={hero?.intro || fallback?.intro || "Send your travel details and Jackfruit Safaris will help you choose the right safari, activity, transfer, or custom itinerary."}
        backgroundImage={hero?.background_image || fallback?.backgroundImage}
        ctaPrimary={{
          label: hero?.cta_primary || "Plan My Safari",
          href: hero?.cta_primary_href || "/request-quote",
        }}
        ctaSecondary={{
          label: hero?.cta_secondary || "View Safari Packages",
          href: hero?.cta_secondary_href || "/safaris",
        }}
        quickLinks={hero?.quick_links || fallback?.quickLinks}
        ariaLabel="Contact Jackfruit Safaris"
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            {resolvedItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Mail;
              return (
                <div key={item.label} className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5 sm:p-6">
                  <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                    <Icon size={17} aria-hidden="true" />
                    {item.label}
                  </p>
                  <p className="mt-2 text-fluid-lg font-black text-[var(--foreground)]">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
          <QuoteForm sourcePage={getSectionText(quoteFormSection, "source_page", "contact")} />
        </div>
      </Section>
    </>
  );
}