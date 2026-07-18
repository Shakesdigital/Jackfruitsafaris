export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Safari = {
  id: string;
  slug: string;
  title: string;
  duration: string | null;
  status: string;
  updated_at: string;
};

export const metadata = {
  title: "Safari Packages",
};

export default async function SafarisPage() {
  const supabase = await createClient();

  const { data: safaris } = await supabase
    .from("safari_packages")
    .select("id, slug, title, duration, status, updated_at")
    .order("updated_at", { ascending: false }) as { data: Safari[] | null };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Safari Packages</h1>
        <Link
          href="/admin/safaris/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          New Safari
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Duration
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
            {safaris?.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {s.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.duration}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      s.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/safaris/${s.id}`}
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