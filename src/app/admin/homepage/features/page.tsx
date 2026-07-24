export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminFeatures } from "@/lib/cms-data";

export const metadata = {
  title: "Homepage Features",
};

const ICON_OPTIONS = [
  { value: "check", label: "Check" },
  { value: "binoculars", label: "Binoculars" },
  { value: "calendar", label: "Calendar" },
  { value: "camera", label: "Camera" },
  { value: "car", label: "Car" },
  { value: "cash", label: "Cash" },
  { value: "compass", label: "Compass" },
  { value: "heart", label: "Heart" },
  { value: "map", label: "Map" },
  { value: "message", label: "Message" },
  { value: "mountain", label: "Mountain" },
  { value: "shield", label: "Shield" },
  { value: "sparkles", label: "Sparkles" },
  { value: "star", label: "Star" },
  { value: "trees", label: "Trees" },
  { value: "waves", label: "Waves" },
];

export default async function FeaturesPage() {
  const features = await getAdminFeatures();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Why Uganda Features</h1>
        <Link
          href="/admin/homepage/features/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          New Feature
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Text
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Icon
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
            {features?.map((feature: any) => (
              <tr key={feature.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {feature.text}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {feature.icon_name}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      feature.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {feature.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/homepage/features/${feature.id}`}
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