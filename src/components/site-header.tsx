"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect } from "react";
import {
  DEFAULT_MAIN_NAVIGATION,
  getMenuItemsByLocation,
  type NavItem,
} from "@/lib/navigation";
import type { PublicSiteSettings } from "@/lib/site-settings";

// Build navigation items via server, then render a client shell for the
// mobile drawer state so the header re-renders reliably on route changes.
export async function SiteHeader({ settings }: { settings?: PublicSiteSettings | null }) {
  let navigation: NavItem[] = [];

  try {
    navigation = await getMenuItemsByLocation("main");
  } catch (err) {
    console.error("SiteHeader navigation error:", err);
  }

  if (!navigation.length)
    navigation = DEFAULT_MAIN_NAVIGATION;

  return (
    <HeaderInner navigation={navigation} settings={settings} />
  );
}

function HeaderInner({
  navigation,
  settings,
}: {
  navigation: NavItem[];
  settings?: PublicSiteSettings | null;
}) {
  const businessName = settings?.business_name || "Jackfruit Safaris";

  // Close the mobile drawer on route change / Escape
  useEffect(() => {
    const onHashChange = () => {
      const openDetail = document.querySelector('[data-mobile-nav="open"]');
      if (openDetail) {
        const checkbox = document.getElementById("mobile-nav-toggle") as HTMLInputElement | null;
        if (checkbox) checkbox.checked = false;
      }
    };
    window.addEventListener("hashchange", onHashChange);
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const checkbox = document.getElementById("mobile-nav-toggle") as HTMLInputElement | null;
        if (checkbox && checkbox.checked) checkbox.checked = false;
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/92 backdrop-blur-xl">
      <div className="container-responsive flex items-center justify-between py-3 sm:py-4">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 sm:gap-4"
          aria-label={`${businessName} - Home`}
        >
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={`${businessName} logo`}
              className="logo-responsive rounded-full object-contain"
              width="72"
              height="72"
              loading="eager"
              decoding="async"
              sizes="(max-width: 600px) 48px, 72px"
            />
          ) : (
            <span className="flex logo-responsive items-center justify-center rounded-full bg-[var(--brand-accent)] text-xl font-black text-[var(--foreground)]">
              J
            </span>
          )}
          <span className="leading-tight hidden sm:block">
            <span className="block text-fluid-sm font-black uppercase tracking-[0.18em] text-[var(--foreground)]">
              {settings?.business_name || "Jackfruit"}
            </span>
            <span className="block text-fluid-xs font-semibold text-[var(--brand-muted-text)]">
              Safaris
            </span>
          </span>
          <span className="block sm:hidden text-fluid-xs font-semibold text-[var(--brand-muted-text)]">
            {businessName}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-fluid-sm font-semibold text-[var(--foreground)] transition hover:bg-[#eef3eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] xl:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/request-quote"
            className="btn-h-responsive rounded-full bg-[var(--brand-primary)] px-5 py-2 text-fluid-sm font-black text-white shadow-sm transition hover:bg-[#0f2d22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Request Quote
          </Link>
        </div>

        {/* Mobile menu toggle + drawer */}
        <div className="lg:hidden">
          <input
            type="checkbox"
            id="mobile-nav-toggle"
            className="peer sr-only"
            aria-label="Toggle menu"
          />
          <label
            htmlFor="mobile-nav-toggle"
            className="peer relative flex size-12 cursor-pointer items-center justify-center rounded-full border border-black/10 text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label="Open menu"
          >
            <Menu size={24} aria-hidden="true" />
            {/* X icon shown when open (via peer) */}
            <span className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
              <X size={24} aria-hidden="true" className="text-[var(--brand-primary)]" />
            </span>
          </label>

          {/* Overlay + drawer panel (visible when checked) */}
          <div
            className="pointer-events-none fixed inset-0 z-40 flex bg-black/50 opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100"
            aria-hidden="true"
          />
          <div
            data-mobile-nav="open"
            className="absolute top-full right-0 z-50 mt-2 flex w-[calc(100vw-2rem)] max-w-xs -translate-y-2 space-y-2 rounded-2xl border border-black/10 bg-white p-4 shadow-2xl opacity-0 transition-all duration-200 peer-checked:translate-y-0 peer-checked:opacity-100 lg:hidden"
          >
            <nav aria-label="Mobile navigation">
              <div className="flex flex-col gap-1.5">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-fluid-base font-bold text-[var(--foreground)] hover:bg-[#eef3eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <Link
              href="/request-quote"
              className="mt-3 block rounded-xl bg-[var(--brand-primary)] px-4 py-3 text-center text-fluid-base font-black text-white hover:bg-[#0f2d22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
