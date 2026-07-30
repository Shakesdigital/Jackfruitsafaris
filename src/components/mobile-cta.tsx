import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  buildWhatsAppHref,
  type PublicSiteSettings,
} from "@/lib/site-settings";

export function MobileCta({ settings }: { settings?: PublicSiteSettings | null }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-black/10 bg-white p-2 shadow-2xl md:hidden">
      <a
        href={buildWhatsAppHref(settings)}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#1f5b44]/20 text-sm font-black text-[var(--brand-primary)]"
      >
        <MessageCircle size={18} />
        WhatsApp
      </a>
      <Link
        href="/request-quote"
        className="ml-2 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white"
      >
        Request Quote
      </Link>
    </div>
  );
}
