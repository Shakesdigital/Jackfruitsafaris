export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminExperiences } from "@/lib/cms-data";

type Experience = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  status: string;
  updated_at: string;
};

export const metadata = {
  title: "Experiences",
};

export default async function ExperiencesPage() {
  const experiences = await getAdminExperiences();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
        <Link
          href="/admin/experiences/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          New Experience
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
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
            {experiences?.map((e: Experience) => (
              <tr key={e.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {e.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{e.category}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      e.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/experiences/${e.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!experiences?.length && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No experiences yet.{" "}
                  <Link href="/admin/experiences/new" className="text-blue-600">
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