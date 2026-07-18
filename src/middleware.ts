import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for login and static files
  if (pathname.startsWith("/auth/login") || pathname.startsWith("/_next")) {
    return;
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Check for any Supabase auth cookies - Supabase uses various cookie formats
    // based on project configuration
    const allCookies = request.cookies.getAll();
    const hasSupabaseCookie = allCookies.some(cookie => 
      cookie.name.startsWith("sb:") || 
      cookie.name.includes("supabase") ||
      cookie.name === "sb-access-token"
    );
    
    if (!hasSupabaseCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
