import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminSafariByIdResult } from "@/lib/cms-data";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { AdminLoadError } from "@/app/admin/_components/admin-load-error";
import {
  ImageUploadField,
  ListEditor,
} from "@/app/admin/_components/cms-form-controls";

type Props = {
  params: Promise<{ id: string }>;
};

type SafariDay = {
  day?: string;
  title?: string;
  body?: string;
  meals?: string;
};

type AccommodationOption = {
  tier?: string;
  options?: string;
};

type SafariFaq = {
  question?: string;
  answer?: string;
};

type SafariRecord = {
  id?: string;
  slug?: string | null;
  status?: string | null;
  title?: string | null;
  duration?: string | null;
  route?: string | null;
  start_point?: string | null;
  end_point?: string | null;
  price_from?: string | number | null;
  comfort_levels?: unknown;
  summary?: string | null;
  featured_image_url?: string | null;
  itinerary?: unknown;
  accommodation_options?: unknown;
  highlights?: unknown;
  included?: unknown;
  excluded?: unknown;
  faq?: unknown;
  meta_title?: string | null;
  meta_description?: string | null;
  permit_rate_warning?: string | null;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Safari Package",
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function fieldValue(value: string | number | null | undefined) {
  return value ?? "";
}

export default async function SafariEditPage({ params }: Props) {
  const { id } = await params;
  // Fetch data with admin client (bypasses RLS)
  const safariResult = await getAdminSafariByIdResult(id);
  const safari = safariResult.data as SafariRecord | null;

  if (safariResult.error) {
    return (
      <AdminLoadError
        title="Safari package could not be loaded"
        message={safariResult.error}
        code={safariResult.code}
        backHref="/admin/safaris"
        backLabel="Back to safari packages"
      />
    );
  }

  if (!safari && id !== "new") {
    notFound();
  }

  const isNew = id === "new";

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Safari Package" : "Edit Safari Package"}
        </h1>
        {!isNew && (
          <DeleteButton
            form="safari-form"
            formAction={`/admin/safaris/actions`}
            value={safari?.id ?? ""}
            confirmMessage="Delete this safari package?"
          >
            Delete
          </DeleteButton>
        )}
      </div>

      <form
        id="safari-form"
        action="/admin/safaris/actions"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={safari?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              required
              name="slug"
              defaultValue={fieldValue(safari?.slug)}
              placeholder="3-days-gorilla-tracking"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={safari?.status || "draft"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            required
            name="title"
            defaultValue={fieldValue(safari?.title)}
            placeholder="3 Days Gorilla Tracking Safari"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Duration</span>
            <input
              name="duration"
              defaultValue={fieldValue(safari?.duration)}
              placeholder="3 days"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Route</span>
            <input
              name="route"
              defaultValue={fieldValue(safari?.route)}
              placeholder="Entebbe - Bwindi - Entebbe"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Price (USD)</span>
            <input
              type="number"
              name="price_from"
              defaultValue={fieldValue(safari?.price_from)}
              placeholder="1250"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Start Point</span>
            <input
              required
              name="start_point"
              defaultValue={fieldValue(safari?.start_point)}
              placeholder="Starts in Entebbe, Kampala, or Jinja"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">End Point</span>
            <input
              name="end_point"
              defaultValue={fieldValue(safari?.end_point)}
              placeholder="Ends in Entebbe or Kampala"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Summary</span>
          <textarea
            name="summary"
            defaultValue={fieldValue(safari?.summary)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <ImageUploadField
          name="featured_image_url"
          fileName="featured_image_file"
          label="Featured Image"
          currentUrl={safari?.featured_image_url}
        />

        <ListEditor
          name="comfort_levels"
          label="Comfort Levels"
          values={asArray<string>(safari?.comfort_levels)}
          placeholder="Budget, Mid-range, Luxury"
          emptyRows={3}
        />

        <ItinerarySection safari={safari} />

        <AccommodationsSection safari={safari} />

        <HighlightsSection safari={safari} />

        <IncludedExcludedSection safari={safari} />

        <FAQsSection safari={safari} />

        <SEOFields safari={safari} />

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/safaris"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Safari Package
          </button>
        </div>
      </form>
    </div>
  );
}

// Itinerary Section
function ItinerarySection({ safari }: { safari: SafariRecord | null }) {
  const itinerary = asArray<SafariDay>(safari?.itinerary);
  const rows: Array<SafariDay | null> =
    itinerary.length > 0 ? itinerary : [null, null, null];

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Day-by-Day Itinerary</h3>
      <input type="hidden" name="days_count" value={rows.length} />
      {rows.map((day, i) => (
        <div key={i} className="mb-4 grid gap-3 rounded-md border p-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              name={`day_${i + 1}_number`}
              defaultValue={day?.day || `Day ${i + 1}`}
              placeholder="Day 1"
              className="rounded-md border-gray-300 text-sm"
            />
            <input
              name={`day_${i + 1}_title`}
              defaultValue={day?.title}
              placeholder="Day title"
              className="rounded-md border-gray-300 text-sm sm:col-span-2"
            />
            <textarea
              name={`day_${i + 1}_body`}
              defaultValue={day?.body}
              placeholder="Description..."
              rows={2}
              className="rounded-md border-gray-300 text-sm sm:col-span-3"
            />
            <input
              name={`day_${i + 1}_meals`}
              defaultValue={day?.meals}
              placeholder="Meals: Breakfast, lunch, dinner"
              className="rounded-md border-gray-300 text-sm sm:col-span-3"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Accommodations Section
function AccommodationsSection({ safari }: { safari: SafariRecord | null }) {
  const acc = asArray<AccommodationOption>(safari?.accommodation_options);
  const rows: Array<AccommodationOption | null> =
    acc.length > 0 ? acc : [null, null, null];

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Accommodation Options</h3>
      {rows.map((item, i) => (
        <div key={i} className="mb-3 grid gap-2 sm:grid-cols-2">
          <input
            name={`acc_${i + 1}_tier`}
            defaultValue={item?.tier}
            placeholder="Luxury / Mid-range / Budget"
            className="rounded-md border-gray-300 text-sm"
          />
          <input
            name={`acc_${i + 1}_options`}
            defaultValue={item?.options}
            placeholder="Lodge options..."
            className="rounded-md border-gray-300 text-sm"
          />
        </div>
      ))}
    </div>
  );
}

// Highlights Section
function HighlightsSection({ safari }: { safari: SafariRecord | null }) {
  const highlights = asArray<string>(safari?.highlights);
  return (
    <div className="border-t pt-6">
      <ListEditor
        name="highlights"
        label="Highlights"
        values={highlights}
        placeholder="Scenic drive through western Uganda"
        emptyRows={4}
      />
    </div>
  );
}

// Included/Excluded Section
function IncludedExcludedSection({ safari }: { safari: SafariRecord | null }) {
  const included = asArray<string>(safari?.included);
  const excluded = asArray<string>(safari?.excluded);

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Inclusions & Exclusions</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <ListEditor
          name="included"
          label="Included"
          values={included}
          placeholder="Private 4x4 safari vehicle"
          emptyRows={4}
        />
        <ListEditor
          name="excluded"
          label="Excluded"
          values={excluded}
          placeholder="International flights"
          emptyRows={4}
        />
      </div>
    </div>
  );
}

// FAQs Section
function FAQsSection({ safari }: { safari: SafariRecord | null }) {
  const faqs = asArray<SafariFaq>(safari?.faq);
  const rows: Array<SafariFaq | null> =
    faqs.length > 0 ? faqs : [null, null, null];

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">FAQs</h3>
      {rows.map((faq, i) => (
        <div key={i} className="mb-4 grid gap-2">
          <input
            name={`faq_${i + 1}_question`}
            defaultValue={faq?.question}
            placeholder="Question"
            className="rounded-md border-gray-300 text-sm"
          />
          <textarea
            name={`faq_${i + 1}_answer`}
            defaultValue={faq?.answer}
            placeholder="Answer"
            rows={2}
            className="rounded-md border-gray-300 text-sm"
          />
        </div>
      ))}
    </div>
  );
}

// SEO Fields
function SEOFields({ safari }: { safari: SafariRecord | null }) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={fieldValue(safari?.meta_title)}
            placeholder="SEO page title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={fieldValue(safari?.meta_description)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Permit Rate Warning</span>
          <input
            name="permit_rate_warning"
            defaultValue={fieldValue(safari?.permit_rate_warning)}
            placeholder="Optional warning about permit rates"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}
