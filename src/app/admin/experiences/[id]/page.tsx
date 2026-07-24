import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminExperienceById } from "@/lib/cms-data";
import { upsertExperience, uploadMedia } from "@/lib/server/cms-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Experience",
};

export default async function ExperienceEditPage({ params }: Props) {
  const { id } = await params;
  // Fetch data with admin client (bypasses RLS)
  const experience = await getAdminExperienceById(id);

  if (!experience && id !== "new") {
    notFound();
  }

  const isNew = id === "new";

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Experience" : "Edit Experience"}
        </h1>
        {!isNew && (
          <button
            form="experience-form"
            formAction={`/admin/experiences/actions/delete`}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            onClick={(e) => {
              if (!confirm("Delete this experience?")) e.preventDefault();
            }}
          >
            Delete
          </button>
        )}
      </div>

      <form
        id="experience-form"
        action={upsertExperience}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={experience?.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              required
              name="slug"
              defaultValue={experience?.slug}
              placeholder="gorilla-trekking"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={experience?.status || "draft"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              required
              name="name"
              defaultValue={experience?.name}
              placeholder="Gorilla Trekking in Uganda"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <input
              name="category"
              defaultValue={experience?.category}
              placeholder="Wildlife / Adventure / Culture"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Location</span>
          <input
            name="location"
            defaultValue={experience?.location}
            placeholder="Bwindi Impenetrable National Park"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Summary</span>
          <textarea
            name="summary"
            defaultValue={experience?.summary}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <textarea
            name="description"
            defaultValue={experience?.description}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Featured Image URL</span>
          <input
            type="url"
            name="featured_image_url"
            defaultValue={experience?.featured_image_url}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Bullet Points (JSON array)</span>
          <textarea
            name="bullets"
            defaultValue={JSON.stringify(experience?.included || [])}
            rows={4}
            placeholder='["Point 1", "Point 2", "Point 3"]'
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
          />
        </label>

        <SEOFields experience={experience} />

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/experiences"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Experience
          </button>
        </div>
      </form>
    </div>
  );
}

function SEOFields({ experience }: { experience: any }) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={experience?.meta_title}
            placeholder="Experience SEO title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={experience?.meta_description}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}