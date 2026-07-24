export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminQuickLinks } from "@/lib/cms-data";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Quick Link",
};

export default async function QuickLinkEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const link = isNew ? null : await getAdminQuickLinks().then(links => links.find((l: any) => l.id === id));

  if (!link && !isNew) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Quick Link" : "Edit Quick Link"}
        </h1>
      </div>

      <form
        action="/admin/homepage/quick-links/actions/upsert"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={link?.id} />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Label</span>
          <input
            required
            name="label"
            defaultValue={link?.label}
            placeholder="Gorilla Trekking"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">URL</span>
          <input
            required
            name="href"
            defaultValue={link?.href}
            placeholder="/experiences/gorilla-trekking"
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Display Order</span>
            <input
              type="number"
              name="order_index"
              defaultValue={link?.order_index ?? 0}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={link?.status || "published"}
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
            href="/admin/homepage/quick-links"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Link
          </button>
        </div>
      </form>
    </div>
  );
}