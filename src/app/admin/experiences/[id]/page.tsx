import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminExperienceByIdResult } from "@/lib/cms-data";
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
  title: "Edit Experience",
};

export default async function ExperienceEditPage({ params }: Props) {
  const { id } = await params;
  // Fetch data with admin client (bypasses RLS)
  const experienceResult = await getAdminExperienceByIdResult(id);
  const experience = experienceResult.data;

  if (experienceResult.error) {
    return (
      <AdminLoadError
        title="Experience could not be loaded"
        message={experienceResult.error}
        code={experienceResult.code}
        backHref="/admin/experiences"
        backLabel="Back to experiences"
      />
    );
  }

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
          <DeleteButton
            form="experience-form"
            formAction={`/admin/experiences/actions`}
            value={experience?.id ?? ""}
            confirmMessage="Delete this experience?"
          >
            Delete
          </DeleteButton>
        )}
      </div>

      <form
        id="experience-form"
        action="/admin/experiences/actions"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Duration</span>
            <input
              name="duration"
              defaultValue={experience?.duration}
              placeholder="e.g. 3 days, Half-day"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Price From (USD)</span>
            <input
              type="number"
              name="price_from"
              defaultValue={experience?.price_from ?? ""}
              placeholder="e.g. 150"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">CTA Label</span>
            <input
              name="cta_label"
              defaultValue={experience?.cta_label}
              placeholder="e.g. Book Now"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">CTA URL</span>
            <input
              name="cta_url"
              defaultValue={experience?.cta_url}
              placeholder="/request-quote"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
            <span className="text-sm font-medium text-gray-700">Icon</span>
            <select
              name="icon"
              defaultValue={experience?.icon || ""}
              className="mt-1 block w-full rounded-md border-gray-300 text-sm"
            >
              <option value="">— Default (from content) —</option>
              <option value="binoculars">Binoculars</option>
              <option value="calendar">Calendar</option>
              <option value="camera">Camera</option>
              <option value="car">Car</option>
              <option value="cash">Cash</option>
              <option value="compass">Compass</option>
              <option value="heart">Heart</option>
              <option value="map">Map</option>
              <option value="message">Message</option>
              <option value="mountain">Mountain</option>
              <option value="shield">Shield</option>
              <option value="sparkles">Sparkles</option>
              <option value="star">Star</option>
              <option value="trees">Trees</option>
              <option value="waves">Waves</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Order Column</span>
          <input
            type="number"
            name="order_column"
            defaultValue={experience?.order_column ?? 0}
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
          <span className="text-sm font-medium text-gray-700">Safety Notes</span>
          <textarea
            name="safety_notes"
            defaultValue={experience?.safety_notes}
            rows={3}
            placeholder="e.g. Gorilla trekking requires fitness for 2-7 hour hikes at altitude..."
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <ImageUploadField
          name="featured_image_url"
          fileName="featured_image_file"
          label="Featured Image"
          currentUrl={experience?.featured_image_url}
        />

        <ListEditor
          name="bullets"
          label="Included (Bullet Points)"
          values={experience?.included || []}
          placeholder="Permit guidance and route planning"
          emptyRows={4}
        />

        <ListEditor
          name="excluded"
          label="Excluded"
          values={experience?.excluded || []}
          placeholder="e.g. International flights, Travel insurance"
          emptyRows={2}
        />

        <SEOFields experience={experience} />

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/experiences"
            className="rounded-md border border-gray-300 min-h-[44px] px-4 py-3 text-sm hover:bg-gray-50 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 min-h-[44px] px-4 py-3 text-sm text-white hover:bg-blue-700 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Save Experience
          </button>
        </div>
      </form>
    </div>
  );
}

function SEOFields({
  experience,
}: {
  experience: Record<string, string | null | undefined> | null;
}) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={experience?.meta_title ?? ""}
            placeholder="Experience SEO title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={experience?.meta_description ?? ""}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}
