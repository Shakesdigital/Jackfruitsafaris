export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Dashboard | Jackfruit Safaris",
  description: "Content Management System",
};

function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Sign out
      </button>
    </form>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pages"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Pages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/destinations"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                href="/admin/experiences"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Experiences
              </Link>
            </li>
            <li>
              <Link
                href="/admin/safaris"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Safari Packages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reviews"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/admin/travel-guides"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Travel Guides
              </Link>
            </li>
            <li>
              <Link
                href="/admin/faqs"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/admin/partners"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Partners
              </Link>
            </li>
            <li>
              <Link
                href="/admin/leads"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Inquiry Leads
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {profile?.full_name || user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}