import { createClient } from "@/lib/supabase/server";
import { unstable_noStore } from "next/cache";

export type NavItem = {
  label: string;
  href: string;
};

export type MenuWithItems = {
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

// Fetch published menus with items
export async function getPublishedMenus(): Promise<MenuWithItems[]> {
  unstable_noStore();
  const supabase = await createClient();

  const { data: menus, error } = await supabase
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
    .eq("status", "published")
    .order("name", { ascending: true });

  if (error) {
    console.error("Published menus fetch error:", error);
    return [];
  }

  return (menus || []).map((menu) => ({
    ...menu,
    menu_items: (menu.menu_items || [])
      .filter((item) => item.parent_id === null) // Only top-level items for now
      .sort((a, b) => a.order_column - b.order_column),
  }));
}

// Get menu items for a specific location
export async function getMenuItemsByLocation(location: string): Promise<NavItem[]> {
  unstable_noStore();
  const supabase = await createClient();

  const { data: menu, error } = await supabase
    .from("menus")
    .select(`
      id,
      menu_items (
        id,
        parent_id,
        label,
        href,
        order_column
      )
    `)
    .eq("location", location)
    .eq("status", "published")
    .single();

  if (error || !menu) {
    return [];
  }

  // Return only top-level items, sorted by order
  return (menu.menu_items || [])
    .filter((item) => item.parent_id === null)
    .sort((a, b) => a.order_column - b.order_column)
    .map((item) => ({
      label: item.label,
      href: item.href,
    }));
}

// Get all menu items including nested for a location
export async function getFullMenuByLocation(location: string): Promise<MenuWithItems | null> {
  unstable_noStore();
  const supabase = await createClient();

  const { data: menu, error } = await supabase
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
    .eq("location", location)
    .eq("status", "published")
    .single();

  if (error || !menu) {
    return null;
  }

  return {
    ...menu,
    menu_items: (menu.menu_items || []).sort((a, b) => a.order_column - b.order_column),
  };
}