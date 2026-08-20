import { upsertGalleryMedia, deleteEntity } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const deleteId = formData.get("delete");
  if (deleteId) {
    return deleteEntity("gallery_media", deleteId as string);
  }

  return upsertGalleryMedia(formData);
}

export function GET() {
  return NextResponse.redirect(new URL("/admin/gallery", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
