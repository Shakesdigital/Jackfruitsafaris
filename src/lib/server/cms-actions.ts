"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createAnonClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

type StorageClient = {
  storage: {
    getBucket: (bucket: string) => Promise<{
      data: { public?: boolean } | null;
      error: unknown;
    }>;
    createBucket: (
      bucket: string,
      options: {
        public: boolean;
        fileSizeLimit: number;
        allowedMimeTypes: string[];
      },
    ) => Promise<{ error: unknown }>;
    updateBucket: (
      bucket: string,
      options: {
        public: boolean;
        fileSizeLimit: number;
        allowedMimeTypes: string[];
      },
    ) => Promise<{ error: unknown }>;
    from: (bucket: string) => {
      upload: (
        path: string,
        body: Buffer,
        options: { contentType: string; upsert: boolean },
      ) => Promise<{ error: unknown }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
};

// For reading data in server components/actions
async function getSupabase() {
  return await createAnonClient();
}

// For admin writes (uses service role key)
async function getAdminSupabase() {
  return await createAdminClient();
}

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (!value || typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function redirectWithCmsMessage(
  path: string,
  type: "error" | "success",
  message: string,
): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

function getCmsErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return "Unknown Supabase error";
}

function redirectOnMutationError(
  error: unknown,
  path: string,
  operation: string,
) {
  if (!error) return;
  console.error(`${operation} error:`, error);
  redirectWithCmsMessage(
    path,
    "error",
    `${operation} failed: ${getCmsErrorMessage(error)}`,
  );
}

function redirectOnValidationError(
  error: z.ZodError,
  path: string,
  operation: string,
): never {
  console.error(`${operation} validation error:`, error);
  const firstIssue = error.issues[0]?.message || "Please check the required fields.";
  redirectWithCmsMessage(path, "error", `${operation} failed: ${firstIssue}`);
}

const sitewideCmsPaths = [
  "/",
  "/safaris",
  "/safaris/[slug]",
  "/destinations",
  "/destinations/[slug]",
  "/experiences",
  "/experiences/[slug]",
  "/reviews",
  "/travel-guide",
  "/request-quote",
  "/contact",
  "/transport/airport-transfers",
];

function normalizePublicPath(path: string) {
  if (path === "home" || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function revalidateCmsPath(path: string) {
  if (path.includes("[")) {
    revalidatePath(path, "page");
    return;
  }

  revalidatePath(path);
}

function revalidateCmsRoutes(...paths: string[]) {
  revalidatePath("/admin", "layout");
  for (const path of new Set(paths)) {
    revalidateCmsPath(normalizePublicPath(path));
  }
}

async function getLatestSiteSettingsId(supabase: Awaited<ReturnType<typeof getAdminSupabase>>) {
  const { data, error } = await supabase
    .from("site_settings")
    .select("id")
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Site settings lookup error:", error);
  }

  return typeof data?.id === "string" ? data.id : null;
}

async function uploadImageFromForm(
  supabase: StorageClient,
  formData: FormData,
  fieldName: string,
  destinationFolder: string,
  errorPath: string,
) {
  const file = formData.get(fieldName) as File | null;
  if (!file || !file.size) return null;

  if (!file.type.startsWith("image/")) {
    redirectWithCmsMessage(errorPath, "error", "Please choose a valid image file.");
  }
  if (file.size > 10 * 1024 * 1024) {
    redirectWithCmsMessage(errorPath, "error", "The image is larger than the 10 MB upload limit.");
  }

  const bucketOptions = {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
  };
  const { data: bucket } = await supabase.storage.getBucket("cms-media");

  if (!bucket) {
    const { error: bucketError } = await supabase.storage.createBucket(
      "cms-media",
      bucketOptions,
    );
    if (bucketError && !getCmsErrorMessage(bucketError).toLowerCase().includes("already")) {
      console.error("CMS media bucket creation error:", bucketError);
      redirectWithCmsMessage(
        errorPath,
        "error",
        `Image storage is not available: ${getCmsErrorMessage(bucketError)}`,
      );
    }
  } else if (!bucket.public) {
    const { error: bucketError } = await supabase.storage.updateBucket(
      "cms-media",
      bucketOptions,
    );
    if (bucketError) {
      console.error("CMS media bucket update error:", bucketError);
      redirectWithCmsMessage(
        errorPath,
        "error",
        `Image storage could not be made public: ${getCmsErrorMessage(bucketError)}`,
      );
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${destinationFolder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from("cms-media").upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("CMS image upload error:", error);
    redirectWithCmsMessage(
      errorPath,
      "error",
      `Image upload failed: ${getCmsErrorMessage(error)}`,
    );
  }

  const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
  return data.publicUrl as string;
}

// Site Settings Actions
const siteSettingsSchema = z.object({
  business_name: z.string().min(1),
  logo_url: z.string().url().optional().or(z.literal("")),
  favicon_url: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp_number: z.string().optional(),
  whatsapp_message: z.string().optional(),
  alternate_phone: z.string().optional(),
  address: z.string().optional(),
  operating_hours: z.string().optional(),
  social_links: z.record(z.string(), z.any()).optional(),
  footer_copy: z.string().optional(),
  footer_tagline: z.string().optional(),
  footer_note: z.string().optional(),
  nav_items: z.array(z.record(z.string(), z.any())).optional(),
  seo: z.record(z.string(), z.any()).optional(),
  integrations: z.record(z.string(), z.any()).optional(),
  // Homepage fields
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  badge_text: z.string().optional(),
  cta_primary: z.string().optional(),
  cta_secondary: z.string().optional(),
  why_uganda_eyebrow: z.string().optional(),
  why_uganda_title: z.string().optional(),
  why_uganda_intro: z.string().optional(),
  why_uganda_paragraph: z.string().optional(),
  cta_eyebrow: z.string().optional(),
  cta_title: z.string().optional(),
  cta_intro: z.string().optional(),
  cta_button: z.string().optional(),
  hero_image: z.string().url().optional().or(z.literal("")),
  brand_primary_color: z.string().optional(),
  brand_secondary_color: z.string().optional(),
  brand_accent_color: z.string().optional(),
  brand_background_color: z.string().optional(),
  brand_surface_color: z.string().optional(),
  brand_text_color: z.string().optional(),
  brand_muted_text_color: z.string().optional(),
  heading_font_family: z.string().optional(),
  body_font_family: z.string().optional(),
  base_font_size: z.string().optional(),
  heading_weight: z.string().optional(),
  body_weight: z.string().optional(),
  line_height: z.string().optional(),
  letter_spacing: z.string().optional(),
  border_radius_style: z.string().optional(),
  button_style: z.string().optional(),
  section_spacing: z.string().optional(),
  card_shadow_style: z.string().optional(),
  footer_background_color: z.string().optional(),
  aesthetics: z.record(z.string(), z.any()).optional(),
});

export async function upsertSiteSettings(formData: FormData) {
  // Verify user with anon client
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use admin client for writes
  const supabase = await getAdminSupabase();
  const logoUrl =
    (await uploadImageFromForm(supabase, formData, "logo_file", "branding/logos", "/admin/settings")) ||
    formData.get("logo_url") ||
    undefined;
  const faviconUrl =
    (await uploadImageFromForm(supabase, formData, "favicon_file", "branding/favicons", "/admin/settings")) ||
    formData.get("favicon_url") ||
    undefined;
  const heroImage =
    (await uploadImageFromForm(supabase, formData, "hero_image_file", "branding/heroes", "/admin/settings")) ||
    formData.get("hero_image") ||
    undefined;

  const parsed = siteSettingsSchema.safeParse({
    business_name: formData.get("business_name"),
    logo_url: logoUrl,
    favicon_url: faviconUrl,
    contact_email: formData.get("contact_email") || undefined,
    phone: formData.get("phone") || undefined,
    whatsapp_number: formData.get("whatsapp_number") || undefined,
    whatsapp_message: formData.get("whatsapp_message") || undefined,
    alternate_phone: formData.get("alternate_phone") || undefined,
    address: formData.get("address") || undefined,
    operating_hours: formData.get("operating_hours") || undefined,
    social_links: parseJsonField(formData.get("social_links"), undefined),
    footer_copy: formData.get("footer_copy") || undefined,
    footer_tagline: formData.get("footer_tagline") || undefined,
    footer_note: formData.get("footer_note") || undefined,
    nav_items: parseJsonField(formData.get("nav_items"), undefined),
    seo: parseJsonField(formData.get("seo"), undefined),
    integrations: parseJsonField(formData.get("integrations"), undefined),
    hero_title: formData.get("hero_title") || undefined,
    hero_subtitle: formData.get("hero_subtitle") || undefined,
    badge_text: formData.get("badge_text") || undefined,
    cta_primary: formData.get("cta_primary") || undefined,
    cta_secondary: formData.get("cta_secondary") || undefined,
    why_uganda_eyebrow: formData.get("why_uganda_eyebrow") || undefined,
    why_uganda_title: formData.get("why_uganda_title") || undefined,
    why_uganda_intro: formData.get("why_uganda_intro") || undefined,
    why_uganda_paragraph: formData.get("why_uganda_paragraph") || undefined,
    cta_eyebrow: formData.get("cta_eyebrow") || undefined,
    cta_title: formData.get("cta_title") || undefined,
    cta_intro: formData.get("cta_intro") || undefined,
    cta_button: formData.get("cta_button") || undefined,
    hero_image: heroImage,
    brand_primary_color: formData.get("brand_primary_color") || undefined,
    brand_secondary_color: formData.get("brand_secondary_color") || undefined,
    brand_accent_color: formData.get("brand_accent_color") || undefined,
    brand_background_color: formData.get("brand_background_color") || undefined,
    brand_surface_color: formData.get("brand_surface_color") || undefined,
    brand_text_color: formData.get("brand_text_color") || undefined,
    brand_muted_text_color: formData.get("brand_muted_text_color") || undefined,
    heading_font_family: formData.get("heading_font_family") || undefined,
    body_font_family: formData.get("body_font_family") || undefined,
    base_font_size: formData.get("base_font_size") || undefined,
    heading_weight: formData.get("heading_weight") || undefined,
    body_weight: formData.get("body_weight") || undefined,
    line_height: formData.get("line_height") || undefined,
    letter_spacing: formData.get("letter_spacing") || undefined,
    border_radius_style: formData.get("border_radius_style") || undefined,
    button_style: formData.get("button_style") || undefined,
    section_spacing: formData.get("section_spacing") || undefined,
    card_shadow_style: formData.get("card_shadow_style") || undefined,
    footer_background_color: formData.get("footer_background_color") || undefined,
    aesthetics: {
      palette: {
        primary: formData.get("brand_primary_color") || "#143c2d",
        secondary: formData.get("brand_secondary_color") || "#2d6f55",
        accent: formData.get("brand_accent_color") || "#f5bf2f",
        background: formData.get("brand_background_color") || "#fbfaf5",
        surface: formData.get("brand_surface_color") || "#ffffff",
        text: formData.get("brand_text_color") || "#10251b",
        muted_text: formData.get("brand_muted_text_color") || "#536154",
      },
      typography: {
        heading_font_family: formData.get("heading_font_family") || "Geist",
        body_font_family: formData.get("body_font_family") || "Geist",
        base_font_size: formData.get("base_font_size") || "16px",
        heading_weight: formData.get("heading_weight") || "900",
        body_weight: formData.get("body_weight") || "400",
        line_height: formData.get("line_height") || "1.6",
        letter_spacing: formData.get("letter_spacing") || "normal",
      },
      shape: {
        border_radius_style: formData.get("border_radius_style") || "rounded",
        button_style: formData.get("button_style") || "pill",
        section_spacing: formData.get("section_spacing") || "comfortable",
        card_shadow_style: formData.get("card_shadow_style") || "soft",
      },
    },
  });

  if (!parsed.success) {
    redirectOnValidationError(parsed.error, "/admin/settings", "Settings save");
  }

  const submittedId = String(formData.get("id") || "");
  const settingsId = submittedId || (await getLatestSiteSettingsId(supabase));
  const settingsPayload = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };
  const { error } = settingsId
    ? await supabase
        .from("site_settings")
        .update(settingsPayload)
        .eq("id", settingsId)
    : await supabase.from("site_settings").insert(settingsPayload);

  if (error) {
    console.error("Site settings save error:", error);
    redirectWithCmsMessage(
      "/admin/settings",
      "error",
      `Settings could not be saved: ${error.message}`,
    );
  }

  const { data: existingHomepageSections, error: sectionReadError } = await supabase
    .from("page_content_sections")
    .select("section_key, section_type, content, order_index, status")
    .eq("page_slug", "/")
    .in("section_key", ["why_uganda", "quote_cta"]);
  redirectOnMutationError(
    sectionReadError,
    "/admin/settings",
    "Homepage content sync",
  );

  const existingSectionMap = new Map(
    (
      (existingHomepageSections || []) as Array<{
        section_key: string;
        section_type: string;
        content: Record<string, unknown> | null;
        order_index: number;
        status: "draft" | "published" | "archived";
      }>
    ).map((section) => [section.section_key, section]),
  );
  const existingWhy = existingSectionMap.get("why_uganda");
  const existingQuote = existingSectionMap.get("quote_cta");
  const { error: sectionSyncError } = await supabase.from("page_content_sections").upsert(
    [
      {
        page_slug: "/",
        section_key: "why_uganda",
        section_type: existingWhy?.section_type || "feature_split_with_quote_form",
        title: parsed.data.why_uganda_title,
        subtitle: parsed.data.why_uganda_eyebrow,
        content: {
          ...(existingWhy?.content || {}),
          intro: parsed.data.why_uganda_intro,
          body: parsed.data.why_uganda_paragraph,
        },
        order_index: existingWhy?.order_index ?? 20,
        status: existingWhy?.status || "published",
        updated_at: new Date().toISOString(),
      },
      {
        page_slug: "/",
        section_key: "quote_cta",
        section_type: existingQuote?.section_type || "cta_panel",
        title: parsed.data.cta_title,
        subtitle: parsed.data.cta_eyebrow,
        content: {
          ...(existingQuote?.content || {}),
          intro: parsed.data.cta_intro,
          primary_label: parsed.data.cta_button,
          primary_href: "/request-quote",
          secondary_label: "WhatsApp Jackfruit",
        },
        order_index: existingQuote?.order_index ?? 70,
        status: existingQuote?.status || "published",
        updated_at: new Date().toISOString(),
      },
    ],
    { onConflict: "page_slug,section_key" },
  );
  redirectOnMutationError(
    sectionSyncError,
    "/admin/settings",
    "Homepage content sync",
  );

  revalidateCmsRoutes(...sitewideCmsPaths);
  redirectWithCmsMessage("/admin/settings", "success", "Settings saved successfully.");
}

// Safari Package Actions
const safariSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  duration: z.string().min(1),
  route: z.string().min(1),
  start_point: z.string().min(1),
  end_point: z.string().optional(),
  summary: z.string().min(1),
  price_from: z.number().optional(),
  currency: z.string().default("USD"),
  comfort_levels: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  featured_image_url: z.string().url().optional().or(z.literal("")),
  permit_rate_warning: z.string().optional(),
});

export async function upsertSafariPackage(formData: FormData) {
  // Verify user with anon client
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use admin client for writes
  const supabase = await getAdminSupabase();

  const id = formData.get("id") as string;
  const isNew = !id;
  const featuredImageUrl =
    (await uploadImageFromForm(
      supabase,
      formData,
      "featured_image_file",
      `media/safari_packages/${id || "new"}`,
      `/admin/safaris/${id || "new"}`,
    )) ||
    formData.get("featured_image_url") ||
    undefined;

  const parsed = safariSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    duration: formData.get("duration"),
    route: formData.get("route"),
    start_point: formData.get("start_point"),
    end_point: formData.get("end_point") || undefined,
    summary: formData.get("summary"),
    price_from: formData.get("price_from") ? parseFloat(formData.get("price_from") as string) : undefined,
    currency: formData.get("currency") || "USD",
    comfort_levels: parseJsonField(formData.get("comfort_levels"), []),
    highlights: parseJsonField(formData.get("highlights"), []),
    included: parseJsonField(formData.get("included"), []),
    excluded: parseJsonField(formData.get("excluded"), []),
    status: formData.get("status") || "draft",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    featured_image_url: featuredImageUrl,
    permit_rate_warning: formData.get("permit_rate_warning") || undefined,
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      `/admin/safaris/${id || "new"}`,
      "Safari save",
    );
  }

  const { itinerary, accommodations, faqs } = parseSafariDetails(formData);

  const data: Record<string, unknown> = {
    id: isNew ? undefined : id,
    ...parsed.data,
    itinerary,
    accommodation_options: accommodations,
    faq: faqs,
    updated_at: new Date().toISOString(),
  };

  if (isNew) {
    data.created_at = new Date().toISOString();
  }

  const { error } = await supabase.from("safari_packages").upsert(data);
  redirectOnMutationError(error, `/admin/safaris/${id || "new"}`, "Safari save");
  revalidateCmsRoutes(
    "/",
    "/safaris",
    "/safaris/[slug]",
    "/destinations/[slug]",
    "/experiences/[slug]",
    "/request-quote",
  );
  redirect("/admin/safaris");
}

