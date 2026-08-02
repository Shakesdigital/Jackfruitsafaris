import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create New Menu",
};

type NewMenuPageProps = {
  searchParams: Promise<{ location?: string; error?: string; success?: string }>;
};

export default async function NewMenuPage({ searchParams }: NewMenuPageProps) {
  const { location, error, success } = await searchParams;
  const supabase = await createClient();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Menu</h1>
          <p className="text-gray-500">Define a new navigation menu for your site.</p>
        </div>
        <Link href="/admin/navigation" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to Menus
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      <form action={createMenu} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Menu Name</span>
            <input
              required
              name="name"
              placeholder="e.g., Main Navigation, Footer Links"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Location</span>
            <select name="location" defaultValue={location || "main"} className="mt-1 block w-full rounded-md border-gray-300">
              <option value="main">Main Navigation</option>
              <option value="footer">Footer Navigation</option>
              <option value="sidebar">Sidebar</option>
              <option value="mobile">Mobile Menu</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select name="status" defaultValue="draft" className="mt-1 block w-full rounded-md border-gray-300">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Create Menu
          </button>
          <Link href="/admin/navigation" className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

async function createMenu(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const status = formData.get("status") as string;

  if (!name) {
    redirect("/admin/navigation/new?error=Menu+name+is+required");
  }

  const { data, error } = await supabase
    .from("menus")
    .insert({ name, location, status })
    .select("id")
    .single();

  if (error) {
    console.error("Create menu error:", error);
    redirect("/admin/navigation/new?error=Failed+to+create+menu");
  }

  redirect(`/admin/navigation/${data.id}/edit?success=Menu+created`);
}