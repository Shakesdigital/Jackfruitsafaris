import { upsertPage, deleteEntity } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  // Check if this is a delete action
  const deleteId = formData.get("delete");
  if (deleteId) {
    return deleteEntity("pages", deleteId as string);
  }
  
  // Otherwise, it's an upsert
  return upsertPage(formData);
}

export async function GET() {
  return NextResponse.redirect(new URL("/admin/pages"));
}
