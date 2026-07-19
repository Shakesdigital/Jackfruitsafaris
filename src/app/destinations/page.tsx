import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { Section } from "@/components/section";
import { getPublishedDestinations } from "@/lib/cms-data";

type Destination = {
  slug: string;
  name: string;
  region: string | null;
  featured_image_url: string | null;
  overview: string | null;
  summary: string | null;
};

export const metadata: Metadata = {
  title: "Uganda Safari Destinations",
  description:
    "Explore Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Lake Mburo, Lake Bunyonyi, and Jinja with Jackfruit Safaris.",
};

export default async function DestinationsPage() {
  const destinations = await getPublishedDestinations();

  return (
    <>
      <section className="bg-[#10251b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
            Destinations
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Uganda safari places, routed with care
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
            Destination pages give travelers the practical &quot;why go&quot;, best time,
            recommended nights, and related route context they need before
            requesting a quote.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination: any) => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="group overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm"
            >
              <div
                className="h-56 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${destination.featured_image_url || ""})` }}
              />
              <div className="p-6">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                  <Map size={15} />
                  {destination.region}
                </p>
                <h2 className="mt-3 text-2xl font-black text-[#10251b]">
                  {destination.name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#536154]">
                  {destination.overview || destination.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#143c2d]">
                  View destination
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}