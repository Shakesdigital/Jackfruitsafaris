import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SafariCard } from "@/components/safari-card";
import { Section } from "@/components/section";
import { experiences, iconMap, safaris } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return experiences.map((experience) => ({ slug: experience.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = experiences.find((item) => item.slug === slug);

  if (!experience) {
    return {};
  }

  return {
    title: experience.title,
    description: experience.summary,
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const experience = experiences.find((item) => item.slug === slug);

  if (!experience) {
    notFound();
  }

  const Icon = iconMap[experience.icon];

  return (
    <>
      <section
        className="relative min-h-[58vh] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${experience.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#08170f]/88 via-[#08170f]/58 to-[#08170f]/18" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl items-end px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
              <Icon size={19} />
              Uganda experience
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              {experience.title}
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
              {experience.bullets.map((item) => (
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
                {safaris.slice(0, 2).map((safari) => (
                  <SafariCard key={safari.slug} safari={safari} />
                ))}
              </div>
            </div>
          </article>
          <QuoteForm sourcePage={experience.slug} defaultService={experience.title} />
        </div>
      </Section>
    </>
  );
}
