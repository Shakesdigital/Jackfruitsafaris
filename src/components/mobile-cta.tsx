import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  buildWhatsAppHref,
  type PublicSiteSettings,
} from "@/lib/site-settings";

export function MobileCta({ settings }: { settings?: PublicSiteSettings | null }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-black/10 bg-white p-2 shadow-2xl md:hidden safe-area-inset-bottom">
      <a
        href={buildWhatsAppHref(settings)}
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#1f5b44]/20 text-fluid-sm font-black text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
      <Link
        href="/request-quote"
        className="ml-2 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--brand-primary)] text-fluid-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
      >
        Request Quote
      </Link>
    </div>
  );
}