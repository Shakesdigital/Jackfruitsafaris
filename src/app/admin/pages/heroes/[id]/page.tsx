export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminPageHeroes } from "@/lib/cms-data";
import { ImageUploadField } from "@/app/admin/_components/cms-form-controls";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ slug?: string }>;
};

type PageHero = {
  id?: string;
  page_slug?: string;
  eyebrow?: string | null;
  title?: string | null;
  intro?: string | null;
  background_image?: string | null;
  content?: Record<string, string | null | undefined>;
  status?: string | null;
};

export const metadata: Metadata = {
  title: "Edit Page Hero",
};

export default async function PageHeroEdit({ params, searchParams }: Props) {
  const { id } = await params;
  const { slug } = await searchParams;
  const isNew = id === "new";

  const heroes = await getAdminPageHeroes();
  const hero = isNew
    ? null
    : heroes?.find((pageHero: PageHero) => pageHero.id === id);

  const pageSlug = hero?.page_slug || slug || "/";
  const aboutContent = hero?.content || {};

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
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
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

        <ImageUploadField
          name="background_image"
          fileName="background_image_file"
          label="Background Image"
          currentUrl={hero?.background_image}
        />

        {pageSlug === "/about" && (
          <div className="border-t pt-6">
            <h2 className="mb-4 text-lg font-medium">About Page Content</h2>
            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Why Jackfruit Title</span>
                <input
                  name="why_jackfruit_title"
                  defaultValue={aboutContent.why_jackfruit_title}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Why Jackfruit Body</span>
                <textarea
                  name="why_jackfruit_body"
                  defaultValue={aboutContent.why_jackfruit_body}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Where Jackfruit Operates Title</span>
                <input
                  name="where_operates_title"
                  defaultValue={aboutContent.where_operates_title}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Where Jackfruit Operates Body</span>
                <textarea
                  name="where_operates_body"
                  defaultValue={aboutContent.where_operates_body}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Guiding Style Title</span>
                <input
                  name="guiding_style_title"
                  defaultValue={aboutContent.guiding_style_title}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Guiding Style Body</span>
                <textarea
                  name="guiding_style_body"
                  defaultValue={aboutContent.guiding_style_body}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Services Section Title</span>
                <input
                  name="services_title"
                  defaultValue={aboutContent.services_title}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Services Section Intro</span>
                <textarea
                  name="services_intro"
                  defaultValue={aboutContent.services_intro}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
            </div>
          </div>
        )}

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
