import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Page",
};

export default async function PageEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  const isNew = id === "new";

  if (!page && !isNew) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Page" : "Edit Page"}
        </h1>
        {!isNew && (
          <button
            form="page-form"
            formAction={`/admin/pages/actions/delete`}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            onClick={(e) => {
              if (!confirm("Delete this page?")) e.preventDefault();
            }}
          >
            Delete
          </button>
        )}
      </div>

      <form
        id="page-form"
        action="/admin/pages/actions/upsert"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={page?.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              required
              name="slug"
              defaultValue={page?.slug}
              placeholder="about (used in URL)"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={page?.status || "draft"}
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
            defaultValue={page?.title}
            placeholder="Page title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Summary</span>
          <textarea
            name="summary"
            defaultValue={page?.summary}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <SEOFields page={page} />

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/pages"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Page
          </button>
        </div>
      </form>
    </div>
  );
}

function SEOFields({ page }: { page: any }) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={page?.meta_title}
            placeholder="SEO page title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={page?.meta_description}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}