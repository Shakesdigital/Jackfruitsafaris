import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const cmsPaths = [
  "/",
  "/admin",
  "/admin/safaris",
  "/admin/destinations",
  "/admin/experiences",
  "/admin/reviews",
  "/admin/pages",
  "/admin/homepage",
  "/admin/settings",
  "/safaris",
  "/safaris/[slug]",
  "/destinations",
  "/destinations/[slug]",
  "/experiences",
  "/experiences/[slug]",
  "/reviews",
  "/travel-guide",
  "/request-quote",
];

const cmsTags = ["cms", "site-settings", "published-content"];

function revalidateCmsPath(path: string) {
  if (!path || typeof path !== "string") return;
  if (path.includes("[")) {
    revalidatePath(path, "page");
    return;
  }

  revalidatePath(path);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const paths = Array.isArray(body.paths) ? body.paths : [];
    const tags = Array.isArray(body.tags) ? body.tags : [];

    for (const tag of new Set([...cmsTags, ...tags])) {
      if (typeof tag === "string" && tag) {
        revalidateTag(tag, "max");
      }
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    for (const path of new Set([...cmsPaths, ...paths])) {
      revalidateCmsPath(String(path));
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cache clearing failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear cache",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "CMS cache monitoring endpoint",
    cmsPaths: cmsPaths.length,
    cmsTags,
    environment: process.env.NODE_ENV,
  });
}
