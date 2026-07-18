export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
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

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token");
  return token?.value;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                href="/admin/safaris"
                className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Safari Packages
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
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-end">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}