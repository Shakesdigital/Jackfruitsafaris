import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getMenuItemsByLocation } from "@/lib/navigation";
import type { PublicSiteSettings } from "@/lib/site-settings";

export async function SiteFooter({ settings }: { settings?: PublicSiteSettings | null }) {
  const navigation = await getMenuItemsByLocation("footer");
  const footerBg = settings?.footer_background_color || "#10251b";

  return (
    <footer className="pb-16 pt-10 md:pb-12" style={{ backgroundColor: footerBg, color: "var(--footer-text)" }}>
      <div className="container-responsive grid gap-8 md:gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-fluid-sm font-black uppercase tracking-[0.24em] text-[var(--brand-accent)]">
            {settings?.business_name || "Jackfruit Safaris Uganda"}
          </p>
          <p className="mt-4 text-fluid-2xl font-black leading-fluid-tight max-w-xl">
            {settings?.footer_tagline || "Private Uganda safaris, gorilla trekking, Nile adventures, culture, and reliable transport planned from Jinja."}
          </p>
          <p className="mt-5 max-w-xl text-fluid-sm leading-7" style={{ color: "var(--footer-muted-text)" }}>
            {settings?.footer_note || "Prices are shown as planning guidance and remain subject to permit, park fee, lodge, and vehicle availability at the time of quotation."}
          </p>
        </div>
        <div>
          <h2 className="text-fluid-sm font-black uppercase tracking-[0.18em]" style={{ color: "var(--footer-muted-text)" }}>
            Explore
          </h2>
          <div className="mt-4 grid gap-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-fluid-base font-medium hover:underline transition-colors" style={{ color: "var(--footer-text)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-fluid-sm font-black uppercase tracking-[0.18em]" style={{ color: "var(--footer-muted-text)" }}>
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-fluid-sm" style={{ color: "var(--footer-muted-text)" }}>
            <p className="flex gap-3">
              <Phone className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
              <span>
                {settings?.phone || "+256 772 550 268"}
                {settings?.alternate_phone ? ` / ${settings.alternate_phone}` : ""}
              </span>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
              <span>{settings?.contact_email || "jackfruitsafarisuganda@gmail.com"}</span>
            </p>
            <p className="flex gap-3">
              <MapPin className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
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
                    className="font-semibold capitalize hover:underline" style={{ color: "var(--footer-text)" }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container-responsive mt-10 border-t pt-6 text-fluid-xs" style={{ borderColor: "var(--footer-muted-text)", opacity: 0.3 }}>
        {settings?.footer_copy || `© ${new Date().getFullYear()} Jackfruit Safaris Uganda Ltd. Built for CMS-managed safari planning.`}
      </div>
    </footer>
  );
}