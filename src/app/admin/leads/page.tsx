export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";

type Lead = {
  id: string;
  first_name: string;
  email: string;
  service_type: string | null;
  status: string;
  created_at: string;
};

export const metadata = {
  title: "Inquiry Leads",
};

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("inquiry_leads")
    .select("id, first_name, email, service_type, status, created_at")
    .order("created_at", { ascending: false }) as { data: Lead[] | null };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inquiry Leads</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Received
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {leads?.map((l) => (
              <tr key={l.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {l.first_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{l.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {l.service_type}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    {l.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(l.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}