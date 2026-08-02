import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { getMenuItemsByLocation } from "@/lib/navigation";
import {
  buildWhatsAppHref,
  type PublicSiteSettings,
} from "@/lib/site-settings";

export async function SiteHeader({ settings }: { settings?: PublicSiteSettings | null }) {
  const navigation = await getMenuItemsByLocation("main");

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/92 backdrop-blur-xl">
      <div className="container-responsive flex items-center justify-between py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-3 sm:gap-4" aria-label={`${settings?.business_name || "Jackfruit Safaris"} - Home`}>
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={`${settings.business_name || "Jackfruit Safaris"} logo`}
              className="logo-responsive rounded-full object-contain"
              width="48"
              height="48"
            />
          ) : (
            <span className="flex logo-responsive items-center justify-center rounded-full bg-[var(--brand-accent)] text-base font-black text-[var(--foreground)]">
              J
            </span>
          )}
          <span className="leading-tight hidden sm:block">
            <span className="block text-fluid-sm font-black uppercase tracking-[0.18em] text-[var(--foreground)]">
              {settings?.business_name || "Jackfruit"}
            </span>
            <span className="block text-fluid-xs font-semibold text-[var(--brand-muted-text)]">
              Safaris Uganda
            </span>
          </span>
          <span className="block sm:hidden text-fluid-xs font-semibold text-[var(--brand-muted-text)]">
            {settings?.business_name || "Jackfruit Safaris Uganda"}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-fluid-sm font-semibold text-[var(--foreground)] transition hover:bg-[#eef3eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={buildWhatsAppHref(settings)}
            className="inline-flex items-center gap-2 rounded-full border border-[#1f5b44]/20 px-4 py-2 text-fluid-sm font-bold text-[#174331] transition hover:bg-[#eef7f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle size={17} aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <Link
            href="/request-quote"
            className="btn-h-responsive rounded-full bg-[var(--brand-primary)] px-5 py-2 text-fluid-sm font-black text-white shadow-sm transition hover:bg-[#0f2d22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Request Quote
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-black/10 text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]" aria-label="Open menu">
            <Menu size={22} aria-hidden="true" />
          </summary>
          <div className="absolute right-0 mt-3 w-full max-w-[320px] rounded-2xl border border-black/10 bg-white p-3 shadow-2xl">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-fluid-sm font-bold text-[var(--foreground)] hover:bg-[#eef3eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/request-quote"
              className="mt-2 block rounded-xl bg-[var(--brand-primary)] px-4 py-3 text-center text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            >
              Request Quote
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}