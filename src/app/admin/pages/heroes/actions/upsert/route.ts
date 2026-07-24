import { upsertPageHero } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  await upsertPageHero(formData);
  return NextResponse.redirect(new URL("/admin/pages/heroes"));
}