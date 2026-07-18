import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  HelpCircle,
  MapPin,
  XCircle,
} from "lucide-react";
import { Section } from "@/components/section";
import { StickyQuoteCard } from "@/components/sticky-quote-card";
import { safaris } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return safaris.map((safari) => ({ slug: safari.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const safari = safaris.find((item) => item.slug === slug);

  if (!safari) {
    return {};
  }

  return {
    title: safari.seoTitle,
    description: safari.seoDescription,
  };
}

export default async function SafariDetailPage({ params }: Props) {
  const { slug } = await params;
  const safari = safaris.find((item) => item.slug === slug);

  if (!safari) {
    notFound();
  }

  return (
    <>
      <section
        className="relative min-h-[64vh] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${safari.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/92 via-[#08170f]/62 to-[#08170f]/18" />
        <div className="relative mx-auto flex min-h-[64vh] max-w-7xl items-end px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
              {safari.duration} private safari
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              {safari.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">
              {safari.summary}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white py-5">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            ["Duration", safari.duration],
            ["Route", safari.route],
            ["Comfort", safari.comfort],
            ["Price", safari.price],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] bg-[#fbfaf5] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2d6f55]">
                {label}
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#27382b]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <article className="space-y-12">
            <div>
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                <MapPin size={17} />
                Route logic
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#10251b]">
                {safari.startEnd}
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#536154]">
                {safari.summary}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-black text-[#10251b]">
                Highlights
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {safari.highlights.map((highlight) => (
                  <p
                    key={highlight}
                    className="flex gap-3 rounded-[8px] bg-[#eef7f0] p-4 text-sm font-bold leading-6 text-[#27382b]"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#2d6f55]" size={18} />
                    {highlight}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                <CalendarDays size={17} />
                Day by day
              </p>
              <div className="mt-6 grid gap-5">
                {safari.itinerary.map((day) => (
                  <div
                    key={`${day.day}-${day.title}`}
                    className="rounded-[8px] border border-black/10 bg-white p-5"
                  >
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                      {day.day}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-[#10251b]">
                      {day.title}
                    </h3>
                    <p className="mt-3 text-base leading-8 text-[#536154]">
                      {day.body}
                    </p>
                    <p className="mt-3 text-sm font-bold text-[#27382b]">
                      Meal plan: {day.meals}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                <BadgeDollarSign size={17} />
                Price guidance
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#10251b]">
                {safari.price}
              </h2>
              <p className="mt-3 text-base leading-8 text-[#536154]">
                Prices are quoted as &quot;from&quot; guidance because permits, lodge
                category, season, group size, and vehicle logistics affect the
                final cost.
              </p>
              {safari.note && (
                <p className="mt-4 rounded-[8px] bg-[#fff7d7] p-4 text-sm font-bold leading-6 text-[#5c4a11]">
                  {safari.note}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-black text-[#10251b]">
                  Included
                </h2>
                <div className="mt-4 grid gap-3">
                  {safari.included.map((item) => (
                    <p key={item} className="flex gap-3 text-sm font-bold leading-6 text-[#27382b]">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-[#2d6f55]" size={18} />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#10251b]">
                  Excluded
                </h2>
                <div className="mt-4 grid gap-3">
                  {safari.excluded.map((item) => (
                    <p key={item} className="flex gap-3 text-sm font-bold leading-6 text-[#27382b]">
                      <XCircle className="mt-0.5 shrink-0 text-[#a04b36]" size={18} />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-[#10251b]">
                Accommodation options
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {safari.accommodations.map((item) => (
                  <div
                    key={item.tier}
                    className="rounded-[8px] border border-black/10 bg-white p-5"
                  >
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                      {item.tier}
                    </p>
                    <p className="mt-3 text-sm font-bold leading-6 text-[#27382b]">
                      {item.options}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-3xl font-black text-[#10251b]">
                <HelpCircle size={24} />
                FAQs
              </h2>
              <div className="mt-5 grid gap-3">
                {safari.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-[8px] border border-black/10 bg-white p-5"
                  >
                    <summary className="cursor-pointer text-lg font-black text-[#10251b]">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-[#536154]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] bg-[#143c2d] p-6 text-white">
              <h2 className="text-2xl font-black">Want this adjusted?</h2>
              <p className="mt-3 text-sm leading-7 text-white/76">
                Jackfruit Safaris can change the start point, lodge tier,
                pacing, activity mix, and final night based on flight timing or
                traveler energy.
              </p>
              <Link
                href="/request-quote"
                className="mt-5 inline-flex rounded-full bg-[#f5bf2f] px-5 py-3 text-sm font-black text-[#10251b]"
              >
                Customize this itinerary
              </Link>
            </div>
          </article>
          <StickyQuoteCard sourcePage={safari.slug} defaultService={safari.title} />
        </div>
      </Section>
    </>
  );
}
