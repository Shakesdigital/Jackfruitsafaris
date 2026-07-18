import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for login and static files
  if (pathname.startsWith("/auth/login") || pathname.startsWith("/_next")) {
    return;
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Check for Supabase auth cookies - Supabase uses sb:token format
    const supabaseToken = request.cookies.get("sb:token");
    const sbAccessToken = request.cookies.get("sb-access-token"); // fallback
    
    if (!supabaseToken && !sbAccessToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
