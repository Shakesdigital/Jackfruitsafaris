"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-[50] border-b border-black/10 bg-white/95 backdrop-blur-xl">
      <div className="container-responsive flex h-14 items-center justify-between sm:h-16">
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
              width="48"
              height="48"
              loading="eager"
              decoding="async"
              sizes="(max-width: 600px) 40px, 48px"
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
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-fluid-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] xl:px-4 ${
                  isActive
                    ? "bg-[var(--brand-accent)] text-white"
                    : "text-[var(--foreground)] transition hover:bg-[#eef3eb]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
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

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="relative flex size-12 items-center justify-center rounded-full border border-black/10 text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] lg:hidden"
        >
          <Menu
            size={24}
            aria-hidden={menuOpen}
            className={`transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <X
            size={24}
            aria-hidden={!menuOpen}
            className={`absolute transition-opacity duration-200 ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[50] bg-white/95 backdrop-blur-xl lg:hidden"
          aria-label="Mobile menu"
        >
          <div className="container-responsive flex h-screen flex-col justify-center gap-3 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`w-full rounded-xl px-6 py-4 text-center text-fluid-xl font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] ${
                    isActive
                      ? "bg-[var(--brand-accent)] text-white"
                      : "text-[var(--foreground)] hover:bg-[#eef3eb]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/request-quote"
              onClick={() => setMenuOpen(false)}
              className="w-full rounded-xl bg-[var(--brand-primary)] px-6 py-4 text-center text-fluid-xl font-black text-white hover:bg-[#0f2d22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
