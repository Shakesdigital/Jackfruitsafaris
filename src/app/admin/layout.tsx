import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLoadingIndicator } from "@/app/admin/_components/admin-loading-indicator";
import { CmsQueryFeedback } from "@/app/admin/_components/cms-query-feedback";
import { AdminShell } from "./_components/admin-shell";

export const metadata: Metadata = {
  title: "Admin Dashboard | Jackfruit Safaris",
  description: "Content Management System",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verify session with Supabase (uses cookies internally via createClient)
  // getUser() performs server-side JWT verification — more secure and
  // reliable than getSession() which only reads cookies without verification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Render the client shell which handles mobile sidebar toggling
  return (
    <div className="admin-shell flex min-h-screen bg-gray-50">
      <AdminLoadingIndicator />
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
