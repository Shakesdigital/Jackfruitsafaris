export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminPageHeroes } from "@/lib/cms-data";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ slug?: string }>;
};

export const metadata: Metadata = {
  title: "Edit Page Hero",
};

export default async function PageHeroEdit({ params, searchParams }: Props) {
  const { id } = await params;
  const { slug } = await searchParams;
  const isNew = id === "new";

  const heroes = await getAdminPageHeroes();
  const hero = isNew ? null : heroes?.find((h: any) => h.id === id);

  const pageSlug = hero?.page_slug || slug || "/";

  if (!hero && !isNew) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Page Hero" : "Edit Page Hero"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">Page: {pageSlug}</p>
      </div>

      <form
        action="/admin/pages/heroes/actions/upsert"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={hero?.id} />
        <input type="hidden" name="page_slug" value={pageSlug} />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Eyebrow</span>
          <input
            name="eyebrow"
            defaultValue={hero?.eyebrow}
            placeholder="Page section label"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            name="title"
            defaultValue={hero?.title}
            placeholder="Page title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Intro Text</span>
          <textarea
            name="intro"
            defaultValue={hero?.intro}
            rows={3}
            placeholder="Page description/introduction"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Background Image URL</span>
          <input
            type="url"
            name="background_image"
            defaultValue={hero?.background_image}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={hero?.status || "published"}
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
            href="/admin/pages/heroes"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Hero
          </button>
        </div>
      </form>
    </div>
  );
}