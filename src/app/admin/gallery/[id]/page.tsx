import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminGalleryMediaByIdResult, getAdminSafariPackagesForGallery } from "@/lib/cms-data";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { ImageUploadField } from "@/app/admin/_components/cms-form-controls";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Edit Gallery Image",
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ safari?: string }>;
};

type GalleryImage = {
  id?: string;
  media_url?: string | null;
  media_type?: string;
  alt_text?: string | null;
  caption?: string | null;
  photographer?: string | null;
  safari_package_id?: string | null;
  order_column?: number;
  status?: string;
  permission_status?: string;
};

type SafariOption = {
  id: string;
  slug: string;
  title: string;
};

function fieldValue(value: string | number | null | undefined) {
  return value ?? "";
}

export default async function GalleryEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { safari: safariParam } = await searchParams;
  const isNew = id === "new";

  const result = await getAdminGalleryMediaByIdResult(
    isNew ? "__new__" : id,
  );
  const safari = result.data as GalleryImage | null;
  const safaris = await getAdminSafariPackagesForGallery();

  // For "new" records, result is null and we proceed; for existing, check error
  if (result.error && !isNew) {
    return (
      <div className="max-w-3xl rounded-lg border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-semibold text-red-950">Gallery image could not be loaded</h1>
        <p className="mt-3 text-sm leading-6 text-red-900">{result.error}</p>
        <Link
          href="/admin/gallery"
          className="mt-5 inline-flex rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
        >
          Back to gallery
        </Link>
      </div>
    );
  }

  if (!safari && !isNew) {
    notFound();
  }

  const selectedSafari = safari?.safari_package_id || safariParam || "";

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Gallery Image" : "Edit Gallery Image"}
        </h1>
        {!isNew && (
          <form action="/admin/gallery/actions" method="post">
            <DeleteButton
              form="delete-form"
              formAction="/admin/gallery/actions"
              value={safari?.id ?? ""}
              confirmMessage="Delete this gallery image?"
            />
          </form>
        )}
      </div>

      <form
        id="gallery-form"
        action="/admin/gallery/actions"
        method="post"
        encType="multipart/form-data"
        className="space-y-6"
      >
        <input type="hidden" name="id" value={safari?.id ?? ""} />

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Image</h2>

          <ImageUploadField
            name="media_url"
            fileName="media_file"
            label="Image URL"
            currentUrl={safari?.media_url}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Details</h2>

          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Alt Text</span>
              <input
                required
                name="alt_text"
                defaultValue={fieldValue(safari?.alt_text)}
                placeholder="Mountain gorilla in Bwindi forest"
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Caption</span>
              <input
                name="caption"
                defaultValue={fieldValue(safari?.caption)}
                placeholder="Optional caption shown in the gallery"
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Photographer</span>
              <input
                name="photographer"
                defaultValue={fieldValue(safari?.photographer)}
                placeholder="Optional"
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Linking & Ordering</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Safari Package</span>
              <select
                name="safari_package_id"
                defaultValue={selectedSafari}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              >
                <option value="">— Not linked to a safari —</option>
                {safaris.map((s: SafariOption) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.slug})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Order Index</span>
              <input
                type="number"
                name="order_index"
                defaultValue={fieldValue(safari?.order_column)}
                min="0"
                placeholder="0"
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Publishing</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <select
                name="status"
                defaultValue={safari?.status || "published"}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Permission</span>
              <select
                name="permission_status"
                defaultValue={safari?.permission_status || "approved"}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              >
                <option value="needs_review">Needs Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Type</span>
              <select
                name="media_type"
                defaultValue={safari?.media_type || "image"}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/gallery"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            {isNew ? "Create gallery image" : "Save gallery image"}
          </button>
        </div>
      </form>
    </div>
  );
}
