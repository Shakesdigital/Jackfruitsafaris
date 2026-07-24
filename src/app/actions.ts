"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const inquirySchema = z.object({
  first_name: z.string().min(1).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(80).optional(),
  service_type: z.string().max(120),
  travel_dates: z.string().max(120).optional(),
  group_size: z.string().max(40).optional(),
  budget_range: z.string().max(120).optional(),
  interests: z.string().max(400).optional(),
  message: z.string().min(4).max(2500),
  source_page: z.string().max(240).optional(),
});

export async function createInquiry(formData: FormData) {
  const parsed = inquirySchema.safeParse({
    first_name: formData.get("first_name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    service_type: formData.get("service_type") || "custom safari",
    travel_dates: formData.get("travel_dates") || undefined,
    group_size: formData.get("group_size") || undefined,
    budget_range: formData.get("budget_range") || undefined,
    interests: formData.get("interests") || undefined,
    message: formData.get("message"),
    source_page: formData.get("source_page") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  await supabase.from("inquiry_leads").insert({
    ...parsed.data,
    status: "new",
  });
}
