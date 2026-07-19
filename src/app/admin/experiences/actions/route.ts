import { upsertExperience, deleteEntity } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  const deleteId = formData.get("delete");
  if (deleteId) {
    return deleteEntity("experiences", deleteId as string);
  }
  
  return upsertExperience(formData);
}

export async function GET() {
  return NextResponse.redirect(new URL("/admin/experiences"));
}
