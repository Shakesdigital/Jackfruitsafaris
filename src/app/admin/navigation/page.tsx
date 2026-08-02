import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Navigation Management",
};

type MenuWithItems = {
  id: string;
  name: string;
  location: string;
  status: "draft" | "published" | "archived";
  menu_items: Array<{
    id: string;
    parent_id: string | null;
    label: string;
    href: string;
    order_column: number;
  }>;
};

export default async function NavigationPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const { error, success } = await searchParams;
  const supabase = await createClient();

  // Fetch all menus with their items
  const { data: menus, error: menusError } = await supabase
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
    .order("name", { ascending: true });

  if (menusError) {
    console.error("Menus fetch error:", menusError);
  }

  const sortedMenus = (menus || []).map((menu: MenuWithItems) => ({
    ...menu,
    menu_items: (menu.menu_items || []).sort((a, b) => a.order_column - b.order_column),
  }));

  // Get main menu and footer menu
  const mainMenu = sortedMenus.find((m: MenuWithItems) => m.location === "main") || null;
  const footerMenu = sortedMenus.find((m: MenuWithItems) => m.location === "footer") || null;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Navigation Management</h1>
        <Link
          href="/admin/navigation/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Create New Menu
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

      {menusError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Menus could not be loaded: {menusError.message}
        </div>
      )}

      {/* Main Menu Section */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Main Navigation Menu</h2>
        {mainMenu ? (
          <MenuEditor menu={mainMenu} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No main menu found.</p>
            <Link
              href="/admin/navigation/new?location=main"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Create Main Menu
            </Link>
          </div>
        )}
      </section>

      {/* Footer Menu Section */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Footer Navigation Menu</h2>
        {footerMenu ? (
          <MenuEditor menu={footerMenu} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No footer menu found.</p>
            <Link
              href="/admin/navigation/new?location=footer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Create Footer Menu
            </Link>
          </div>
        )}
      </section>

      {/* Other Menus */}
      {sortedMenus.filter((m: MenuWithItems) => m.location !== "main" && m.location !== "footer").length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Other Menus</h2>
          <div className="space-y-4">
            {sortedMenus
              .filter((m: MenuWithItems) => m.location !== "main" && m.location !== "footer")
              .map((menu: MenuWithItems) => (
                <MenuEditor key={menu.id} menu={menu} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MenuEditor({ menu }: { menu: MenuWithItems }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-gray-900 capitalize">{menu.location} Menu</h3>
          <p className="text-sm text-gray-500">{menu.name} • {menu.menu_items.length} items • {menu.status}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/navigation/${menu.id}/edit`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit Menu
          </Link>
          <form action={async () => {}} className="inline">
            <button
              type="submit"
              className="text-sm text-red-600 hover:text-red-800"
              formAction={async (formData: FormData) => {
                const supabase = await createClient();
                const { error } = await supabase
                  .from("menus")
                  .delete()
                  .eq("id", menu.id);
                if (error) {
                  console.error("Delete menu error:", error);
                }
                redirect("/admin/navigation?success=Menu+deleted");
              }}
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-2">
        {menu.menu_items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No menu items. <a href={`/admin/navigation/${menu.id}/edit`} className="text-blue-600 underline">Add items</a></p>
        ) : (
          <ul className="space-y-1">
            {menu.menu_items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{item.order_column}</span>
                  <span className="font-medium">{item.label}</span>
                  <span className="text-sm text-gray-500">→ {item.href}</span>
                  {item.parent_id && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Sub-item</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
