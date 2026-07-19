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
    <article className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-sm">
      <div
        className="h-56 bg-cover bg-center"
        style={{ backgroundImage: `url(${safari.image})` }}
      />
      <div className="p-6">
        <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#2d6f55]">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} />
            {safari.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} />
            {safari.comfort}
          </span>
        </div>
        <h3 className="mt-4 text-2xl font-black leading-tight text-[#10251b]">
          {safari.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#536154]">{safari.summary}</p>
        <p className="mt-4 text-lg font-black text-[#143c2d]">{safari.price}</p>
        <Link
          href={`/safaris/${safari.slug}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5bf2f] px-4 py-2 text-sm font-black text-[#10251b] transition hover:bg-[#e5ad17]"
        >
          View itinerary
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
