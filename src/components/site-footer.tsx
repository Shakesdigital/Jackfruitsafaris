import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navItems, site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-[#10251b] pb-24 pt-14 text-white md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f5bf2f]">
            Jackfruit Safaris Uganda
          </p>
          <p className="mt-4 max-w-xl text-2xl font-black leading-tight">
            Private Uganda safaris, gorilla trekking, Nile adventures, culture,
            and reliable transport planned from Jinja.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/72">
            Prices are shown as planning guidance and remain subject to permit,
            park fee, lodge, and vehicle availability at the time of quotation.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white/60">
            Explore
          </h2>
          <div className="mt-4 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-white/78 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white/60">
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-sm text-white/78">
            <p className="flex gap-3">
              <Phone className="mt-0.5 shrink-0" size={17} />
              <span>{site.phone}</span>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 shrink-0" size={17} />
              <span>{site.email}</span>
            </p>
            <p className="flex gap-3">
              <MapPin className="mt-0.5 shrink-0" size={17} />
              <span>{site.location}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-xs text-white/52 sm:px-6 lg:px-8">
        (c) {new Date().getFullYear()} Jackfruit Safaris Uganda Ltd. Built for
        CMS-managed safari planning.
      </div>
    </footer>
  );
}
