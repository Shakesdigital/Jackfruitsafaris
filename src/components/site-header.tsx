export const dynamic = "force-dynamic";

import Link from "next/link";
import { Menu, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/cms-data";
import { navItems } from "@/lib/content";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  // Build nav items - prefer CMS if available, fallback to hardcoded
  const navigation = settings?.nav_items || navItems;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#f5bf2f] text-lg font-black text-[#10251b]">
            J
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black uppercase tracking-[0.18em] text-[#10251b]">
              Jackfruit
            </span>
            <span className="block text-xs font-semibold text-[#536154]">
              Safaris Uganda
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation?.map((item: any) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#27382b] transition hover:bg-[#eef3eb]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={settings?.whatsapp_href || `https://wa.me/${settings?.whatsapp_number || "256772550268"}?text=Hello%20Jackfruit%20Safaris%2C%20I%20would%20like%20help%20planning%20a%20Uganda%20trip.`}
            className="inline-flex items-center gap-2 rounded-full border border-[#1f5b44]/20 px-4 py-2 text-sm font-bold text-[#174331] transition hover:bg-[#eef7f0]"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
          <Link
            href="/request-quote"
            className="rounded-full bg-[#143c2d] px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#0f2d22]"
          >
            Request Quote
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-black/10 text-[#143c2d]">
            <Menu size={20} />
          </summary>
          <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-black/10 bg-white p-3 shadow-2xl">
            {navigation?.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-[#27382b] hover:bg-[#eef3eb]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/request-quote"
              className="mt-2 block rounded-xl bg-[#143c2d] px-4 py-3 text-center text-sm font-black text-white"
            >
              Request Quote
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}