// Parse multi-day itinerary
function parseSafariDetails(formData: FormData) {
  const daysCount = parseInt(formData.get("days_count") as string) || 0;
  const itinerary = [];
  const accommodations = [];
  const faqs = [];

  // Parse itinerary days
  for (let i = 1; i <= daysCount; i++) {
    const day = formData.get(`day_${i}_number`) as string;
    const title = formData.get(`day_${i}_title`) as string;
    const body = formData.get(`day_${i}_body`) as string;
    const meals = formData.get(`day_${i}_meals`) as string;
    if (day && title) {
      itinerary.push({ day, title, body, meals });
    }
  }

  // Parse accommodations (up to 5 tiers)
  for (let i = 1; i <= 5; i++) {
    const tier = formData.get(`acc_${i}_tier`) as string;
    const options = formData.get(`acc_${i}_options`) as string;
    if (tier && options) {
      accommodations.push({ tier, options });
    }
  }

  // Parse FAQs (up to 10)
  for (let i = 1; i <= 10; i++) {
    const question = formData.get(`faq_${i}_question`) as string;
    const answer = formData.get(`faq_${i}_answer`) as string;
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return { itinerary, accommodations, faqs };
}

// Destination Actions
const destinationSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  region: z.string().optional(),
  overview: z.string().optional(),
  why_go: z.array(z.string()).optional(),
  top_experiences: z.array(z.string()).optional(),
  wildlife: z.array(z.string()).optional(),
  best_time: z.string().optional(),
  recommended_nights: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  featured_image_url: z.string().url().optional().or(z.literal("")),
});

