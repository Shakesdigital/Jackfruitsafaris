export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminTravelGuideArticleByIdResult } from "@/lib/cms-data";
import { AdminLoadError } from "@/app/admin/_components/admin-load-error";
import { DeleteButton } from "@/app/admin/_components/delete-button";
import {
  ImageUploadField,
  WysiwygEditor,
} from "@/app/admin/_components/cms-form-controls";

type Props = {
  params: Promise<{ id: string }>;
};

type TravelGuideArticle = {
  id?: string;
  slug?: string | null;
  title?: string | null;
  category?: string | null;
  author?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featured_image_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_image_url?: string | null;
  order_column?: number | null;
  status?: string | null;
  published_at?: string | null;
};

export const metadata: Metadata = {
  title: "Edit Travel Insight",
};

export default async function TravelInsightEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const articleResult = await getAdminTravelGuideArticleByIdResult(id);
  const article = articleResult.data as TravelGuideArticle | null;

  if (articleResult.error) {
    return (
      <AdminLoadError
        title="Travel Insight could not be loaded"
        message={articleResult.error}
        code={articleResult.code}
        backHref="/admin/travel-insights"
        backLabel="Back to Travel Insights"
      />
    );
  }

  if (!article && !isNew) {
    notFound();
  }

  const fieldValue = (value: string | number | null | undefined) =>
    value == null ? "" : String(value);

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Travel Insight" : "Edit Travel Insight"}
        </h1>
        {!isNew && (
          <DeleteButton
            form="travel-insight-form"
            formAction="/admin/travel-insights/actions"
            value={article?.id ?? ""}
            confirmMessage="Delete this Travel Insight article?"
          >
            Delete
          </DeleteButton>
        )}
      </div>

      <div className="mb-6 text-sm text-gray-500">
        Published articles appear as cards on the /travel-guide page and get
        their own detail page at /travel-guide/[slug]. Use the WYSIWYG editor
        below to write the body and insert images anywhere in the flow.
      </div>

      <form
        id="travel-insight-form"
        action="/admin/travel-insights/actions"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={article?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              required
              name="slug"
              defaultValue={fieldValue(article?.slug)}
              placeholder="best-time-to-visit-uganda"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={article?.status || "draft"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            required
            name="title"
            defaultValue={fieldValue(article?.title)}
            placeholder="Best Time to Visit Uganda for Safari and Gorilla Trekking"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <input
              name="category"
              defaultValue={fieldValue(article?.category)}
              placeholder="e.g. Planning, Wildlife, Culture"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Author</span>
            <input
              name="author"
              defaultValue={fieldValue(article?.author)}
              placeholder="Jackfruit Safaris Team"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Display Order</span>
            <input
              type="number"
              name="order_column"
              defaultValue={String(article?.order_column ?? 0)}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <ImageUploadField
          name="featured_image_url"
          fileName="featured_image_file"
          label="Featured Image"
          currentUrl={article?.featured_image_url}
        />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Excerpt</span>
          <textarea
            name="excerpt"
            defaultValue={fieldValue(article?.excerpt)}
            rows={3}
            placeholder="A short summary shown on the listing card..."
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <WysiwygEditor
          name="content"
          label="Article Body"
          initialValue={fieldValue(article?.content)}
          placeholder="Write your article content here. Use the toolbar to add bold, headings, lists, links, and images..."
          minHeight={320}
        />

        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-medium">SEO</h3>
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Meta Title</span>
              <input
                name="meta_title"
                defaultValue={fieldValue(article?.meta_title)}
                placeholder="SEO page title"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Meta Description</span>
              <textarea
                name="meta_description"
                defaultValue={fieldValue(article?.meta_description)}
                rows={2}
                placeholder="SEO meta description"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>
            <ImageUploadField
              name="meta_image_url"
              fileName="meta_image_file"
              label="Meta Image"
              currentUrl={article?.meta_image_url}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/travel-insights"
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
