import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Try multiple env var names
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL_KEY || process.env.SUPABASE_URL_KEY || process.env.SUPABASE_URL;
  const key = process.env.NEXT_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    const errorUrl = new URL("/auth/login", request.url);
    errorUrl.searchParams.set("error", encodeURIComponent("Server misconfigured - check environment variables"));
    return NextResponse.redirect(errorUrl);
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorUrl = new URL("/auth/login", request.url);
    errorUrl.searchParams.set("error", encodeURIComponent(error.message));
    return NextResponse.redirect(errorUrl);
  }

  // Successful login - redirect to admin
  // Supabase will set cookies via Set-Cookie headers in the response
  const response = NextResponse.redirect(new URL("/admin", request.url));
  
  return response;
}