export async function upsertDestination(formData: FormData) {
  // Verify user with anon client
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use admin client for writes
  const supabase = await getAdminSupabase();
  const id = formData.get("id") as string;
  const featuredImageUrl =
    (await uploadImageFromForm(
      supabase,
      formData,
      "featured_image_file",
      `media/destinations/${id || "new"}`,
      `/admin/destinations/${id || "new"}`,
    )) ||
    formData.get("featured_image_url") ||
    undefined;

  const parsed = destinationSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    region: formData.get("region") || undefined,
    overview: formData.get("overview") || undefined,
    why_go: parseJsonField(formData.get("why_go"), []),
    top_experiences: parseJsonField(formData.get("top_experiences"), []),
    wildlife: parseJsonField(formData.get("wildlife"), []),
    best_time: formData.get("best_time") || undefined,
    recommended_nights: formData.get("recommended_nights") || undefined,
    status: formData.get("status") || "draft",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    featured_image_url: featuredImageUrl,
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      `/admin/destinations/${id || "new"}`,
      "Destination save",
    );
  }

  const { error } = await supabase.from("destinations").upsert({
    id: id || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(error, `/admin/destinations/${id || "new"}`, "Destination save");
  revalidateCmsRoutes("/destinations", "/destinations/[slug]");
  redirect("/admin/destinations");
}

// Experience Actions
const experienceSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  featured_image_url: z.string().url().optional().or(z.literal("")),
});

