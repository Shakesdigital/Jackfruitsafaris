export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminPageContentSections } from "@/lib/cms-data";

export const metadata = {
  title: "Page Content Sections",
};

const CORE_LANDING_PAGES = [
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

type PageContentSection = {
  id: string;
  page_slug: string;
  section_key: string;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  order_index: number;
  status: string;
  updated_at: string;
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PageContentSectionsPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const selectedPage = page || "";
  const sections = await getAdminPageContentSections(selectedPage || undefined) as PageContentSection[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Content Sections</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Edit the non-hero content components used by the landing pages.
            Hero content stays in Page Heroes; these rows mirror the rest of each frontend page.
          </p>
        </div>
        <Link
          href={`/admin/pages/content/new${selectedPage ? `?page=${encodeURIComponent(selectedPage)}` : ""}`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          New Section
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/pages/content"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            selectedPage ? "bg-white text-gray-700 ring-1 ring-gray-200" : "bg-gray-900 text-white"
          }`}
        >
          All pages
        </Link>
        {CORE_LANDING_PAGES.map((landingPage) => (
          <Link
            key={landingPage.slug}
            href={`/admin/pages/content?page=${encodeURIComponent(landingPage.slug)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              selectedPage === landingPage.slug
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200"
            }`}
          >
            {landingPage.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Status
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sections.map((section) => (
              <tr key={section.id}>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">
                  {section.page_slug}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {section.title || section.section_key}
                  </p>
                  <p className="mt-1 font-mono text-xs text-gray-500">
                    {section.section_key}
                  </p>
                  {section.subtitle && (
                    <p className="mt-1 text-xs text-gray-500">{section.subtitle}</p>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">
                  {section.section_type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {section.order_index}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      section.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {section.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/pages/content/${section.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!sections.length && (
              <tr>
                <td className="px-6 py-8 text-sm text-gray-500" colSpan={6}>
                  No page content sections found. Run the latest Supabase migration to seed them.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
