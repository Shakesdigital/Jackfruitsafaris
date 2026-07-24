import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Create the response first
  const response = NextResponse.redirect(new URL("/admin", request.url));

  // Get the response's cookie store to set cookies on it
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const errorUrl = new URL("/auth/login", request.url);
    errorUrl.searchParams.set("error", encodeURIComponent("Server misconfigured - check environment variables"));
    return NextResponse.redirect(errorUrl);
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[], _headers?: Record<string, string>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              path: options?.path ?? "/",
              httpOnly: options?.httpOnly ?? true,
              secure: options?.secure ?? process.env.NODE_ENV === "production",
              sameSite: options?.sameSite ?? "lax",
              maxAge: options?.maxAge,
              domain: options?.domain,
            });
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorUrl = new URL("/auth/login", request.url);
    errorUrl.searchParams.set("error", encodeURIComponent(error.message));
    return NextResponse.redirect(errorUrl);
  }

  // Successful login - cookies already set on response by setAll
  return response;
}