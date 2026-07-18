import type { Metadata } from "next";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { Section } from "@/components/section";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request a Uganda Safari Quote",
  description:
    "Request a custom Uganda safari quote from Jackfruit Safaris for gorilla trekking, wildlife safaris, Jinja activities, culture, and transport.",
};

export default function RequestQuotePage() {
  return (
    <>
      <section className="bg-[#10251b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
            Request quote
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Tell Jackfruit Safaris what you want from Uganda
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
            Dates, group size, budget, activity interests, and comfort level are
            enough to start a practical route recommendation.
          </p>
        </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.8fr]">
          <QuoteForm sourcePage="request-quote" />
          <div className="space-y-4">
            {[
              {
                icon: Clock,
                title: "What happens next",
                body: "The team reviews your dates, preferred pace, route logic, permits, and lodge level before sending the next planning step.",
              },
              {
                icon: ShieldCheck,
                title: "What gets verified",
                body: "Gorilla and chimp permits, park fees, lodge availability, vehicle routing, and optional activity schedules are confirmed before the final quote.",
              },
              {
                icon: MessageCircle,
                title: "Prefer WhatsApp?",
                body: site.phone,
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[8px] border border-black/10 bg-white p-6"
              >
                <item.icon className="text-[#2d6f55]" size={24} />
                <h2 className="mt-4 text-2xl font-black text-[#10251b]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#536154]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
