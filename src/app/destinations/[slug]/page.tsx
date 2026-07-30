import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, MapPin, Sparkles } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { Section } from "@/components/section";
import { SafariCard } from "@/components/safari-card";
import { getDestinationBySlug, getPublishedSafaris } from "@/lib/cms-data";

type Props = {
  params: Promise<{ slug: string }>;
};

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
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return {};
  }

  return {
    title: `${destination.name} Safari Guide`,
    description: destination.overview || destination.summary || "",
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const safaris = await getPublishedSafaris();
  const displaySafaris = safaris.slice(0, 2).map((s: { slug: string; title: string; duration?: string; summary?: string; price_from?: number; comfort_levels?: string[]; featured_image_url?: string }) => ({
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
      <section
        className="relative min-h-[58vh] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${destination.featured_image_url || ""})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/88 via-[#08170f]/58 to-[#08170f]/18" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl items-end px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              {destination.region}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              {destination.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">
              {destination.overview || destination.summary}
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <article className="space-y-10">
            <div className="grid gap-4 md:grid-cols-3">
              {(destination.why_go || []).map((item: string) => (
                <div key={item} className="rounded-[var(--brand-radius)] bg-[#eef7f0] p-5">
                  <Sparkles className="text-[var(--brand-secondary)]" size={22} />
                  <p className="mt-3 text-sm font-black text-[var(--foreground)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6">
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                  <CalendarCheck size={17} />
                  Best time
                </p>
                <p className="mt-4 text-base leading-8 text-[var(--brand-muted-text)]">
                  {destination.best_time}
                </p>
              </div>
              <div className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-6">
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--brand-secondary)]">
                  <MapPin size={17} />
                  Recommended stay
                </p>
                <p className="mt-4 text-base leading-8 text-[var(--brand-muted-text)]">
                  {destination.recommended_nights}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-[var(--foreground)]">
                Related Uganda safaris
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {displaySafaris.map((safari: Safari) => (
                  <SafariCard key={safari.slug} safari={safari} />
                ))}
              </div>
            </div>
            <div className="rounded-[var(--brand-radius)] bg-[var(--brand-primary)] p-6 text-white">
              <h2 className="text-2xl font-black">Route note</h2>
              <p className="mt-3 text-sm leading-7 text-white/76">
                Uganda routing works best when park sectors, lodge locations,
                permit times, and drive days are planned together. Jackfruit
                Safaris will adjust the sequence before quoting.
              </p>
              <Link
                href="/request-quote"
                className="mt-5 inline-flex rounded-full bg-[var(--brand-accent)] px-5 py-3 text-sm font-black text-[var(--foreground)]"
              >
                Match me with a route
              </Link>
            </div>
          </article>
          <QuoteForm sourcePage={destination.slug} defaultService="custom safari" />
        </div>
      </Section>
    </>
  );
}
