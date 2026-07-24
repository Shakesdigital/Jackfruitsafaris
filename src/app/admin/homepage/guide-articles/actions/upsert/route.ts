import { upsertGuideArticle } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  await upsertGuideArticle(formData);
  return NextResponse.json({ success: true });
}