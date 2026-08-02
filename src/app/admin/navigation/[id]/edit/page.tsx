import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Menu",
};

type MenuPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function MenuEditPage({ params, searchParams }: MenuPageProps) {
  const { id } = await params;
  const { error, success } = await searchParams;
  const supabase = await createClient();

  // Fetch menu with items
  const { data: menu, error: menuError } = await supabase
    .from("menus")
    .select(`
      id,
      name,
      location,
      status,
      menu_items (
        id,
        parent_id,
        label,
        href,
        order_column
      )
    `)
    .eq("id", id)
    .single();

  if (menuError || !menu) {
    redirect("/admin/navigation?error=Menu+not+found");
  }

  const sortedItems = (menu.menu_items || []).sort((a: { order_column: number }, b: { order_column: number }) => a.order_column - b.order_column);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Menu: {menu.name}</h1>
          <p className="text-gray-500">Location: {menu.location} • Status: {menu.status}</p>
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

      {/* Menu Details Form */}
      <form action={updateMenu} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <input type="hidden" name="menu_id" value={menu.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Menu Name</span>
            <input
              required
              name="name"
              defaultValue={menu.name}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Location</span>
            <select name="location" defaultValue={menu.location} className="mt-1 block w-full rounded-md border-gray-300">
              <option value="main">Main Navigation</option>
              <option value="footer">Footer Navigation</option>
              <option value="sidebar">Sidebar</option>
              <option value="mobile">Mobile Menu</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select name="status" defaultValue={menu.status} className="mt-1 block w-full rounded-md border-gray-300">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Save Menu Details
        </button>
      </form>

      {/* Menu Items */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Menu Items</h2>
          <Link
            href={`/admin/navigation/${menu.id}/items/new`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Menu Item
          </Link>
        </div>

        {sortedItems.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No menu items yet. Click "Add Menu Item" to create one.</p>
        ) : (
          <ul className="space-y-2">
            {sortedItems.map((item: { id: string; order_column: number; label: string; href: string; parent_id: string | null }) => (
              <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-gray-400 w-6 text-right">{item.order_column}</span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.label}</p>
                    <p className="text-sm text-gray-500 truncate">{item.href}</p>
                    {item.parent_id && (
                      <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Sub-item
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/navigation/${menu.id}/items/${item.id}/edit`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <form action={async (formData: FormData) => {
                    const supabase = await createClient();
                    const { error } = await supabase
                      .from("menu_items")
                      .delete()
                      .eq("id", item.id);
                    if (error) console.error("Delete item error:", error);
                    redirect(`/admin/navigation/${menu.id}/edit?success=Item+deleted`);
                  }}>
                    <button type="submit" className="text-sm text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

async function updateMenu(formData: FormData) {
  const supabase = await createClient();
  const menuId = formData.get("menu_id") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("menus")
    .update({ name, location, status, updated_at: new Date().toISOString() })
    .eq("id", menuId);

  if (error) {
    console.error("Update menu error:", error);
    redirect(`/admin/navigation/${menuId}/edit?error=Failed+to+update+menu`);
  }

  redirect(`/admin/navigation/${menuId}/edit?success=Menu+updated`);
}