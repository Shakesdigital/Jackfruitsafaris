/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  // Try multiple env var names for flexibility
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL_KEY || process.env.SUPABASE_URL || process.env.SUPABASE_URL_KEY;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  console.log("SUPABASE CLIENT INIT:", {
    hasUrl: !!url,
    hasKey: !!key,
    urlPrefix: url ? url.substring(0, 30) + "..." : "undefined"
  });

  if (!url || !key) {
    // Return a mock client that will fail gracefully
    console.log("SUPABASE RETURNING MOCK - NOT CONFIGURED");
    // Create a chainable mock that supports eq().eq().order() and eq().order()
    const emptyResult = { data: [], error: null };
    const nullResult = { data: null, error: null };
    const chainable: any = {
      eq: () => ({ ...chainable }),
      order: () => ({ ...emptyResult }),
      single: () => ({ ...nullResult }),
      all: () => ({ ...emptyResult }),
    };
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ error: { message: "Not configured: check NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_SUPABASE_ANON_KEY" } }),
        signOut: async () => ({}),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({ ...chainable }),
      }),
    } as any;
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[], _headers?: Record<string, string>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method may be called from a Server Component
          }
        },
      },
    }
  );
}

// For use in Server Actions - uses service role key for admin operations
export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL_KEY || process.env.SUPABASE_URL || process.env.SUPABASE_URL_KEY;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SUPABASE_SECRET_KEY;

  if (!url || !key) {
    // Return a mock client that will fail gracefully
    console.log("SUPABASE ADMIN CLIENT: service role key not configured");
    const emptyResult = { data: [], error: null };
    const nullResult = { data: null, error: null };
    const chainable: any = {
      eq: () => ({ ...chainable }),
      order: () => ({ ...emptyResult }),
      single: () => ({ ...nullResult }),
      all: () => ({ ...emptyResult }),
    };
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        from: () => ({
          select: () => ({ ...chainable }),
          upsert: async () => ({}),
          insert: async () => ({}),
          delete: () => ({ ...chainable }),
        }),
        storage: {
          from: () => ({
            upload: async () => ({ error: { message: "Not configured" } }),
            getPublicUrl: () => ({ data: { publicUrl: "" } }),
          }),
        },
      },
    } as any;
  }

  const { createClient: supabaseCreateClient } = await import("@supabase/supabase-js");
  return supabaseCreateClient(url, key, {
    auth: { persistSession: false },
  });
}