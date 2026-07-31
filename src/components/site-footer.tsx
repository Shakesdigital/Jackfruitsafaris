import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { resolveNavItems } from "@/lib/content";
import type { PublicSiteSettings } from "@/lib/site-settings";

export function SiteFooter({ settings }: { settings?: PublicSiteSettings | null }) {
  const navigation = resolveNavItems(settings?.nav_items);

  return (
    <footer className="bg-[var(--foreground)] pb-24 pt-14 text-white md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--brand-accent)]">
            {settings?.business_name || "Jackfruit Safaris Uganda"}
          </p>
          <p className="mt-4 max-w-xl text-2xl font-black leading-tight">
            {settings?.footer_tagline || "Private Uganda safaris, gorilla trekking, Nile adventures, culture, and reliable transport planned from Jinja."}
          </p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/72">
            {settings?.footer_note || "Prices are shown as planning guidance and remain subject to permit, park fee, lodge, and vehicle availability at the time of quotation."}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white/60">
            Explore
          </h2>
          <div className="mt-4 grid gap-2">
            {navigation.map((item) => (
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
              <span>
                {settings?.phone || "+256 772 550 268"}
                {settings?.alternate_phone ? ` / ${settings.alternate_phone}` : ""}
              </span>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 shrink-0" size={17} />
              <span>{settings?.contact_email || "jackfruitsafarisuganda@gmail.com"}</span>
            </p>
            <p className="flex gap-3">
              <MapPin className="mt-0.5 shrink-0" size={17} />
              <span>{settings?.address || "Craft Village, Jinja, Uganda"}</span>
            </p>
            {settings?.operating_hours && <p>{settings.operating_hours}</p>}
            {settings?.social_links && (
              <div className="flex flex-wrap gap-3 pt-1">
                {Object.entries(settings.social_links).map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold capitalize text-white/78 hover:text-white"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-xs text-white/52 sm:px-6 lg:px-8">
        {settings?.footer_copy || `© ${new Date().getFullYear()} Jackfruit Safaris Uganda Ltd. Built for CMS-managed safari planning.`}
      </div>
    </footer>
  );
}
