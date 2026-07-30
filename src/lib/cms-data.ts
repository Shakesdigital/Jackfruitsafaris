import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

type AdminRecord = Record<string, any>;

export type AdminRecordResult<T extends AdminRecord = AdminRecord> = {
  data: T | null;
  error: string | null;
  code?: string;
};

function describeAdminFetchError(error: unknown) {
  if (!error) return null;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return "The CMS could not load this record from Supabase.";
}

function getAdminFetchCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    return String((error as { code?: unknown }).code);
  }
  return undefined;
}

async function getAdminRecordById(
  table: string,
  id: string,
): Promise<AdminRecordResult> {
  if (id === "new") {
    return { data: null, error: null };
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Admin CMS fetch error on ${table}`, error);
      return {
        data: null,
        error: describeAdminFetchError(error),
        code: getAdminFetchCode(error),
      };
    }

    return { data: (data as AdminRecord | null) ?? null, error: null };
  } catch (error) {
    console.error(`Admin CMS fetch exception on ${table}`, error);
    return {
      data: null,
      error: describeAdminFetchError(error),
      code: getAdminFetchCode(error),
    };
  }
}

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
    .order("created_at", { descending: true });

  return data || [];
}

// Fetch the latest public-safe site settings. React cache deduplicates the
// layout/header/footer reads within one server request without persisting stale
// data between requests.
export const getSiteSettings = cache(async function getSiteSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_public_site_settings");

  if (error) {
    console.error("Public site settings fetch error:", error);
    return null;
  }

  return data && typeof data === "object" ? data : null;
});

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

// Admin fetch functions - use service role key to bypass RLS
export async function getAdminSafaris() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("safari_packages")
    .select("id, slug, title, duration, status, updated_at")
    .order("updated_at", { ascending: false });
  return data || [];
}

export async function getAdminSafariById(id: string) {
  const result = await getAdminSafariByIdResult(id);
  return result.data;
}

export async function getAdminSafariByIdResult(id: string) {
  return getAdminRecordById("safari_packages", id);
}

export async function getAdminDestinations() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("destinations")
    .select("id, slug, name, region, status, updated_at")
    .order("updated_at", { ascending: false });
  return data || [];
}

export async function getAdminDestinationById(id: string) {
  const result = await getAdminDestinationByIdResult(id);
  return result.data;
}

export async function getAdminDestinationByIdResult(id: string) {
  return getAdminRecordById("destinations", id);
}

export async function getAdminExperiences() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("experiences")
    .select("id, slug, name, category, status, updated_at")
    .order("updated_at", { ascending: false });
  return data || [];
}

export async function getAdminExperienceById(id: string) {
  const result = await getAdminExperienceByIdResult(id);
  return result.data;
}

export async function getAdminExperienceByIdResult(id: string) {
  return getAdminRecordById("experiences", id);
}

export async function getAdminReviews() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, guest_name, trip_type, rating, status, permission_status, updated_at")
    .order("updated_at", { descending: false });
  return data || [];
}

export async function getAdminReviewById(id: string) {
  const result = await getAdminReviewByIdResult(id);
  return result.data;
}

export async function getAdminReviewByIdResult(id: string) {
  return getAdminRecordById("reviews", id);
}

export async function getAdminPages() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("pages")
    .select("id, slug, title, status, updated_at")
    .order("updated_at", { descending: false });
  return data || [];
}

export async function getAdminPageById(id: string) {
  const result = await getAdminPageByIdResult(id);
  return result.data;
}

export async function getAdminPageByIdResult(id: string) {
  return getAdminRecordById("pages", id);
}

export async function getAdminLeads() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("inquiry_leads")
    .select("id, first_name, email, service_type, status, created_at")
    .order("created_at", { descending: false });
  return data || [];
}

// Fetch all published homepage sections
export async function getPublishedHomepageSections() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  return data || [];
}

// Fetch all published quick links
export async function getPublishedQuickLinks() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("homepage_quick_links")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  return data || [];
}

// Fetch all published trust items
export async function getPublishedTrustItems() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("homepage_trust_items")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  return data || [];
}

// Fetch all published features
export async function getPublishedFeatures() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("homepage_features")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  return data || [];
}

// Fetch homepage guide articles
export async function getHomepageGuideArticles(limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from("homepage_guide_articles")
    .select("*")
    .eq("status", "published")
    .order("order_index", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  return data || [];
}

// Admin functions for homepage content
export async function getAdminHomepageSections() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("order_index", { ascending: true });
  return data || [];
}

export async function getAdminHomepageSectionById(id: string) {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getAdminQuickLinks() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("homepage_quick_links")
    .select("*")
    .order("order_index", { ascending: true });
  return data || [];
}

export async function getAdminTrustItems() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("homepage_trust_items")
    .select("*")
    .order("order_index", { ascending: true });
  return data || [];
}

export async function getAdminFeatures() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("homepage_features")
    .select("*")
    .order("order_index", { ascending: true });
  return data || [];
}

export async function getAdminGuideArticles() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("homepage_guide_articles")
    .select("*")
    .order("order_index", { ascending: true });
  return data || [];
}

// Fetch page hero content
export async function getPageHero(pageSlug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_heroes")
    .select("*")
    .eq("page_slug", pageSlug)
    .eq("status", "published")
    .single();
  return data;
}

// Admin functions for page heroes
export async function getAdminPageHeroes() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("page_heroes")
    .select("*")
    .order("page_slug", { ascending: true });
  return data || [];
}

export async function getAdminPageHeroById(id: string) {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("page_heroes")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

// Fetch published page content sections
export async function getPublishedPageContentSections(pageSlug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content_sections")
    .select("*")
    .eq("page_slug", pageSlug)
    .eq("status", "published")
    .order("order_index", { ascending: true });
  return data || [];
}

// Admin functions for page content sections
export async function getAdminPageContentSections(pageSlug?: string) {
  const supabase = await createAdminClient();
  let query = supabase
    .from("page_content_sections")
    .select("*")
    .order("page_slug", { ascending: true })
    .order("order_index", { ascending: true });

  if (pageSlug) {
    query = query.eq("page_slug", pageSlug);
  }

  const { data } = await query;
  return data || [];
}

export async function getAdminPageContentSectionByIdResult(id: string) {
  return getAdminRecordById("page_content_sections", id);
}
