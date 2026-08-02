import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Add Menu Item",
};

type NewMenuItemPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function NewMenuItemPage({ params, searchParams }: NewMenuItemPageProps) {
  const { id: menuId } = await params;
  const { error, success } = await searchParams;
  const supabase = await createClient();

  // Fetch menu for context
  const { data: menu } = await supabase
    .from("menus")
    .select("name, location")
    .eq("id", menuId)
    .single();

  // Fetch existing items for parent selection
  const { data: existingItems } = await supabase
    .from("menu_items")
    .select("id, label, parent_id")
    .eq("menu_id", menuId)
    .order("order_column", { ascending: true });

  // Get next order
  const maxOrder = existingItems?.reduce((max, item) => Math.max(max, item.order_column), 0) || 0;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Menu Item</h1>
          <p className="text-gray-500">Menu: {menu?.name} ({menu?.location})</p>
        </div>
        <Link href={`/admin/navigation/${menuId}/edit`} className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to Menu
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

      <form action={createMenuItem} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <input type="hidden" name="menu_id" value={menuId} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">Label</span>
            <input
              required
              name="label"
              placeholder="e.g., Home, Safaris, About Us"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">URL / Path</span>
            <input
              required
              name="href"
              placeholder="/ or /safaris or https://example.com"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Parent Item (for dropdowns)</span>
            <select name="parent_id" defaultValue="" className="mt-1 block w-full rounded-md border-gray-300">
              <option value="">— Top Level —</option>
              {existingItems?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Order</span>
            <input
              type="number"
              name="order_column"
              defaultValue={maxOrder + 10}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Add Menu Item
          </button>
          <Link href={`/admin/navigation/${menuId}/edit`} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

async function createMenuItem(formData: FormData) {
  const supabase = await createClient();
  const menuId = formData.get("menu_id") as string;
  const label = formData.get("label") as string;
  const href = formData.get("href") as string;
  const parentId = formData.get("parent_id") as string || null;
  const orderColumn = parseInt(formData.get("order_column") as string) || 0;

  if (!label || !href) {
    redirect(`/admin/navigation/${menuId}/items/new?error=Label+and+URL+are+required`);
  }

  const { error } = await supabase
    .from("menu_items")
    .insert({
      menu_id: menuId,
      label,
      href,
      parent_id: parentId,
      order_column: orderColumn,
    });

  if (error) {
    console.error("Create menu item error:", error);
    redirect(`/admin/navigation/${menuId}/items/new?error=Failed+to+create+item`);
  }

  redirect(`/admin/navigation/${menuId}/edit?success=Item+added`);
}