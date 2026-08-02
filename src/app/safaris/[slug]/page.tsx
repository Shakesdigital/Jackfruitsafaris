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
import { getSafariBySlug } from "@/lib/cms-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const safari = await getSafariBySlug(slug);

  if (!safari) {
    return {};
  }

  return {
    title: safari.meta_title || safari.title,
    description: safari.meta_description || safari.summary,
  };
}

export default async function SafariDetailPage({ params }: Props) {
  const { slug } = await params;
  const safari = await getSafariBySlug(slug);

  if (!safari) {
    notFound();
  }

  // Transform CMS data to match frontend expectations
  const displayData = {
    slug: safari.slug,
    title: safari.title,
    duration: safari.duration || "",
    route: safari.route || "",
    startEnd: safari.start_point || "",
    summary: safari.summary || "",
    price: safari.price_from
      ? `from USD ${safari.price_from.toLocaleString()} per person`
      : "quoted after dates and preferences",
    comfort: (safari.comfort_levels || []).join(", ") || "Budget to luxury",
    image: safari.featured_image_url || "",
    highlights: safari.highlights || [],
    itinerary: safari.itinerary || [],
    accommodations: safari.accommodation_options || [],
    included: safari.included || [],
    excluded: safari.excluded || [],
    faqs: safari.faq || [],
    seoTitle: safari.meta_title || safari.title,
    seoDescription: safari.meta_description || safari.summary,
    note: safari.permit_rate_warning,
  };

  return (
    <>
      <section
        className="relative hero-h-responsive bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${displayData.image})` }}
        aria-label={`${displayData.title} - Safari details`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/55 via-[#08170f]/45 to-[#08170f]/35" aria-hidden="true" />
        <div className="relative container-responsive flex min-h-[inherit] items-end py-10 sm:py-14">
          <div className="max-w-4xl">
            <p className="text-fluid-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              {displayData.duration} private safari
            </p>
            <h1 className="mt-4 text-fluid-4xl font-black leading-fluid-tight">
              {displayData.title}
            </h1>
            <p className="mt-5 max-w-3xl text-fluid-lg leading-fluid-relaxed text-white/82">
              {displayData.summary}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white py-5 sm:py-6">
        <div className="container-responsive grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[
            ["Duration", displayData.duration],
            ["Route", displayData.route],
            ["Comfort", displayData.comfort],
            ["Price", displayData.price],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[var(--brand-radius)] bg-[var(--background)] p-4 sm:p-5">
              <p className="text-fluid-xs font-black uppercase tracking-[0.14em] text-[var(--brand-secondary)]">
                {label}
              </p>
              <p className="mt-2 text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
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
              <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                <MapPin size={17} aria-hidden="true" />
                Route logic
              </p>
              <h2 className="mt-3 text-fluid-3xl font-black text-[var(--foreground)]">
                {displayData.startEnd}
              </h2>
              <p className="mt-4 text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]">
                {displayData.summary}
              </p>
            </div>

            <div>
              <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                Highlights
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {displayData.highlights.map((highlight: string) => (
                  <p
                    key={highlight}
                    className="flex gap-3 rounded-[var(--brand-radius)] bg-[#eef7f0] p-4 text-fluid-sm font-bold leading-6 text-[var(--foreground)]"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
                    {highlight}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                <CalendarDays size={17} aria-hidden="true" />
                Day by day
              </p>
              <div className="mt-6 grid gap-5">
                {displayData.itinerary.map((day: { day: string; title: string; body: string; meals: string }) => (
                  <div
                    key={`${day.day}-${day.title}`}
                    className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5"
                  >
                    <p className="text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                      {day.day}
                    </p>
                    <h3 className="mt-2 text-fluid-xl font-black text-[var(--foreground)]">
                      {day.title}
                    </h3>
                    <p className="mt-3 text-fluid-base leading-8 text-[var(--brand-muted-text)]">
                      {day.body}
                    </p>
                    <p className="mt-3 text-fluid-sm font-bold text-[var(--foreground)]">
                      Meal plan: {day.meals}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="flex items-center gap-2 text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                <BadgeDollarSign size={17} aria-hidden="true" />
                Price guidance
              </p>
              <h2 className="mt-3 text-fluid-3xl font-black text-[var(--foreground)]">
                {displayData.price}
              </h2>
              <p className="mt-3 text-fluid-base leading-8 text-[var(--brand-muted-text)]">
                Prices are quoted as "from" guidance because permits, lodge
                category, season, group size, and vehicle logistics affect the
                final cost.
              </p>
              {displayData.note && (
                <p className="mt-4 rounded-[var(--brand-radius)] bg-[#fff7d7] p-4 text-fluid-sm font-bold leading-6 text-[#5c4a11]">
                  {displayData.note}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  Included
                </h2>
                <div className="mt-4 grid gap-3">
                  {displayData.included.map((item: string) => (
                    <p key={item} className="flex gap-3 text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-secondary)]" size={18} aria-hidden="true" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-fluid-2xl font-black text-[var(--foreground)]">
                  Excluded
                </h2>
                <div className="mt-4 grid gap-3">
                  {displayData.excluded.map((item: string) => (
                    <p key={item} className="flex gap-3 text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                      <XCircle className="mt-0.5 shrink-0 text-[#a04b36]" size={18} aria-hidden="true" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-fluid-3xl font-black text-[var(--foreground)]">
                Accommodation options
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {displayData.accommodations.map((item: { tier: string; options: string }) => (
                  <div
                    key={item.tier}
                    className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5"
                  >
                    <p className="text-fluid-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                      {item.tier}
                    </p>
                    <p className="mt-3 text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                      {item.options}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-fluid-3xl font-black text-[var(--foreground)]">
                <HelpCircle size={24} aria-hidden="true" />
                FAQs
              </h2>
              <div className="mt-5 grid gap-3">
                {displayData.faqs.map((faq: { question: string; answer: string }) => (
                  <details
                    key={faq.question}
                    className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5"
                  >
                    <summary className="cursor-pointer text-fluid-lg font-black text-[var(--foreground)]">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--brand-radius)] bg-[var(--brand-primary)] p-6 text-white">
              <h2 className="text-fluid-2xl font-black">Want this adjusted?</h2>
              <p className="mt-3 text-fluid-sm leading-7 text-white/76">
                Jackfruit Safaris can change the start point, lodge tier,
                pacing, activity mix, and final night based on flight timing or
                traveler energy.
              </p>
              <Link
                href="/request-quote"
                className="mt-5 btn-h-responsive inline-flex rounded-full bg-[var(--brand-accent)] px-5 py-3 text-fluid-sm font-black text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Customize this itinerary
              </Link>
            </div>
          </article>
          <StickyQuoteCard sourcePage={displayData.slug} defaultService={displayData.title} />
        </div>
      </Section>
    </>
  );
}