import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for login and static files
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/_next")) {
    return;
  }

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin")) {
    const accessToken = request.cookies.get("sb-access-token");

    if (!accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};