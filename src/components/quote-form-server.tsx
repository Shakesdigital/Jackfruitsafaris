import { createInquiry } from "@/app/actions";
import { getPublishedSafaris } from "@/lib/cms-data";

type QuoteFormProps = {
  sourcePage?: string;
  defaultService?: string;
  compact?: boolean;
};

export async function QuoteFormServer({
  sourcePage = "website",
  defaultService = "custom safari",
  compact = false,
}: QuoteFormProps) {
  const safaris = await getPublishedSafaris();

  return (
    <form
      action={createInquiry}
      className="grid gap-4 rounded-[8px] border border-black/10 bg-white p-5 shadow-sm"
    >
      <input type="hidden" name="source_page" value={sourcePage} />
      <div>
        <h2 className="text-xl font-black text-[#10251b]">Plan your trip</h2>
        <p className="mt-2 text-sm leading-6 text-[#536154]">
          Share the basics and Jackfruit Safaris will recommend a route, permit
          timing, lodge level, and quote.
        </p>
      </div>
      <label className="grid gap-1 text-sm font-bold text-[#27382b]">
        First name
        <input
          required
          name="first_name"
          className="min-h-11 rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[#2d6f55]"
        />
      </label>
      <label className="grid gap-1 text-sm font-bold text-[#27382b]">
        Email
        <input
          required
          type="email"
          name="email"
          className="min-h-11 rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[#2d6f55]"
        />
      </label>
      <label className="grid gap-1 text-sm font-bold text-[#27382b]">
        WhatsApp or phone
        <input
          name="phone"
          className="min-h-11 rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[#2d6f55]"
        />
      </label>
      <label className="grid gap-1 text-sm font-bold text-[#27382b]">
        Service type
        <select
          name="service_type"
          defaultValue={defaultService}
          className="min-h-11 rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[#2d6f55]"
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
          <label className="grid gap-1 text-sm font-bold text-[#27382b]">
            Travel dates
            <input
              name="travel_dates"
              placeholder="Month or exact dates"
              className="min-h-11 rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[#2d6f55]"
            />
          </label>
          <label className="grid gap-1 text-sm font-bold text-[#27382b]">
            Group size
            <input
              name="group_size"
              placeholder="2 adults"
              className="min-h-11 rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[#2d6f55]"
            />
          </label>
        </div>
      )}
      <label className="grid gap-1 text-sm font-bold text-[#27382b]">
        Budget range
        <input
          name="budget_range"
          placeholder="Budget, mid-range, luxury, or USD range"
          className="min-h-11 rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[#2d6f55]"
        />
      </label>
      <label className="grid gap-1 text-sm font-bold text-[#27382b]">
        Interests
        <input
          name="interests"
          placeholder="Gorillas, wildlife, culture, Jinja, transfers..."
          className="min-h-11 rounded-xl border border-black/10 px-3 font-medium outline-none focus:border-[#2d6f55]"
        />
      </label>
      <label className="grid gap-1 text-sm font-bold text-[#27382b]">
        Message
        <textarea
          required
          name="message"
          rows={compact ? 4 : 5}
          className="rounded-xl border border-black/10 px-3 py-3 font-medium outline-none focus:border-[#2d6f55]"
        />
      </label>
      <button className="min-h-12 rounded-full bg-[#143c2d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0f2d22]">
        Submit safari inquiry
      </button>
      <p className="text-xs leading-5 text-[#6d786e]">
        After you submit, the team checks route logic, permit or lodge needs,
        and sends the next best planning step.
      </p>
    </form>
  );
}