import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { Section } from "@/components/section";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Jackfruit Safaris",
  description:
    "Contact Jackfruit Safaris Uganda by email, phone, WhatsApp, or inquiry form for safaris, Jinja activities, and airport transfers.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#10251b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
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
                className="rounded-[8px] border border-black/10 bg-white p-5"
              >
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                  <item.icon size={17} />
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-black text-[#10251b]">
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
