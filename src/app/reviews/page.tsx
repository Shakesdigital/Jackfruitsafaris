import type { Metadata } from "next";
import Link from "next/link";
import { Award, Star } from "lucide-react";
import { Section } from "@/components/section";
import { testimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guest Reviews",
  description:
    "Read Jackfruit Safaris review highlights and plan your Uganda safari with a local Jinja-based tour company.",
};

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-[#10251b] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#f5bf2f]">
            <Award size={18} />
            Guest reviews
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Hear from travelers who explored Uganda with Jackfruit Safaris
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">
            Review content should be imported only with permission or embedded
            according to review platform rules. The CMS includes permission and
            source fields for that reason.
          </p>
        </div>
      </section>
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((review) => (
            <article
              key={review.name}
              className="rounded-[8px] border border-black/10 bg-white p-6"
            >
              <div className="flex gap-1 text-[#f5bf2f]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-lg font-bold leading-8 text-[#10251b]">
                &quot;{review.quote}&quot;
              </p>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#2d6f55]">
                {review.trip}
              </p>
              <p className="mt-1 text-sm font-bold text-[#536154]">
                {review.name}
              </p>
            </article>
          ))}
        </div>
        <Link
          href="/request-quote"
          className="mt-8 inline-flex rounded-full bg-[#143c2d] px-6 py-3 text-sm font-black text-white"
        >
          Plan your trip
        </Link>
      </Section>
    </>
  );
}
