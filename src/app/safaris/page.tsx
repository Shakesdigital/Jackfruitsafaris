import type { Metadata } from "next";
import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SafariCard } from "@/components/safari-card";
import { Section } from "@/components/section";
import { getPublishedSafaris, getPageHero } from "@/lib/cms-data";

type Safari = {
  slug: string;
  title: string;
  duration: string;
  summary: string;
  price: string;
  comfort: string;
  image: string;
};

export const dynamic = "force-dynamic";

export default async function SafarisPage() {
  const [cmsSafaris, hero] = await Promise.all([
    getPublishedSafaris(),
    getPageHero("/safaris"),
  ]);

  // Transform CMS data for SafariCard
  const safaris: Safari[] = cmsSafaris.map((s: { slug: string; title: string; duration?: string; summary?: string; price_from?: number; comfort_levels?: string[]; featured_image_url?: string }) => ({
    slug: s.slug,
    title: s.title,
    duration: s.duration || "",
    summary: s.summary || "",
    price: s.price_from
      ? `from USD ${s.price_from.toLocaleString()} per person`
      : "quoted after dates and preferences",
    comfort: (s.comfort_levels || []).join(", ") || "Budget to luxury",
    image: s.featured_image_url || "",
  }));

  return (
    <>
      <section className="bg-[#10251b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
            {hero?.eyebrow || "Uganda safari packages"}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {hero?.title || "Choose a proven route, then make it yours"}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
            {hero?.intro || "Whether you have three days or two weeks, Jackfruit Safaris can help you experience Uganda's landscapes and wildlife as budget, mid-range, or luxury private trips."}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              {[
                "Duration: 1 day, 3 days, 4-7 days, 8-14 days, custom",
                "Interest: gorillas, wildlife, chimpanzees, culture, Nile adventure",
                "Comfort: budget, mid-range, luxury",
                "Start point: Entebbe, Kampala, Jinja",
              ].map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[#27382b]"
                >
                  <Filter size={15} />
                  {filter}
                </span>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {safaris.map((safari: Safari) => (
                <SafariCard key={safari.slug} safari={safari} />
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-[8px] bg-[#eef7f0] p-6">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                <SlidersHorizontal size={17} />
                Custom planning
              </p>
              <h2 className="mt-3 text-2xl font-black text-[#10251b]">
                Need a different route?
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#536154]">
                Share your dates, pace, budget, lodge style, and must-do activities. Jackfruit Safaris will match the route to your time and comfort level.
              </p>
              <Link
                href="/safaris/custom-uganda-safari"
                className="mt-5 inline-flex rounded-full bg-[#143c2d] px-5 py-3 text-sm font-black text-white"
              >
                Build a custom safari
              </Link>
            </div>
            <QuoteForm sourcePage="safaris-index" compact />
          </aside>
        </div>
      </Section>
    </>
  );
}