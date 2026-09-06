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
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="mb-2 inline-flex"
            aria-label={`${settings?.business_name || "Jackfruit Safaris"} - Home`}
          >
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={`${settings?.business_name || "Jackfruit Safaris"} logo`}
                className="logo-responsive rounded-full object-contain"
                width="96"
                height="96"
              />
            ) : (
              <span className="flex logo-responsive items-center justify-center rounded-full bg-[var(--brand-accent)] text-3xl font-black text-[var(--foreground)]">
                J
              </span>
            )}
          </Link>
          <p className="mt-2 text-center text-fluid-sm leading-7" style={{ color: "var(--footer-muted-text)" }}>
            {settings?.footer_about ||
              "Jackfruit Safaris is a Jinja-based tour operator crafting private Uganda safaris, gorilla trekking, Nile adventures, cultural experiences, and reliable transport — planned from the heart of East Africa."}
          </p>
          <p
            className="mt-2 text-center text-fluid-xs font-black uppercase tracking-[0.24em] text-[var(--brand-accent)]"
          >
            {settings?.business_name || "Jackfruit Safaris"}
          </p>

        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center text-center">
          <h2
            className="text-center text-fluid-sm font-black uppercase tracking-[0.18em] text-[var(--footer-muted-text)]"
            style={{ color: "var(--footer-muted-text)" }}
          >
            Quick Links
          </h2>
          <div className="mt-4 grid w-full max-w-xs gap-2.5">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-center text-fluid-base font-medium hover:underline transition-colors"
                style={{ color: "var(--footer-text)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center text-center">
          <h2
            className="text-center text-fluid-sm font-black uppercase tracking-[0.18em]"
            style={{ color: "var(--footer-muted-text)" }}
          >
            Contact
          </h2>
          <div className="mt-4 flex flex-col items-center gap-3 text-fluid-sm" style={{ color: "var(--footer-muted-text)" }}>
            <p className="flex items-center gap-2">
              <Phone className="shrink-0" size={17} aria-hidden="true" />
              <span>
                {settings?.phone || "+256 772 550 268"}
                {settings?.alternate_phone ? ` / ${settings.alternate_phone}` : ""}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="shrink-0" size={17} aria-hidden="true" />
              <span>{settings?.contact_email || "jackfruitsafarisuganda@gmail.com"}</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="shrink-0" size={17} aria-hidden="true" />
              <span>{settings?.address || "Craft Village, Jinja, Uganda"}</span>
            </p>
            {settings?.operating_hours && <p>{settings.operating_hours}</p>}
            {settings?.social_links && (
              <div className="flex flex-wrap justify-center gap-3 pt-1">
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
        style={{ borderColor: "#ffffff", opacity: 0.3 }}
      >
        {settings?.footer_copy || (
          <>
            © {new Date().getFullYear()} Jackfruit Safaris Ltd. All Rights Reserved. Designed and powered by{" "}
            <a
              href="https://shakesdigital.com/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-[var(--brand-accent)]"
            >
              Shakes Digital
            </a>
            .
          </>
        )}
      </div>
    </footer>
  );
}
