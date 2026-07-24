import { upsertHomepageSection } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  await upsertHomepageSection(formData);
  return NextResponse.redirect(new URL("/admin/homepage"));
}