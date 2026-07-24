import { upsertPageHero } from "@/lib/server/cms-actions";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  return upsertPageHero(formData);
}