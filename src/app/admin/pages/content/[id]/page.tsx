export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLoadError } from "@/app/admin/_components/admin-load-error";
import { PageContentEditor } from "@/app/admin/_components/page-content-editor";
import { getAdminPageContentSectionByIdResult } from "@/lib/cms-data";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

type PageContentSection = {
  id?: string;
  page_slug?: string | null;
  section_key?: string | null;
  section_type?: string | null;
  title?: string | null;
  subtitle?: string | null;
  content?: Record<string, unknown> | null;
  order_index?: number | null;
  status?: string | null;
};

export const metadata: Metadata = {
  title: "Edit Page Content Section",
};

const pageOptions = [
  { slug: "/", label: "Home" },
  { slug: "/safaris", label: "Safaris" },
  { slug: "/destinations", label: "Destinations" },
  { slug: "/experiences", label: "Experiences" },
  { slug: "/reviews", label: "Reviews" },
  { slug: "/about", label: "About" },
  { slug: "/travel-guide", label: "Travel Guide" },
  { slug: "/contact", label: "Contact" },
  { slug: "/request-quote", label: "Request Quote" },
  { slug: "/transport/airport-transfers", label: "Airport Transfers" },
];

export default async function PageContentSectionEdit({ params, searchParams }: Props) {
  const { id } = await params;
  const { page } = await searchParams;
  const isNew = id === "new";

  const sectionResult = await getAdminPageContentSectionByIdResult(id);
  const section = sectionResult.data as PageContentSection | null;

  if (sectionResult.error) {
    return (
      <AdminLoadError
        title="Page content section could not be loaded"
        message={sectionResult.error}
        code={sectionResult.code}
        backHref="/admin/pages/content"
        backLabel="Back to page content"
      />
    );
  }

  if (!section && !isNew) {
    notFound();
  }

  const pageSlug = section?.page_slug || page || "/";
  const contentValue = section?.content || {};

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Page Content Section" : "Edit Page Content Section"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage one non-hero component for a landing page.
        </p>
      </div>

      <form
        action="/admin/pages/content/actions/upsert"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={section?.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Page</span>
            <select
              required
              name="page_slug"
              defaultValue={pageSlug}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              {pageOptions.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label} ({option.slug})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={section?.status || "published"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_0.7fr_0.35fr]">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Section Key</span>
            <input
              required
              name="section_key"
              defaultValue={section?.section_key || ""}
              placeholder="featured_safaris"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Section Type</span>
            <input
              required
              name="section_type"
              defaultValue={section?.section_type || ""}
              placeholder="entity_card_grid"
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Order</span>
            <input
              name="order_index"
              type="number"
              defaultValue={section?.order_index ?? 0}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            name="title"
            defaultValue={section?.title || ""}
            placeholder="Visible heading or internal label"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Subtitle / Eyebrow</span>
          <input
            name="subtitle"
            defaultValue={section?.subtitle || ""}
            placeholder="Small label, eyebrow, or admin note"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="border-t pt-6">
          <PageContentEditor initialContent={contentValue} />
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            href={`/admin/pages/content?page=${encodeURIComponent(pageSlug)}`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Section
          </button>
        </div>
      </form>
    </div>
  );
}
