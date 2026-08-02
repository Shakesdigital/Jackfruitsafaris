import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { Section } from "@/components/section";
import { site, images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Jackfruit Safaris",
  description:
    "Contact Jackfruit Safaris Uganda by email, phone, WhatsApp, or inquiry form for safaris, Jinja activities, and airport transfers.",
};

export default function ContactPage() {
  return (
    <>
      <section
        className="relative min-h-[86vh] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${images.hero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/55 via-[#08170f]/45 to-[#08170f]/35" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
            Contact
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Plan Your Uganda Safari
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
            Send your travel details and Jackfruit Safaris will help you choose
            the right safari, activity, transfer, or custom itinerary.
          </p>
        </div>
      </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: site.email },
              { icon: Phone, label: "Phone/WhatsApp", value: site.phone },
              { icon: Phone, label: "Alternate phone", value: site.alternatePhone },
              { icon: MapPin, label: "Location", value: site.location },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5"
              >
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                  <item.icon size={17} />
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-black text-[var(--foreground)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <QuoteForm sourcePage="contact" />
        </div>
      </Section>
    </>
  );
}
