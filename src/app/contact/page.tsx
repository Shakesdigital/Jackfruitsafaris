import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { CmsRichText } from "@/components/cms-rich-text";
import { Section } from "@/components/section";
import { site } from "@/lib/content";
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
    "Contact Jackfruit Safaris Uganda by email, phone, WhatsApp, or inquiry form for safaris, Jinja activities, and airport transfers.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [hero, pageSections, settings] = await Promise.all([
    getPageHero("/contact"),
    getPublishedPageContentSections("/contact"),
    getSiteSettings(),
  ]);
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
      <section
        className="relative min-h-[86vh] bg-cover bg-center text-white"
        style={hero?.background_image ? { backgroundImage: `url(${hero.background_image})` } : undefined}
      >
        {hero?.background_image && <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/55 via-[#08170f]/45 to-[#08170f]/35" />}
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              {hero?.eyebrow || "Contact"}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              {hero?.title || "Plan Your Uganda Safari"}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
              {hero?.intro || "Send your travel details and Jackfruit Safaris will help you choose the right safari, activity, transfer, or custom itinerary."}
            </p>
          </div>
        </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            {resolvedItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Mail;
              return (
                <div key={item.label} className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5">
                  <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                    <Icon size={17} />
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-black text-[var(--foreground)]">
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
