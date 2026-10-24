import Link from "next/link";
import { getAdminTeamMembers } from "@/lib/cms-data";

type TeamMember = {
  id: string;
  slug: string;
  name: string;
  position: string | null;
  status: string;
  display_order: number;
  updated_at: string;
};

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const teamMembers = await getAdminTeamMembers();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <Link
          href="/admin/team/new"
          className="rounded-md bg-blue-600 px-4 py-3 text-sm text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        >
          New Team Member
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Position
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="relative px-3 sm:px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {teamMembers?.map((member: TeamMember) => (
              <tr key={member.id}>
                <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                  {member.name}
                </td>
                <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">
                  {member.position}
                </td>
                <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">
                  {member.display_order}
                </td>
                <td className="px-3 sm:px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      member.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/team/${member.id}`}
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