export async function upsertExperience(formData: FormData) {
  // Verify user with anon client
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use admin client for writes
  const supabase = await getAdminSupabase();
  const id = formData.get("id") as string;
  const featuredImageUrl =
    (await uploadImageFromForm(
      supabase,
      formData,
      "featured_image_file",
      `media/experiences/${id || "new"}`,
      `/admin/experiences/${id || "new"}`,
    )) ||
    formData.get("featured_image_url") ||
    undefined;

  const parsed = experienceSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    category: formData.get("category") || undefined,
    summary: formData.get("summary") || undefined,
    description: formData.get("description") || undefined,
    duration: formData.get("duration") || undefined,
    location: formData.get("location") || undefined,
    status: formData.get("status") || "draft",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    featured_image_url: featuredImageUrl,
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      `/admin/experiences/${id || "new"}`,
      "Experience save",
    );
  }

  const bullets = parseJsonField(formData.get("bullets"), []);

  const { error } = await supabase.from("experiences").upsert({
    id: id || undefined,
    ...parsed.data,
    included: bullets,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(error, `/admin/experiences/${id || "new"}`, "Experience save");
  revalidateCmsRoutes("/", "/experiences", "/experiences/[slug]");
  redirect("/admin/experiences");
}

// Review Actions
const reviewSchema = z.object({
  guest_name: z.string().min(1),
  country: z.string().optional(),
  trip_type: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(1),
  source: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  permission_status: z.enum(["needs_permission", "approved", "rejected"]).default("needs_permission"),
  image_url: z.string().url().optional().or(z.literal("")),
});

export async function upsertReview(formData: FormData) {
  // Verify user with anon client
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use admin client for writes
  const supabase = await getAdminSupabase();
  const id = formData.get("id") as string;
  const imageUrl =
    (await uploadImageFromForm(
      supabase,
      formData,
      "image_file",
      `media/reviews/${id || "new"}`,
      `/admin/reviews/${id || "new"}`,
    )) ||
    formData.get("image_url") ||
    undefined;

  const parsed = reviewSchema.safeParse({
    guest_name: formData.get("guest_name"),
    country: formData.get("country") || undefined,
    trip_type: formData.get("trip_type"),
    rating: parseInt(formData.get("rating") as string) || 5,
    quote: formData.get("quote"),
    source: formData.get("source") || undefined,
    status: formData.get("status") || "draft",
    permission_status: formData.get("permission_status") || "needs_permission",
    image_url: imageUrl,
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      `/admin/reviews/${id || "new"}`,
      "Review save",
    );
  }

  const { error } = await supabase.from("reviews").upsert({
    id: id || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(error, `/admin/reviews/${id || "new"}`, "Review save");
  revalidateCmsRoutes("/", "/reviews");
  redirect("/admin/reviews");
}

// Media Upload Actions
export async function uploadMedia(formData: FormData) {
  // Verify user with anon client
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use admin client for writes
  const supabase = await getAdminSupabase();

  const altText = formData.get("alt_text") as string;
  const entityType = formData.get("entity_type") as string;
  const entityId = formData.get("entity_id") as string;

  if (!entityType) {
    redirectWithCmsMessage("/admin", "error", "Media upload needs an entity type.");
  }

  const publicUrl = await uploadImageFromForm(
    supabase,
    formData,
    "file",
    `${entityType}/${entityId || "general"}`,
    "/admin",
  );
  if (!publicUrl) {
    redirectWithCmsMessage("/admin", "error", "Please choose an image to upload.");
  }

  // Store metadata
  const { error: mediaError } = await supabase.from("gallery_media").insert({
    media_url: publicUrl,
    alt_text: altText || "CMS image",
    entity_type: entityType,
    entity_id: entityId || null,
    status: "published",
  });
  redirectOnMutationError(mediaError, "/admin", "Media save");
  revalidatePath("/", "layout");
  redirectWithCmsMessage("/admin", "success", "Image uploaded successfully.");
}

// Delete entity
export async function deleteEntity(table: string, id: string) {
  // Verify user with anon client
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use admin client for writes
  const supabase = await getAdminSupabase();

  const { error } = await supabase.from(table).delete().eq("id", id);
  redirectOnMutationError(error, "/admin", "Delete");
  const publicPathsByTable: Record<string, string[]> = {
    safari_packages: ["/", "/safaris", "/safaris/[slug]", "/request-quote"],
    destinations: ["/destinations", "/destinations/[slug]"],
    experiences: ["/", "/experiences", "/experiences/[slug]"],
    reviews: ["/", "/reviews"],
    pages: ["/", "/contact", "/request-quote", "/transport/airport-transfers"],
  };
  revalidateCmsRoutes(...(publicPathsByTable[table] || ["/"]));
  redirect(`/admin/${table === "safari_packages" ? "safaris" : table === "inquiry_leads" ? "leads" : table}`);
}
// Page Actions
const pageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  hero: z.record(z.string(), z.any()).optional(),
  sections: z.array(z.any()).optional(),
  featured_image_url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_image_url: z.string().url().optional().or(z.literal("")),
});

export async function upsertPage(formData: FormData) {
  // Verify user with anon client
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use admin client for writes
  const supabase = await getAdminSupabase();
  const id = formData.get("id") as string;
  const featuredImageUrl =
    (await uploadImageFromForm(supabase, formData, "featured_image_file", `media/pages/${id || "new"}`, `/admin/pages/${id || "new"}`)) ||
    formData.get("featured_image_url") ||
    undefined;
  const metaImageUrl =
    (await uploadImageFromForm(supabase, formData, "meta_image_file", `media/pages/${id || "new"}/seo`, `/admin/pages/${id || "new"}`)) ||
    formData.get("meta_image_url") ||
    undefined;

  const parsed = pageSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary") || undefined,
    hero: parseJsonField(formData.get("hero"), undefined),
    sections: parseJsonField(formData.get("sections"), undefined),
    featured_image_url: featuredImageUrl,
    status: formData.get("status") || "draft",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    meta_image_url: metaImageUrl,
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      `/admin/pages/${id || "new"}`,
      "Page save",
    );
  }

  const { error } = await supabase.from("pages").upsert({
    id: id || undefined,
    ...parsed.data,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  });
  redirectOnMutationError(error, `/admin/pages/${id || "new"}`, "Page save");

  const publicSlug =
    parsed.data.slug === "home" || parsed.data.slug === "/"
      ? "/"
      : `/${parsed.data.slug.replace(/^\/+/, "")}`;
  const { error: heroSyncError } = await supabase.from("page_heroes").upsert(
    {
      page_slug: publicSlug,
      title: parsed.data.title,
      intro: parsed.data.summary,
      background_image: parsed.data.featured_image_url,
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "page_slug" },
  );
  redirectOnMutationError(
    heroSyncError,
    `/admin/pages/${id || "new"}`,
    "Page hero sync",
  );

  revalidateCmsRoutes("/", publicSlug);
  redirect(`/admin/pages`);
}

