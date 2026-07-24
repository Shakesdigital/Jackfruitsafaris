import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Section } from "@/components/section";
import { cmsModels } from "@/lib/content";
import { getPageHero } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const hero = await getPageHero("/about");

  const aboutContent = [
    {
      icon: "sprout",
      title: hero?.content?.why_jackfruit_title || "Why the name Jackfruit",
      body: hero?.content?.why_jackfruit_body || "The jackfruit is common and loved in Uganda. It reflects travel rooted in local life, generous experiences, and everyday discovery.",
    },
    {
      icon: "map",
      title: hero?.content?.where_operates_title || "Where the team operates",
      body: hero?.content?.where_operates_body || "Jinja, Entebbe, Kampala, Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Lake Mburo, Lake Bunyonyi, and custom routes.",
    },
    {
      icon: "heart",
      title: hero?.content?.guiding_style_title || "Guiding style",
      body: hero?.content?.guiding_style_body || "Personal, flexible, friendly, safe, and direct about what is included, what is optional, and what must be confirmed.",
    },
  ];

  return (
    <>
      <section className="bg-[#10251b] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
              {hero?.eyebrow || "About Jackfruit Safaris Uganda"}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              {hero?.title || "Local roots, practical planning, and warm guest care"}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
              {hero?.intro || "Jackfruit Safaris Uganda is a registered tour company based in Jinja, one of Uganda's most exciting travel hubs and the adventure capital of East Africa."}
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          {aboutContent.map((item) => (
            <article
              key={item.title}
              className="rounded-[8px] border border-black/10 bg-white p-6"
            >
              <BadgeCheck className="text-[#2d6f55]" size={26} />
              <h2 className="mt-4 text-2xl font-black text-[#10251b]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#536154]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        className="bg-[#eef3eb]"
        eyebrow="What Jackfruit organizes"
        title={hero?.content?.services_title || "Safari, adventure, culture, and logistics in one planning flow"}
        intro={hero?.content?.services_intro || "The website is structured so staff can manage every front-end content area from a future Supabase CMS."}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cmsModels.map((model) => (
            <p
              key={model}
              className="flex items-center gap-3 rounded-[8px] bg-white p-4 text-sm font-black text-[#27382b]"
            >
              <BadgeCheck className="shrink-0 text-[#2d6f55]" size={18} />
              {model}
            </p>
          ))}
        </div>
        <Link
          href="/request-quote"
          className="mt-8 inline-flex rounded-full bg-[#143c2d] px-6 py-3 text-sm font-black text-white"
        >
          Plan your safari
        </Link>
      </Section>
    </>
  );
}