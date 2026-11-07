import { createInquiry } from "@/app/actions";
import { safaris } from "@/lib/content";

type QuoteFormProps = {
  sourcePage?: string;
  defaultService?: string;
  compact?: boolean;
  /** Optional wrapper classes, e.g. sticky sidebar positioning. */
  className?: string;
};

const fieldLabel =
  "flex flex-col gap-1.5 text-xs font-semibold text-[var(--foreground)]";
const fieldInput =
  "h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm font-normal outline-none transition placeholder:text-black/35 focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--brand-secondary)]/20";

export function QuoteForm({
  sourcePage = "website",
  defaultService = "custom safari",
  compact = false,
  className = "",
}: QuoteFormProps) {
  return (
    <form
      action={createInquiry}
      className={`grid content-start gap-4 rounded-[var(--brand-radius)] border border-black/10 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <input type="hidden" name="source_page" value={sourcePage} />
      <div>
        <h2 className="text-lg font-extrabold text-[var(--foreground)]">Plan your trip</h2>
        <p className="mt-1.5 text-sm leading-6 text-[var(--brand-muted-text)]">
          Share the basics and Jackfruit Safaris will recommend a route, permit
          timing, lodge level, and quote.
        </p>
      </div>
      <label className={fieldLabel}>
        First name
        <input
          required
          name="first_name"
          className={fieldInput}
        />
      </label>
      <label className={fieldLabel}>
        Email
        <input
          required
          type="email"
          name="email"
          className={fieldInput}
        />
      </label>
      <label className={fieldLabel}>
        WhatsApp or phone
        <input
          name="phone"
          className={fieldInput}
        />
      </label>
      <label className={fieldLabel}>
        Service type
        <select
          name="service_type"
          defaultValue={defaultService}
          className={`${fieldInput} appearance-none`}
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
          <label className={fieldLabel}>
            Travel dates
            <input
              name="travel_dates"
              placeholder="Month or exact dates"
              className={fieldInput}
            />
          </label>
          <label className={fieldLabel}>
            Group size
            <input
              name="group_size"
              placeholder="2 adults"
              className={fieldInput}
            />
          </label>
        </div>
      )}
      <label className={fieldLabel}>
        Budget range
        <input
          name="budget_range"
          placeholder="Budget, mid-range, luxury, or USD range"
          className={fieldInput}
        />
      </label>
      <label className={fieldLabel}>
        Interests
        <input
          name="interests"
          placeholder="Gorillas, wildlife, culture, Jinja, transfers..."
          className={fieldInput}
        />
      </label>
      <label className={fieldLabel}>
        Message
        <textarea
          required
          name="message"
          rows={compact ? 4 : 5}
          className="w-full min-h-[88px] resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm font-normal outline-none transition placeholder:text-black/35 focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--brand-secondary)]/20"
        />
      </label>
      <button
        type="submit"
        className="h-11 rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[#165342] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
      >
        Submit safari inquiry
      </button>
      <p className="text-xs leading-5 text-[#6d786e]">
        After you submit, the team checks route logic, permit or lodge needs,
        and sends the next best planning step.
      </p>
    </form>
  );
}
