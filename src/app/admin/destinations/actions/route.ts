import { upsertDestination, deleteEntity } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  const deleteId = formData.get("delete");
  if (deleteId) {
    return deleteEntity("destinations", deleteId as string);
  }
  
  return upsertDestination(formData);
}

export async function GET() {
  return NextResponse.redirect(new URL("/admin/destinations"));
}
