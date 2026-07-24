import { upsertFeature } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  await upsertFeature(formData);
  return NextResponse.redirect(new URL("/admin/homepage/features"));
}