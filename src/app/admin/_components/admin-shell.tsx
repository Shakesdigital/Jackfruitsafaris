"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { logout } from "@/lib/server/actions";
import { AdminLoadingIndicator } from "@/app/admin/_components/admin-loading-indicator";
import { CmsQueryFeedback } from "@/app/admin/_components/cms-query-feedback";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/pages/content", label: "Page Content" },
  { href: "/admin/destinations", label: "Destinations" },
  { href: "/admin/safaris", label: "Safari Packages" },
  { href: "/admin/gallery", label: "Photo Gallery" },
  { href: "/admin/experiences", label: "Experiences" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/leads", label: "Inquiry Leads" },
  { href: "/admin/travel-insights", label: "Travel Insights" },
  { href: "/admin/navigation", label: "Navigation" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Sidebar — fixed on mobile, static on desktop */}
      <aside
        className={
          "w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out " +
          (sidebarOpen
            ? "fixed inset-0 z-40 translate-x-0"
            : "fixed inset-y-0 left-0 z-40 -translate-x-full lg:translate-x-0 lg:static lg:z-auto")
        }
      >
        {/* Sidebar header with close button on mobile */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 lg:border-b-0">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden flex items-center justify-center size-9 rounded-lg border border-gray-300 text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="flex-1 px-3 sm:px-4 py-4 overflow-y-auto"
          aria-label="Admin navigation"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end">
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Top bar on mobile with hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex items-center justify-center size-10 rounded-lg border border-gray-300 text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
        <div className="w-10" />
      </div>

      {/* Main content */}
      <main className="flex-1 mt-14 lg:mt-0 overflow-x-hidden p-4 sm:p-6 lg:pl-[18rem]">
        <CmsQueryFeedback />
        {children}
      </main>
    </>
  );
}
