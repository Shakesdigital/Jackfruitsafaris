import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

type Safari = {
  slug: string;
  title: string;
  duration: string;
  summary: string;
  price: string;
  comfort: string;
  image: string;
};

export function SafariCard({ safari }: { safari: Safari }) {
  return (
    <article className="overflow-hidden rounded-[var(--brand-radius)] border border-black/10 bg-white shadow-sm">
      <div
        className="img-h-sm bg-cover bg-center"
        style={{ backgroundImage: `url(${safari.image})` }}
      />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2 text-fluid-xs font-black uppercase tracking-[0.12em] text-[var(--brand-secondary)]">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            {safari.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} aria-hidden="true" />
            {safari.comfort}
          </span>
        </div>
        <h3 className="mt-4 text-fluid-xl font-black leading-fluid-tight text-[var(--foreground)]">
          {safari.title}
        </h3>
        <p className="mt-3 text-fluid-sm leading-7 text-[var(--brand-muted-text)]">{safari.summary}</p>
        <p className="mt-4 text-fluid-lg font-black text-[var(--brand-primary)]">{safari.price}</p>
        <Link
          href={`/safaris/${safari.slug}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-4 py-2 text-fluid-sm font-black text-[var(--foreground)] transition hover:bg-[#e5ad17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        >
          View itinerary
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}