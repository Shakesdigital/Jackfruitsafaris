export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminTrustItems } from "@/lib/cms-data";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Trust Item",
};

export default async function TrustItemEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const item = isNew ? null : await getAdminTrustItems().then(items => items.find((i: any) => i.id === id));

  if (!item && !isNew) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Trust Item" : "Edit Trust Item"}
        </h1>
      </div>

      <form
        action="/admin/homepage/trust-items/actions/upsert"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={item?.id} />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Trust Badge Text</span>
          <textarea
            required
            name="text"
            defaultValue={item?.text}
            rows={2}
            placeholder="2024 Tripadvisor Travelers Choice Award"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Display Order</span>
            <input
              type="number"
              name="order_index"
              defaultValue={item?.order_index ?? 0}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={item?.status || "published"}
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
            href="/admin/homepage/trust-items"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
}