// Homepage Section Actions
const homepageSectionSchema = z.object({
  section_type: z.string().min(1),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.record(z.string(), z.any()).optional(),
  order_index: z.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function upsertHomepageSection(formData: FormData) {
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  const supabase = await getAdminSupabase();
  const contentFromFields = {
    subtitle: formData.get("content_subtitle") || undefined,
    cta_primary: formData.get("content_cta_primary") || undefined,
    cta_secondary: formData.get("content_cta_secondary") || undefined,
    background_image:
      (await uploadImageFromForm(supabase, formData, "background_image_file", "media/homepage/hero", "/admin/homepage/hero")) ||
      formData.get("background_image") ||
      undefined,
  };
  const content = formData.has("content_subtitle")
    ? Object.fromEntries(
        Object.entries(contentFromFields).filter(([, value]) => Boolean(value)),
      )
    : parseJsonField(formData.get("content"), {});

  const parsed = homepageSectionSchema.safeParse({
    section_type: formData.get("section_type"),
    title: formData.get("title") || undefined,
    subtitle: formData.get("subtitle") || undefined,
    content,
    order_index: parseInt(formData.get("order_index") as string) || 0,
    status: formData.get("status") || "published",
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      "/admin/homepage/hero",
      "Homepage section save",
    );
  }

  const { error } = await supabase.from("homepage_sections").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(error, "/admin/homepage/hero", "Homepage section save");

  if (parsed.data.section_type === "hero") {
    const settingsPatch = {
      hero_title: parsed.data.title,
      badge_text: parsed.data.subtitle,
      hero_subtitle: parsed.data.content?.subtitle,
      cta_primary: parsed.data.content?.cta_primary,
      cta_secondary: parsed.data.content?.cta_secondary,
      hero_image: parsed.data.content?.background_image,
      updated_at: new Date().toISOString(),
    };
    const { data: existingSettings } = await supabase
      .from("site_settings")
      .select("id")
      .order("updated_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSettings?.id) {
      const { error: settingsError } = await supabase
        .from("site_settings")
        .update(settingsPatch)
        .eq("id", existingSettings.id);
      redirectOnMutationError(settingsError, "/admin/homepage/hero", "Homepage settings sync");
    } else {
      const { error: settingsError } = await supabase.from("site_settings").insert({
        business_name: "Jackfruit Safaris Uganda",
        ...settingsPatch,
      });
      redirectOnMutationError(settingsError, "/admin/homepage/hero", "Homepage settings sync");
    }
  }

  revalidateCmsRoutes("/");
  redirect("/admin/homepage");
}

// Quick Link Actions
const quickLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  order_index: z.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function upsertQuickLink(formData: FormData) {
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  const supabase = await getAdminSupabase();

  const parsed = quickLinkSchema.safeParse({
    label: formData.get("label"),
    href: formData.get("href"),
    order_index: parseInt(formData.get("order_index") as string) || 0,
    status: formData.get("status") || "published",
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      "/admin/homepage/quick-links",
      "Quick link save",
    );
  }

  const { error } = await supabase.from("homepage_quick_links").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(error, "/admin/homepage/quick-links", "Quick link save");

  revalidateCmsRoutes("/");
  redirect("/admin/homepage/quick-links");
}

// Trust Item Actions
const trustItemSchema = z.object({
  text: z.string().min(1),
  order_index: z.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function upsertTrustItem(formData: FormData) {
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  const supabase = await getAdminSupabase();

  const parsed = trustItemSchema.safeParse({
    text: formData.get("text"),
    order_index: parseInt(formData.get("order_index") as string) || 0,
    status: formData.get("status") || "published",
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      "/admin/homepage/trust-items",
      "Trust item save",
    );
  }

  const { error } = await supabase.from("homepage_trust_items").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(error, "/admin/homepage/trust-items", "Trust item save");

  revalidateCmsRoutes("/");
  redirect("/admin/homepage/trust-items");
}

// Feature Actions
const featureSchema = z.object({
  icon_name: z.string().min(1),
  text: z.string().min(1),
  order_index: z.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function upsertFeature(formData: FormData) {
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  const supabase = await getAdminSupabase();

  const parsed = featureSchema.safeParse({
    icon_name: formData.get("icon_name"),
    text: formData.get("text"),
    order_index: parseInt(formData.get("order_index") as string) || 0,
    status: formData.get("status") || "published",
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      "/admin/homepage/features",
      "Feature save",
    );
  }

  const { error } = await supabase.from("homepage_features").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(error, "/admin/homepage/features", "Feature save");

  revalidateCmsRoutes("/");
  redirect("/admin/homepage/features");
}

// Guide Article Actions
const guideArticleSchema = z.object({
  title: z.string().min(1),
  order_index: z.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function upsertGuideArticle(formData: FormData) {
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  const supabase = await getAdminSupabase();

  const parsed = guideArticleSchema.safeParse({
    title: formData.get("title"),
    order_index: parseInt(formData.get("order_index") as string) || 0,
    status: formData.get("status") || "published",
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      "/admin/homepage/guide-articles",
      "Guide article save",
    );
  }

  const { error } = await supabase.from("homepage_guide_articles").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(error, "/admin/homepage/guide-articles", "Guide article save");

  revalidateCmsRoutes("/", "/travel-guide");
  redirect("/admin/homepage/guide-articles");
}

// Page Hero Actions
const pageHeroSchema = z.object({
  page_slug: z.string().min(1),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  intro: z.string().optional(),
  background_image: z.string().url().optional().or(z.literal("")),
  content: z.record(z.string(), z.any()).optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function upsertPageHero(formData: FormData) {
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  const supabase = await getAdminSupabase();
  const backgroundImage =
    (await uploadImageFromForm(
      supabase,
      formData,
      "background_image_file",
      `media/page_heroes/${String(formData.get("page_slug") || "page").replace(/[^a-zA-Z0-9-]/g, "_")}`,
      `/admin/pages/heroes/${formData.get("id") || "new"}`,
    )) ||
    formData.get("background_image") ||
    undefined;

  const detailContent = Object.fromEntries(
    [
      "why_jackfruit_title",
      "why_jackfruit_body",
      "where_operates_title",
      "where_operates_body",
      "guiding_style_title",
      "guiding_style_body",
      "services_title",
      "services_intro",
    ]
      .map((key) => [key, formData.get(key)])
      .filter(([, value]) => typeof value === "string" && value.trim()),
  );

  const parsed = pageHeroSchema.safeParse({
    page_slug: formData.get("page_slug"),
    eyebrow: formData.get("eyebrow") || undefined,
    title: formData.get("title") || undefined,
    intro: formData.get("intro") || undefined,
    background_image: backgroundImage,
    content: Object.keys(detailContent).length ? detailContent : undefined,
    status: formData.get("status") || "published",
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      `/admin/pages/heroes/${formData.get("id") || "new"}`,
      "Page hero save",
    );
  }

  const { content, ...heroFields } = parsed.data;
  const { error } = await supabase.from("page_heroes").upsert({
    id: formData.get("id") as string || undefined,
    ...heroFields,
    ...(content ? { content } : {}),
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(
    error,
    `/admin/pages/heroes/${formData.get("id") || "new"}`,
    "Page hero save",
  );

  revalidateCmsRoutes(parsed.data.page_slug);
  redirect("/admin/pages");
}

// Page Content Section Actions
const pageContentSectionSchema = z.object({
  page_slug: z.string().min(1),
  section_key: z.string().min(1),
  section_type: z.string().min(1),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.record(z.string(), z.any()).optional(),
  order_index: z.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function upsertPageContentSection(formData: FormData) {
  const anonClient = await getSupabase();
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user) redirect("/auth/login");

  const parsed = pageContentSectionSchema.safeParse({
    page_slug: formData.get("page_slug"),
    section_key: formData.get("section_key"),
    section_type: formData.get("section_type"),
    title: formData.get("title") || undefined,
    subtitle: formData.get("subtitle") || undefined,
    content: parseJsonField(formData.get("content"), {}),
    order_index: parseInt(formData.get("order_index") as string) || 0,
    status: formData.get("status") || "published",
  });

  if (!parsed.success) {
    redirectOnValidationError(
      parsed.error,
      `/admin/pages/content/${formData.get("id") || "new"}`,
      "Page content save",
    );
  }

  const supabase = await getAdminSupabase();
  const { error } = await supabase.from("page_content_sections").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirectOnMutationError(
    error,
    `/admin/pages/content/${formData.get("id") || "new"}`,
    "Page content save",
  );

  revalidateCmsRoutes(parsed.data.page_slug);
  redirect(`/admin/pages/content?page=${encodeURIComponent(parsed.data.page_slug)}`);
}
