import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Helper for generateStaticParams - does NOT use cookies (build-time safe)
function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL_KEY || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}

// Fetch published safari packages
export async function getPublishedSafaris() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("safari_packages")
    .select("*")
    .eq("status", "published")
    .order("order_column", { ascending: true });

  return data || [];
}

// Fetch published destinations
export async function getPublishedDestinations() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("destinations")
    .select("*")
    .eq("status", "published")
    .order("order_column", { ascending: true });

  return data || [];
}

// Fetch published experiences
export async function getPublishedExperiences() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("status", "published")
    .order("order_column", { ascending: true });

  return data || [];
}

// Fetch approved reviews
export async function getPublishedReviews() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "published")
    .eq("permission_status", "approved")
    .order("created_at", { ascending: false });

  return data || [];
}

// Fetch site settings (single row)
export async function getSiteSettings() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return data;
}

// Fetch safari by slug
export async function getSafariBySlug(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("safari_packages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data;
}

// Fetch destination by slug
export async function getDestinationBySlug(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data;
}

// Fetch experience by slug
export async function getExperienceBySlug(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data;
}

// Fetch all gallery media
export async function getGalleryMedia() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("gallery_media")
    .select("*")
    .eq("status", "published")
    .eq("permission_status", "approved");

  return data || [];
}