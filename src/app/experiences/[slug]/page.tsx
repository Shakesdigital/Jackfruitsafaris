import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SafariCard } from "@/components/safari-card";
import { Section } from "@/components/section";
import { getExperienceBySlug, getPublishedSafaris } from "@/lib/cms-data";

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

type Experience = {
  slug: string;
  name: string;
  summary: string | null;
  featured_image_url: string | null;
  included: string[];
};

export async function generateStaticParams() {
  const experiences = await getPublishedExperiences();
  return experiences.map((e: { slug: string }) => ({ slug: e.slug }));
}

async function getPublishedExperiences() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("slug")
    .eq("status", "published");
  return data || [];
}

async function createClient() {
  const { cookies } = await import("next/headers");
  const { createClient: supabaseCreateClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL_KEY || process.env.SUPABASE_URL_KEY || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  return supabaseCreateClient(url!, key!, {
    global: {
      headers: {
        cookie: (await cookies()).getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; "),
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    return {};
  }

  return {
    title: experience.meta_title || experience.name,
    description: experience.meta_description || experience.summary || "",
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  const safaris = await getPublishedSafaris();
  const displaySafaris = safaris.slice(0, 2).map((s: any) => ({
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

  const bullets = experience.included || experience.bullets || [];

  return (
    <>
      <section
        className="relative min-h-[58vh] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${experience.featured_image_url || ""})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/88 via-[#08170f]/58 to-[#08170f]/18" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl items-end px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
              Uganda experience
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              {experience.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">
              {experience.summary}
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <article className="space-y-10">
            <div className="grid gap-4 sm:grid-cols-2">
              {bullets.map((item: any) => (
                <p
                  key={item}
                  className="flex gap-3 rounded-[8px] bg-[#eef7f0] p-4 text-sm font-bold leading-6 text-[#27382b]"
                >
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#2d6f55]" size={18} />
                  {item}
                </p>
              ))}
            </div>
            <div className="rounded-[8px] border border-black/10 bg-white p-6">
              <h2 className="text-3xl font-black text-[#10251b]">
                How Jackfruit Safaris plans this
              </h2>
              <p className="mt-4 text-base leading-8 text-[#536154]">
                The team matches activities to your available time, transfer
                point, safety needs, and comfort level. Some experiences need
                live confirmation for weather, provider schedules, age limits,
                or park and permit rules.
              </p>
              <Link
                href="/request-quote"
                className="mt-5 inline-flex rounded-full bg-[#143c2d] px-5 py-3 text-sm font-black text-white"
              >
                Add this to my trip
              </Link>
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#10251b]">
                Recommended safaris
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {displaySafaris.map((safari: any) => (
                  <SafariCard key={safari.slug} safari={safari as Safari} />
                ))}
              </div>
            </div>
          </article>
          <QuoteForm sourcePage={experience.slug} defaultService={experience.name} />
        </div>
      </Section>
    </>
  );
}