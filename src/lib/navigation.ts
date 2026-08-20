import { createClient } from "@/lib/supabase/server";
import { unstable_noStore } from "next/cache";

export type NavItem = {
  label: string;
  href: string;
};

export const DEFAULT_MAIN_NAVIGATION: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Safaris", href: "/safaris" },
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "About", href: "/about" },
  { label: "Travel Guide", href: "/travel-guide" },
];

export const DEFAULT_FOOTER_NAVIGATION: NavItem[] = [
  ...DEFAULT_MAIN_NAVIGATION,
  { label: "Contact", href: "/contact" },
];

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

  return (menus || []).map((menu: MenuWithItems) => ({
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

  try {
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
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`getMenuItemsByLocation error for ${location}:`, error);
      return [];
    }

    if (!menu) {
      console.warn(`No menu found for location: ${location}`);
      return [];
    }

    // Return only top-level items, sorted by order
    return (menu.menu_items || [])
      .filter((item: { parent_id: string | null }) => item.parent_id === null)
      .sort((a: { order_column: number }, b: { order_column: number }) => a.order_column - b.order_column)
      .map((item: { label: string; href: string }) => ({
        label: item.label,
        href: item.href,
      }));
  } catch (err) {
    console.error(`getMenuItemsByLocation exception for ${location}:`, err);
    return [];
  }
}

// Get all menu items including nested for a location
export async function getFullMenuByLocation(location: string): Promise<MenuWithItems | null> {
  unstable_noStore();
  const supabase = await createClient();

  try {
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
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`getFullMenuByLocation error for ${location}:`, error);
      return null;
    }

    if (!menu) {
      console.warn(`No menu found for location: ${location}`);
      return null;
    }

    return {
      ...menu,
      menu_items: (menu.menu_items || []).sort((a: { order_column: number }, b: { order_column: number }) => a.order_column - b.order_column),
    };
  } catch (err) {
    console.error(`getFullMenuByLocation exception for ${location}:`, err);
    return null;
  }
}
