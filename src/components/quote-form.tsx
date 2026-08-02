import { createInquiry } from "@/app/actions";
import { safaris } from "@/lib/content";

type QuoteFormProps = {
  sourcePage?: string;
  defaultService?: string;
  compact?: boolean;
};

export function QuoteForm({
  sourcePage = "website",
  defaultService = "custom safari",
  compact = false,
}: QuoteFormProps) {
  return (
    <form
      action={createInquiry}
      className="grid gap-4 rounded-[var(--brand-radius)] border border-black/10 bg-white p-5 sm:p-6 shadow-sm"
    >
      <input type="hidden" name="source_page" value={sourcePage} />
      <div>
        <h2 className="text-fluid-xl font-black text-[var(--foreground)]">Plan your trip</h2>
        <p className="mt-2 text-fluid-sm leading-6 text-[var(--brand-muted-text)]">
          Share the basics and Jackfruit Safaris will recommend a route, permit
          timing, lodge level, and quote.
        </p>
      </div>
      <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
        First name
        <input
          required
          name="first_name"
          className="input-h-responsive rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[var(--brand-secondary)]"
        />
      </label>
      <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
        Email
        <input
          required
          type="email"
          name="email"
          className="input-h-responsive rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[var(--brand-secondary)]"
        />
      </label>
      <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
        WhatsApp or phone
        <input
          name="phone"
          className="input-h-responsive rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[var(--brand-secondary)]"
        />
      </label>
      <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
        Service type
        <select
          name="service_type"
          defaultValue={defaultService}
          className="input-h-responsive rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[var(--brand-secondary)]"
        >
          <option value="custom safari">Custom Uganda safari</option>
          {safaris.map((safari) => (
            <option key={safari.slug} value={safari.title}>
              {safari.title}
            </option>
          ))}
          <option value="Jinja activity">Jinja activity</option>
          <option value="Airport transfer">Airport transfer</option>
          <option value="Cultural experience">Cultural experience</option>
        </select>
      </label>
      {!compact && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
            Travel dates
            <input
              name="travel_dates"
              placeholder="Month or exact dates"
              className="input-h-responsive rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[var(--brand-secondary)]"
            />
          </label>
          <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
            Group size
            <input
              name="group_size"
              placeholder="2 adults"
              className="input-h-responsive rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[var(--brand-secondary)]"
            />
          </label>
        </div>
      )}
      <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
        Budget range
        <input
          name="budget_range"
          placeholder="Budget, mid-range, luxury, or USD range"
          className="input-h-responsive rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[var(--brand-secondary)]"
        />
      </label>
      <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
        Interests
        <input
          name="interests"
          placeholder="Gorillas, wildlife, culture, Jinja, transfers..."
          className="input-h-responsive rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[var(--brand-secondary)]"
        />
      </label>
      <label className="grid gap-1 text-fluid-sm font-bold text-[var(--foreground)]">
        Message
        <textarea
          required
          name="message"
          rows={compact ? 4 : 5}
          className="input-h-responsive rounded-xl border border-black/10 px-3 py-3 font-medium outline-none focus:border-[var(--brand-secondary)] resize-y min-h-[100px]"
        />
      </label>
      <button className="btn-h-responsive rounded-full bg-[var(--brand-primary)] px-5 py-3 text-fluid-sm font-black text-white transition hover:bg-[#0f2d22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
        Submit safari inquiry
      </button>
      <p className="text-fluid-xs leading-5 text-[#6d786e]">
        After you submit, the team checks route logic, permit or lodge needs,
        and sends the next best planning step.
      </p>
    </form>
  );
}