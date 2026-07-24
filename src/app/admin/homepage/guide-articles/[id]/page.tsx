export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminGuideArticles } from "@/lib/cms-data";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Guide Article",
};

export default async function GuideArticleEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const article = isNew ? null : await getAdminGuideArticles().then(a => a.find((art: any) => art.id === id));

  if (!article && !isNew) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Guide Article" : "Edit Guide Article"}
        </h1>
      </div>

      <form
        action="/admin/homepage/guide-articles/actions/upsert"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={article?.id} />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            required
            name="title"
            defaultValue={article?.title}
            placeholder="Best Time to Visit Uganda for Safari and Gorilla Trekking"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Display Order</span>
            <input
              type="number"
              name="order_index"
              defaultValue={article?.order_index ?? 0}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={article?.status || "published"}
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
            href="/admin/homepage/guide-articles"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Article
          </button>
        </div>
      </form>
    </div>
  );
}