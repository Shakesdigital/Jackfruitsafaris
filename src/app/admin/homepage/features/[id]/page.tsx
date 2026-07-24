export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminFeatures } from "@/lib/cms-data";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Feature",
};

const ICON_OPTIONS = [
  { value: "check", label: "Check" },
  { value: "binoculars", label: "Binoculars" },
  { value: "calendar", label: "Calendar" },
  { value: "camera", label: "Camera" },
  { value: "car", label: "Car" },
  { value: "cash", label: "Cash" },
  { value: "compass", label: "Compass" },
  { value: "heart", label: "Heart" },
  { value: "map", label: "Map" },
  { value: "message", label: "Message" },
  { value: "mountain", label: "Mountain" },
  { value: "shield", label: "Shield" },
  { value: "sparkles", label: "Sparkles" },
  { value: "star", label: "Star" },
  { value: "trees", label: "Trees" },
  { value: "waves", label: "Waves" },
];

export default async function FeatureEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const feature = isNew ? null : await getAdminFeatures().then(f => f.find((feat: any) => feat.id === id));

  if (!feature && !isNew) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Feature" : "Edit Feature"}
        </h1>
      </div>

      <form
        action="/admin/homepage/features/actions/upsert"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={feature?.id} />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Feature Text</span>
          <textarea
            required
            name="text"
            defaultValue={feature?.text}
            rows={2}
            placeholder="Private, flexible trips"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Icon</span>
          <select
            name="icon_name"
            defaultValue={feature?.icon_name || "check"}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Display Order</span>
            <input
              type="number"
              name="order_index"
              defaultValue={feature?.order_index ?? 0}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={feature?.status || "published"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/homepage/features"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Feature
          </button>
        </div>
      </form>
    </div>
  );
}