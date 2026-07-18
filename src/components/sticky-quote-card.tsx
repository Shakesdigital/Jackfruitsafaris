import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { site } from "@/lib/content";
import { QuoteForm } from "./quote-form";

export function StickyQuoteCard({
  sourcePage,
  defaultService,
}: {
  sourcePage: string;
  defaultService: string;
}) {
  return (
    <aside className="sticky top-24 space-y-4">
      <QuoteForm
        sourcePage={sourcePage}
        defaultService={defaultService}
        compact
      />
      <div className="rounded-[8px] bg-[#eef7f0] p-5">
        <p className="flex items-center gap-2 text-sm font-black text-[#143c2d]">
          <ShieldCheck size={18} />
          Before you pay
        </p>
        <p className="mt-2 text-sm leading-6 text-[#536154]">
          Gorilla permits, park fees, and lodge availability are checked before
          the final quotation is confirmed.
        </p>
        <div className="mt-4 grid gap-2">
          <a
            href={site.whatsappHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#143c2d]/20 px-4 py-2 text-sm font-black text-[#143c2d]"
          >
            <MessageCircle size={16} />
            WhatsApp now
          </a>
          <Link
            href="/request-quote"
            className="inline-flex items-center justify-center rounded-full bg-[#f5bf2f] px-4 py-2 text-sm font-black text-[#10251b]"
          >
            Full quote form
          </Link>
        </div>
      </div>
    </aside>
  );
}
