import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For now, skip all middleware - auth handled in pages
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
