import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertMenuItem } from "@/lib/server/cms-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Menu Item",
};

type EditMenuItemPageProps = {
  params: Promise<{ id: string; itemId: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function EditMenuItemPage({ params, searchParams }: EditMenuItemPageProps) {
  const { id: menuId, itemId } = await params;
  const { error, success } = await searchParams;
  const supabase = await createClient();

  // Fetch menu item
  const { data: item, error: itemError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", itemId)
    .eq("menu_id", menuId)
    .single();

  if (itemError || !item) {
    redirect(`/admin/navigation/${menuId}/edit?error=Item+not+found`);
  }

  // Fetch menu for context
  const { data: menu } = await supabase
    .from("menus")
    .select("name, location")
    .eq("id", menuId)
    .single();

  // Fetch existing items for parent selection (exclude self and children)
  const { data: existingItems } = await supabase
    .from("menu_items")
    .select("id, label, parent_id")
    .eq("menu_id", menuId)
    .neq("id", itemId)
    .order("order_column", { ascending: true });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Menu Item</h1>
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

      <form action={upsertMenuItem} className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <input type="hidden" name="id" value={itemId} />
        <input type="hidden" name="menu_id" value={menuId} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">Label</span>
            <input
              required
              name="label"
              defaultValue={item.label}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">URL / Path</span>
            <input
              required
              name="href"
              defaultValue={item.href}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Parent Item</span>
            <select name="parent_id" defaultValue={item.parent_id || ""} className="mt-1 block w-full rounded-md border-gray-300">
              <option value="">— Top Level —</option>
              {existingItems?.map((parentItem: { id: string; label: string }) => (
                <option key={parentItem.id} value={parentItem.id}>
                  {parentItem.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Order</span>
            <input
              type="number"
              name="order_column"
              defaultValue={item.order_column}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="rounded-md bg-blue-600 min-h-[44px] px-4 py-3 text-sm text-white hover:bg-blue-700 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
            Save Changes
          </button>
          <Link href={`/admin/navigation/${menuId}/edit`} className="rounded-md border border-gray-300 min-h-[44px] px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}