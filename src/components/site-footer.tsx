import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  DEFAULT_MAIN_NAVIGATION,
  getMenuItemsByLocation,
  type NavItem,
} from "@/lib/navigation";
import type { PublicSiteSettings } from "@/lib/site-settings";

export async function SiteFooter({ settings }: { settings?: PublicSiteSettings | null }) {
  let mainNavigation: NavItem[] = [];
  const footerBg = settings?.footer_background_color || "#10251b";

  try {
    mainNavigation = await getMenuItemsByLocation("main");
  } catch (err) {
    console.error("SiteFooter navigation error:", err);
  }

  if (!mainNavigation.length) {
    mainNavigation = DEFAULT_MAIN_NAVIGATION;
  }

  return (
    <footer
      className="pb-16 pt-10 md:pb-12"
      style={{ backgroundColor: footerBg, color: "var(--footer-text)" }}
    >
      <div className="container-responsive grid gap-8 md:gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        {/* Brand + tagline block */}
        <div>
          <Link
            href="/"
            className="mb-5 inline-flex"
            aria-label={`${settings?.business_name || "Jackfruit Safaris"} - Home`}
          >
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={`${settings?.business_name || "Jackfruit Safaris"} logo`}
                className="logo-responsive rounded-full object-contain"
                width="72"
                height="72"
              />
            ) : (
              <span className="flex logo-responsive items-center justify-center rounded-full bg-[var(--brand-accent)] text-xl font-black text-[var(--foreground)]">
                J
              </span>
            )}
          </Link>
          <p className="mt-4 text-center text-fluid-sm leading-7 sm:text-left" style={{ color: "var(--footer-muted-text)" }}>
            {settings?.footer_about ||
              "Jackfruit Safaris is a Jinja-based tour operator crafting private Uganda safaris, gorilla trekking, Nile adventures, cultural experiences, and reliable transport — planned from the heart of East Africa."}
          </p>
          <p
            className="mt-3 text-center text-fluid-xs font-black uppercase tracking-[0.24em] text-[var(--brand-accent)] sm:mt-0 sm:text-left"
          >
            {settings?.business_name || "Jackfruit Safaris"}
          </p>
          <p className="mt-4 text-center text-fluid-2xl font-black leading-fluid-tight max-w-xs sm:max-w-xl sm:text-left">
            {settings?.footer_tagline ||
              "Private Uganda safaris, gorilla trekking, Nile adventures, culture, and reliable transport planned from Jinja."}
          </p>

        </div>

        {/* Quick Links */}
        <div>
          <h2
            className="text-center text-fluid-sm font-black uppercase tracking-[0.18em] text-[var(--footer-muted-text)] sm:text-left"
            style={{ color: "var(--footer-muted-text)" }}
          >
            Quick Links
          </h2>
          <div className="mt-4 grid gap-2.5 sm:gap-3">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-center text-fluid-base font-medium hover:underline transition-colors sm:text-left"
                style={{ color: "var(--footer-text)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2
            className="text-center text-fluid-sm font-black uppercase tracking-[0.18em] sm:text-left"
            style={{ color: "var(--footer-muted-text)" }}
          >
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-fluid-sm" style={{ color: "var(--footer-muted-text)" }}>
            <p className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
              <Phone className="shrink-0" size={17} aria-hidden="true" />
              <span className="sm:mt-0">
                {settings?.phone || "+256 772 550 268"}
                {settings?.alternate_phone ? ` / ${settings.alternate_phone}` : ""}
              </span>
            </p>
            <p className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
              <Mail className="shrink-0" size={17} aria-hidden="true" />
              <span>{settings?.contact_email || "jackfruitsafarisuganda@gmail.com"}</span>
            </p>
            <p className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
              <MapPin className="shrink-0" size={17} aria-hidden="true" />
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
                    className="font-semibold capitalize hover:underline"
                    style={{ color: "var(--footer-text)" }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="container-responsive mt-10 border-t pt-6 text-center text-fluid-xs"
        style={{ borderColor: "var(--footer-muted-text)", opacity: 0.3 }}
      >
        {settings?.footer_copy ||
          `© ${new Date().getFullYear()} Jackfruit Safaris Ltd. Built for CMS-managed safari planning.`}
      </div>
    </footer>
  );
}
