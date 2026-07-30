export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminPageHeroes, getAdminPages } from "@/lib/cms-data";

type Page = {
  id: string;
  slug: string;
  title: string;
  status: string;
  updated_at: string;
};

type PageHeroSummary = {
  id: string;
  page_slug: string;
  status: string;
};

export const metadata = {
  title: "Pages",
};

const CORE_LANDING_PAGES = [
  { slug: "/", cmsSlug: "home", label: "Home", publicHref: "/" },
  { slug: "/safaris", cmsSlug: "safaris", label: "Safaris", publicHref: "/safaris" },
  { slug: "/destinations", cmsSlug: "destinations", label: "Destinations", publicHref: "/destinations" },
  { slug: "/experiences", cmsSlug: "experiences", label: "Experiences", publicHref: "/experiences" },
  { slug: "/reviews", cmsSlug: "reviews", label: "Reviews", publicHref: "/reviews" },
  { slug: "/about", cmsSlug: "about", label: "About", publicHref: "/about" },
  { slug: "/travel-guide", cmsSlug: "travel-guide", label: "Travel Guide", publicHref: "/travel-guide" },
];

export default async function PagesPage() {
  const [pages, heroes] = await Promise.all([getAdminPages(), getAdminPageHeroes()]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/pages/heroes"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Page Heroes
          </Link>
          <Link
            href="/admin/pages/content"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Page Content
          </Link>
          <Link
            href="/admin/pages/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            New Page
          </Link>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Main Landing Pages
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CORE_LANDING_PAGES.map((page) => {
            const cmsPage = pages?.find((item: Page) => item.slug === page.cmsSlug);
            const hero = heroes?.find(
              (item: PageHeroSummary) => item.page_slug === page.slug,
            );
            return (
              <div key={page.slug} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{page.label}</h3>
                    <p className="mt-1 font-mono text-xs text-gray-500">
                      {page.publicHref}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      cmsPage?.status === "published" || hero?.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {cmsPage?.status || hero?.status || "not seeded"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {cmsPage && (
                    <Link
                      href={`/admin/pages/${cmsPage.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit Page Details
                    </Link>
                  )}
                  <Link
                    href={`/admin/pages/heroes/${hero ? hero.id : "new"}?slug=${page.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {hero ? "Edit Hero" : "Create Hero"}
                  </Link>
                  <Link
                    href={`/admin/pages/content?page=${encodeURIComponent(page.slug)}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit Content
                  </Link>
                  <Link
                    href={page.publicHref}
                    className="text-gray-600 hover:underline"
                  >
                    View Frontend
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Updated
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pages?.map((page: Page) => (
              <tr key={page.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {page.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  /{page.slug}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      page.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(page.updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
