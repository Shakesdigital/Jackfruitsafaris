import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { getSiteSettings } from "@/lib/cms-data";
import { buildWhatsAppHref } from "@/lib/site-settings";
import { QuoteForm } from "./quote-form";

export async function StickyQuoteCard({
  sourcePage,
  defaultService,
}: {
  sourcePage: string;
  defaultService: string;
}) {
  const settings = await getSiteSettings();

  return (
    <aside className="sticky top-24 space-y-4">
      <QuoteForm
        sourcePage={sourcePage}
        defaultService={defaultService}
        compact
      />
      <div className="rounded-[var(--brand-radius)] bg-[#eef7f0] p-5">
        <p className="flex items-center gap-2 text-sm font-black text-[var(--brand-primary)]">
          <ShieldCheck size={18} />
          Before you pay
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--brand-muted-text)]">
          Gorilla permits, park fees, and lodge availability are checked before
          the final quotation is confirmed.
        </p>
        <div className="mt-4 grid gap-2">
          <a
            href={buildWhatsAppHref(settings)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--brand-primary)]/20 px-4 py-2 text-sm font-black text-[var(--brand-primary)]"
          >
            <MessageCircle size={16} />
            WhatsApp now
          </a>
          <Link
            href="/request-quote"
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-accent)] px-4 py-2 text-sm font-black text-[var(--foreground)]"
          >
            Full quote form
          </Link>
        </div>
      </div>
    </aside>
  );
}
