import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminReviewByIdResult } from "@/lib/cms-data";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import { AdminLoadError } from "@/app/admin/_components/admin-load-error";
import { ImageUploadField } from "@/app/admin/_components/cms-form-controls";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Review",
};

export default async function ReviewEditPage({ params }: Props) {
  const { id } = await params;
  // Fetch data with admin client (bypasses RLS)
  const reviewResult = await getAdminReviewByIdResult(id);
  const review = reviewResult.data;

  if (reviewResult.error) {
    return (
      <AdminLoadError
        title="Review could not be loaded"
        message={reviewResult.error}
        code={reviewResult.code}
        backHref="/admin/reviews"
        backLabel="Back to reviews"
      />
    );
  }

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
          <DeleteButton
            form="review-form"
            formAction={`/admin/reviews/actions`}
            value={review?.id ?? ""}
            confirmMessage="Delete this review?"
          >
            Delete
          </DeleteButton>
        )}
      </div>

      <form
        id="review-form"
        action="/admin/reviews/actions"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
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

        <ImageUploadField
          name="image_url"
          fileName="image_file"
          label="Guest Image"
          currentUrl={review?.image_url}
        />

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
