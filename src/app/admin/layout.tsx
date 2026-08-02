import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/lib/server/actions";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLoadingIndicator } from "@/app/admin/_components/admin-loading-indicator";
import { CmsQueryFeedback } from "@/app/admin/_components/cms-query-feedback";

export const metadata: Metadata = {
  title: "Admin Dashboard | Jackfruit Safaris",
  description: "Content Management System",
};

function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-fluid-sm text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] rounded"
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
  let session = null;
  let authError = null;

  try {
    const supabase = await createClient();

    // Verify session with Supabase (uses cookies internally via createClient)
    const result = await supabase.auth.getSession();
    session = result?.data?.session;
    authError = result?.error;
  } catch (err) {
    console.error("Admin layout auth error:", err);
    authError = err instanceof Error ? err : new Error("Unknown auth error");
  }

  if (!session) {
    // Log for debugging
    console.warn("No session found, redirecting to login", { authError: authError?.message });
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminLoadingIndicator />
      {/* Sidebar - responsive: hidden on mobile, collapsible on tablet, full on desktop */}
      <aside className="hidden w-64 lg:block bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 sm:p-6">
          <h1 className="text-fluid-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Site Settings
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pages"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Pages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pages/content"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Page Content
              </Link>
            </li>
            <li>
              <Link
                href="/admin/destinations"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                href="/admin/safaris"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Safari Packages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/experiences"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Experiences
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reviews"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/admin/leads"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Inquiry Leads
              </Link>
            </li>
            <li>
              <Link
                href="/admin/navigation"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                Navigation
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

      {/* Mobile sidebar toggle - only visible on mobile */}
      <div className="lg:hidden fixed inset-0 z-40 bg-black/50" id="sidebar-overlay" aria-hidden="true" />
      <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out" id="mobile-sidebar" style={{ transform: 'translateX(-100%)' }}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-fluid-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            id="close-sidebar"
            className="p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Site Settings
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pages"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Pages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pages/content"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Page Content
              </Link>
            </li>
            <li>
              <Link
                href="/admin/destinations"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                href="/admin/safaris"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Safari Packages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/experiences"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Experiences
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reviews"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/admin/leads"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Inquiry Leads
              </Link>
            </li>
            <li>
              <Link
                href="/admin/navigation"
                className="block px-4 py-2 text-fluid-sm text-gray-700 rounded hover:bg-gray-100"
                onClick={() => document.getElementById('close-sidebar')?.click()}
              >
                Navigation
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        id="open-sidebar"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-md text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        aria-label="Open navigation menu"
        aria-expanded="false"
        aria-controls="mobile-sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0 min-w-0">
        <CmsQueryFeedback />
        {children}
      </main>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const openBtn = document.getElementById('open-sidebar');
              const closeBtn = document.getElementById('close-sidebar');
              const sidebar = document.getElementById('mobile-sidebar');
              const overlay = document.getElementById('sidebar-overlay');

              function openSidebar() {
                sidebar.style.transform = 'translateX(0)';
                overlay.style.display = 'block';
                openBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
              }

              function closeSidebar() {
                sidebar.style.transform = 'translateX(-100%)';
                overlay.style.display = 'none';
                openBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
              }

              openBtn?.addEventListener('click', openSidebar);
              closeBtn?.addEventListener('click', closeSidebar);
              overlay?.addEventListener('click', closeSidebar);

              // Close on escape key
              document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.style.transform === 'translateX(0)') {
                  closeSidebar();
                }
              });
            })();
          `,
        }}
      />
    </div>
  );
}