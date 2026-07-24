import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminSafariById } from "@/lib/cms-data";
import { upsertSafariPackage, uploadMedia, deleteEntity } from "@/lib/server/cms-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Safari Package",
};

export default async function SafariEditPage({ params }: Props) {
  const { id } = await params;
  // Fetch data with admin client (bypasses RLS)
  const safari = await getAdminSafariById(id);

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
          <button
            form="safari-form"
            formAction={`/admin/safaris/actions/delete`}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            onClick={(e) => {
              if (!confirm("Delete this safari package?")) e.preventDefault();
            }}
          >
            Delete
          </button>
        )}
      </div>

      <form
        id="safari-form"
        action={upsertSafariPackage}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={safari?.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              required
              name="slug"
              defaultValue={safari?.slug}
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
            defaultValue={safari?.title}
            placeholder="3 Days Gorilla Tracking Safari"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Duration</span>
            <input
              name="duration"
              defaultValue={safari?.duration}
              placeholder="3 days"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Route</span>
            <input
              name="route"
              defaultValue={safari?.route}
              placeholder="Entebbe - Bwindi - Entebbe"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Price (USD)</span>
            <input
              type="number"
              name="price_from"
              defaultValue={safari?.price_from || ""}
              placeholder="1250"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Summary</span>
          <textarea
            name="summary"
            defaultValue={safari?.summary}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Featured Image URL</span>
          <input
            type="url"
            name="featured_image_url"
            defaultValue={safari?.featured_image_url}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <ImageUploadSection safariId={id} safari={safari} />

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

// Image Upload Section
function ImageUploadSection({ safariId, safari }: { safariId: string; safari: any }) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Image Upload</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <form action={uploadMedia} encType="multipart/form-data" className="space-y-3">
          <input type="hidden" name="entity_type" value="safari_packages" />
          <input type="hidden" name="entity_id" value={safariId} />
          <input type="hidden" name="alt_text" value={safari?.title || "Safari image"} />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="block w-full text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
          >
            Upload Image
          </button>
        </form>
        {safari?.featured_image_url && (
          <div>
            <img
              src={safari.featured_image_url}
              alt="Featured"
              className="h-32 w-full rounded-md object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Itinerary Section
function ItinerarySection({ safari }: { safari: any }) {
  const itinerary = safari?.itinerary || [];
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Day-by-Day Itinerary</h3>
      <input type="hidden" name="days_count" value={itinerary.length || 3} />
      {(itinerary.length > 0 ? itinerary : [null, null, null]).map((day: any, i: number) => (
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
function AccommodationsSection({ safari }: { safari: any }) {
  const acc = safari?.accommodation_options || [];
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Accommodation Options</h3>
      {acc.length > 0 ? acc : [null, null, null].map((_: any, i: number) => (
        <div key={i} className="mb-3 grid gap-2 sm:grid-cols-2">
          <input
            name={`acc_${i + 1}_tier`}
            defaultValue={acc[i]?.tier}
            placeholder="Luxury / Mid-range / Budget"
            className="rounded-md border-gray-300 text-sm"
          />
          <input
            name={`acc_${i + 1}_options`}
            defaultValue={acc[i]?.options}
            placeholder="Lodge options..."
            className="rounded-md border-gray-300 text-sm"
          />
        </div>
      ))}
    </div>
  );
}

// Highlights Section
function HighlightsSection({ safari }: { safari: any }) {
  const highlights = safari?.highlights || [];
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Highlights</h3>
      <textarea
        name="highlights"
        defaultValue={JSON.stringify(highlights)}
        rows={4}
        placeholder='["Highlight 1", "Highlight 2"]'
        className="block w-full rounded-md border-gray-300 font-mono text-sm"
      />
    </div>
  );
}

// Included/Excluded Section
function IncludedExcludedSection({ safari }: { safari: any }) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Inclusions & Exclusions</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Included (JSON array)</span>
          <textarea
            name="included"
            defaultValue={JSON.stringify(safari?.included || [])}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Excluded (JSON array)</span>
          <textarea
            name="excluded"
            defaultValue={JSON.stringify(safari?.excluded || [])}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
          />
        </label>
      </div>
    </div>
  );
}

// FAQs Section
function FAQsSection({ safari }: { safari: any }) {
  const faqs = safari?.faq || [];
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">FAQs</h3>
      {faqs.length > 0 ? faqs : [null, null, null].map((_: any, i: number) => (
        <div key={i} className="mb-4 grid gap-2">
          <input
            name={`faq_${i + 1}_question`}
            defaultValue={faqs[i]?.question}
            placeholder="Question"
            className="rounded-md border-gray-300 text-sm"
          />
          <textarea
            name={`faq_${i + 1}_answer`}
            defaultValue={faqs[i]?.answer}
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
function SEOFields({ safari }: { safari: any }) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={safari?.meta_title}
            placeholder="SEO page title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={safari?.meta_description}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Permit Rate Warning</span>
          <input
            name="permit_rate_warning"
            defaultValue={safari?.permit_rate_warning}
            placeholder="Optional warning about permit rates"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}