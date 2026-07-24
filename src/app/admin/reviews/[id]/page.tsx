import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminReviewById } from "@/lib/cms-data";
import { upsertReview, uploadMedia } from "@/lib/server/cms-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Review",
};

export default async function ReviewEditPage({ params }: Props) {
  const { id } = await params;
  // Fetch data with admin client (bypasses RLS)
  const review = await getAdminReviewById(id);

  if (!review && id !== "new") {
    notFound();
  }

  const isNew = id === "new";

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Review" : "Edit Review"}
        </h1>
        {!isNew && (
          <button
            form="review-form"
            formAction={`/admin/reviews/actions/delete`}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            onClick={(e) => {
              if (!confirm("Delete this review?")) e.preventDefault();
            }}
          >
            Delete
          </button>
        )}
      </div>

      <form
        id="review-form"
        action={upsertReview}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={review?.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Guest Name</span>
            <input
              required
              name="guest_name"
              defaultValue={review?.guest_name}
              placeholder="John Doe"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Country</span>
            <input
              name="country"
              defaultValue={review?.country}
              placeholder="United States"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Trip Type</span>
            <input
              required
              name="trip_type"
              defaultValue={review?.trip_type}
              placeholder="Gorilla trekking"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Rating</span>
            <select
              name="rating"
              defaultValue={review?.rating || 5}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Source</span>
            <input
              name="source"
              defaultValue={review?.source}
              placeholder="TripAdvisor, SafariBookings, etc."
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={review?.status || "draft"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Permission Status</span>
            <select
              name="permission_status"
              defaultValue={review?.permission_status || "needs_permission"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="needs_permission">Needs Permission</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Image URL (optional)</span>
          <input
            type="url"
            name="image_url"
            defaultValue={review?.image_url}
            placeholder="Guest photo URL"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Quote/Testimonial</span>
          <textarea
            required
            name="quote"
            defaultValue={review?.quote}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/reviews"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Review
          </button>
        </div>
      </form>
    </div>
  );
}