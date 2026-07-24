export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminPageHeroes } from "@/lib/cms-data";

export const metadata = {
  title: "Page Heroes",
};

const PAGES = [
  { slug: "/", label: "Homepage" },
  { slug: "/safaris", label: "Safaris" },
  { slug: "/destinations", label: "Destinations" },
  { slug: "/experiences", label: "Experiences" },
  { slug: "/about", label: "About" },
  { slug: "/reviews", label: "Reviews" },
  { slug: "/travel-guide", label: "Travel Guide" },
];

export default async function PageHeroesList() {
  const heroes = await getAdminPageHeroes();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Page Heroes</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {PAGES.map((page) => {
              const hero = heroes?.find((h: any) => h.page_slug === page.slug);
              return (
                <tr key={page.slug}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {page.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {hero?.title || <span className="text-gray-400 italic">Not set</span>}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {hero ? (
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          hero.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {hero.status}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/pages/heroes/${hero ? hero.id : "new"}?slug=${page.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {hero ? "Edit" : "Create"}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}