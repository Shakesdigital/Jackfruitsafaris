import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminDestinationByIdResult } from "@/lib/cms-data";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { AdminLoadError } from "@/app/admin/_components/admin-load-error";
import {
  ImageUploadField,
  ListEditor,
} from "@/app/admin/_components/cms-form-controls";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Destination",
};

export default async function DestinationEditPage({ params }: Props) {
  const { id } = await params;
  const destinationResult = await getAdminDestinationByIdResult(id);
  const destination = destinationResult.data;

  if (destinationResult.error) {
    return (
      <AdminLoadError
        title="Destination could not be loaded"
        message={destinationResult.error}
        code={destinationResult.code}
        backHref="/admin/destinations"
        backLabel="Back to destinations"
      />
    );
  }

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
          <DeleteButton
            form="destination-form"
            formAction={`/admin/destinations/actions`}
            value={destination?.id ?? ""}
            confirmMessage="Delete this destination?"
          >
            Delete
          </DeleteButton>
        )}
      </div>

      <form
        id="destination-form"
        action="/admin/destinations/actions"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
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

        <ImageUploadField
          name="featured_image_url"
          fileName="featured_image_file"
          label="Featured Image"
          currentUrl={destination?.featured_image_url}
        />

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

          <ListEditor
            name="why_go"
            label="Why Go"
            values={destination?.why_go || []}
            placeholder="Mountain gorillas"
            emptyRows={3}
          />

          <ListEditor
            name="top_experiences"
            label="Top Experiences"
            values={destination?.top_experiences || []}
            placeholder="Gorilla trekking"
            emptyRows={2}
          />

          <ListEditor
            name="wildlife"
            label="Wildlife"
            values={destination?.wildlife || []}
            placeholder="Elephants"
            emptyRows={2}
          />
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

function SEOFields({
  destination,
}: {
  destination: Record<string, string | null | undefined> | null;
}) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={destination?.meta_title ?? ""}
            placeholder="Destination SEO title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={destination?.meta_description ?? ""}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}
