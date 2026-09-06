import { upsertTravelGuideArticle, deleteEntity } from "@/lib/server/cms-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const deleteId = formData.get("delete");
  if (deleteId) {
    return deleteEntity("travel_guide_articles", deleteId as string);
  }

  return upsertTravelGuideArticle(formData);
}
