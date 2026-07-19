"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

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
  social_links: z.record(z.any()).optional(),
  footer_copy: z.string().optional(),
  seo: z.record(z.any()).optional(),
  integrations: z.record(z.any()).optional(),
});

export async function upsertSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const parsed = siteSettingsSchema.safeParse({
    business_name: formData.get("business_name"),
    logo_url: formData.get("logo_url") || undefined,
    favicon_url: formData.get("favicon_url") || undefined,
    contact_email: formData.get("contact_email") || undefined,
    phone: formData.get("phone") || undefined,
    whatsapp_number: formData.get("whatsapp_number") || undefined,
    whatsapp_message: formData.get("whatsapp_message") || undefined,
    alternate_phone: formData.get("alternate_phone") || undefined,
    address: formData.get("address") || undefined,
    operating_hours: formData.get("operating_hours") || undefined,
    social_links: formData.get("social_links") ? JSON.parse(formData.get("social_links") as string) : undefined,
    footer_copy: formData.get("footer_copy") || undefined,
    seo: formData.get("seo") ? JSON.parse(formData.get("seo") as string) : undefined,
    integrations: formData.get("integrations") ? JSON.parse(formData.get("integrations") as string) : undefined,
  });

  if (!parsed.success) return;

  await supabase.from("site_settings").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
  });
  redirect("/admin/settings");
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const id = formData.get("id") as string;
  const isNew = !id;

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
    comfort_levels: formData.get("comfort_levels") ? JSON.parse(formData.get("comfort_levels") as string) : [],
    highlights: formData.get("highlights") ? JSON.parse(formData.get("highlights") as string) : [],
    included: formData.get("included") ? JSON.parse(formData.get("included") as string) : [],
    excluded: formData.get("excluded") ? JSON.parse(formData.get("excluded") as string) : [],
    status: formData.get("status") || "draft",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    featured_image_url: formData.get("featured_image_url") || undefined,
    permit_rate_warning: formData.get("permit_rate_warning") || undefined,
  });

  if (!parsed.success) {
    console.error("Safari validation error:", parsed.error);
    return;
  }

  const { itinerary, accommodations, faqs } = parseSafariDetails(formData);

  const data: any = {
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

  await supabase.from("safari_packages").upsert(data);
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const parsed = destinationSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    region: formData.get("region") || undefined,
    overview: formData.get("overview") || undefined,
    why_go: formData.get("why_go") ? JSON.parse(formData.get("why_go") as string) : [],
    top_experiences: formData.get("top_experiences") ? JSON.parse(formData.get("top_experiences") as string) : [],
    wildlife: formData.get("wildlife") ? JSON.parse(formData.get("wildlife") as string) : [],
    best_time: formData.get("best_time") || undefined,
    recommended_nights: formData.get("recommended_nights") || undefined,
    status: formData.get("status") || "draft",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    featured_image_url: formData.get("featured_image_url") || undefined,
  });

  if (!parsed.success) {
    console.error("Destination validation error:", parsed.error);
    return;
  }

  await supabase.from("destinations").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

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
    featured_image_url: formData.get("featured_image_url") || undefined,
  });

  if (!parsed.success) {
    console.error("Experience validation error:", parsed.error);
    return;
  }

  const bullets = formData.get("bullets")
    ? JSON.parse(formData.get("bullets") as string)
    : [];

  await supabase.from("experiences").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    included: bullets,
    updated_at: new Date().toISOString(),
  });
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const parsed = reviewSchema.safeParse({
    guest_name: formData.get("guest_name"),
    country: formData.get("country") || undefined,
    trip_type: formData.get("trip_type"),
    rating: parseInt(formData.get("rating") as string) || 5,
    quote: formData.get("quote"),
    source: formData.get("source") || undefined,
    status: formData.get("status") || "draft",
    permission_status: formData.get("permission_status") || "needs_permission",
    image_url: formData.get("image_url") || undefined,
  });

  if (!parsed.success) {
    console.error("Review validation error:", parsed.error);
    return;
  }

  await supabase.from("reviews").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });
  redirect("/admin/reviews");
}

// Media Upload Actions
export async function uploadMedia(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const file = formData.get("file") as File;
  const altText = formData.get("alt_text") as string;
  const entityType = formData.get("entity_type") as string;
  const entityId = formData.get("entity_id") as string;

  if (!file || !entityType) return;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const path = `${entityType}/${entityId || "general"}/${fileName}`;

  const { error } = await supabase.storage
    .from("cms-media")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return;
  }

  const { data: urlData } = supabase.storage.from("cms-media").getPublicUrl(path);

  // Store metadata
  await supabase.from("gallery_media").insert({
    media_url: urlData.publicUrl,
    alt_text: altText || file.name,
    entity_type: entityType,
    entity_id: entityId || null,
    status: "published",
  });
}

// Delete entity
export async function deleteEntity(table: string, id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  await supabase.from(table).delete().eq("id", id);
  redirect(`/admin/${table === "safari_packages" ? "safaris" : table === "inquiry_leads" ? "leads" : table}`);
}
// Page Actions
const pageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  hero: z.record(z.any()).optional(),
  sections: z.array(z.any()).optional(),
  featured_image_url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_image_url: z.string().url().optional().or(z.literal("")),
});

export async function upsertPage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const parsed = pageSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary") || undefined,
    hero: formData.get("hero") ? JSON.parse(formData.get("hero") as string) : undefined,
    sections: formData.get("sections") ? JSON.parse(formData.get("sections") as string) : undefined,
    featured_image_url: formData.get("featured_image_url") || undefined,
    status: formData.get("status") || "draft",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    meta_image_url: formData.get("meta_image_url") || undefined,
  });

  if (!parsed.success) return;

  const { data } = await supabase.from("pages").upsert({
    id: formData.get("id") as string || undefined,
    ...parsed.data,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  }).select().single();

  redirect(`/admin/pages`);
}
