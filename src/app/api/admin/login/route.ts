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
    return NextResponse.json({ 
      error: "Server misconfigured", 
      details: {
        hasUrl: !!url,
        hasKey: !!key,
        checked: ["NEXT_PUBLIC_SUPABASE_URL_KEY", "SUPABASE_URL_KEY", "SUPABASE_URL"]
      }
    }, { status: 500 });
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Set cookie and redirect
  const response = NextResponse.redirect(new URL("/admin", request.url));
  
  // Supabase sets cookies automatically - this is handled by the client
  return response;
}

export async function GET() {
  return NextResponse.redirect(new URL("/auth/login"));
}
