export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminTravelGuideArticles } from "@/lib/cms-data";

type TravelGuideArticle = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  author: string | null;
  status: string;
  order_column: number;
  published_at: string | null;
  updated_at: string;
};

export const metadata = {
  title: "Travel Insights",
};

export default async function TravelInsightsPage() {
  const articles = await getAdminTravelGuideArticles();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Travel Insights</h1>
        <Link
          href="/admin/travel-insights/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          New Article
        </Link>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Manage the blog articles shown on the Travel Guide page. Each published
        article renders as a card on the public listing and gets its own detail
        page at /travel-guide/[slug].
      </div>

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
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order
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
            {articles?.map((article: any) => (
              <tr key={article.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {article.title}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">
                  {article.slug}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {article.category || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {article.order_column}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      article.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/travel-insights/${article.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!articles?.length && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  No Travel Insights articles yet.{" "}
                  <Link href="/admin/travel-insights/new" className="text-blue-600">
                    Create one
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
