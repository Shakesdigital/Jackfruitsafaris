import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminDestinationById } from "@/lib/cms-data";
import { upsertDestination, uploadMedia } from "@/lib/server/cms-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Destination",
};

export default async function DestinationEditPage({ params }: Props) {
  const { id } = await params;
  const destination = await getAdminDestinationById(id);

  if (!destination && id !== "new") {
    notFound();
  }

  const isNew = id === "new";

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Destination" : "Edit Destination"}
        </h1>
        {!isNew && (
          <button
            form="destination-form"
            formAction={`/admin/destinations/actions/delete`}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            onClick={(e) => {
              if (!confirm("Delete this destination?")) e.preventDefault();
            }}
          >
            Delete
          </button>
        )}
      </div>

      <form
        id="destination-form"
        action={upsertDestination}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={destination?.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              required
              name="slug"
              defaultValue={destination?.slug}
              placeholder="bwindi-impenetrable-national-park"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={destination?.status || "draft"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              required
              name="name"
              defaultValue={destination?.name}
              placeholder="Bwindi Impenetrable National Park"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Region</span>
            <input
              name="region"
              defaultValue={destination?.region}
              placeholder="Southwestern Uganda"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Recommended Nights</span>
            <input
              name="recommended_nights"
              defaultValue={destination?.recommended_nights}
              placeholder="2-3 nights"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Overview</span>
          <textarea
            name="overview"
            defaultValue={destination?.overview}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Featured Image URL</span>
          <input
            type="url"
            name="featured_image_url"
            defaultValue={destination?.featured_image_url}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Best Time to Visit</span>
            <textarea
              name="best_time"
              defaultValue={destination?.best_time}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Why Go (JSON array)</span>
            <textarea
              name="why_go"
              defaultValue={JSON.stringify(destination?.why_go || [])}
              rows={3}
              placeholder='["Mountain gorillas", "Rainforest trekking"]'
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Top Experiences (JSON array)</span>
            <textarea
              name="top_experiences"
              defaultValue={JSON.stringify(destination?.top_experiences || [])}
              rows={2}
              placeholder='["Gorilla trekking", "Community walks"]'
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Wildlife (JSON array)</span>
            <textarea
              name="wildlife"
              defaultValue={JSON.stringify(destination?.wildlife || [])}
              rows={2}
              placeholder='["Elephants", "Birds"]'
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>
        </div>

        <SEOFields destination={destination} />

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/destinations"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Destination
          </button>
        </div>
      </form>
    </div>
  );
}

function SEOFields({ destination }: { destination: any }) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={destination?.meta_title}
            placeholder="Destination SEO title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={destination?.meta_description}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}