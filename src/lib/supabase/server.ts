/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from "@supabase/ssr";

const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

export async function createClient() {
  // Try multiple env var names for flexibility
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL_KEY || process.env.SUPABASE_URL || process.env.SUPABASE_URL_KEY;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a mock client that will fail gracefully
    const nullResult = { data: null, error: null };
    const emptyResult = { data: [], error: null };
    const chainable: any = {
      eq: () => ({ ...chainable }),
      order: () => ({ ...chainable }),
      single: () => ({ ...nullResult }),
      all: () => ({ ...emptyResult }),
      maybeSingle: () => ({ ...nullResult }),
      limit: () => ({ ...chainable }),
      select: () => ({ ...chainable }),
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
        insert: () => ({ ...chainable }),
        update: () => ({ ...chainable }),
        delete: () => ({ ...chainable }),
        upsert: () => ({ ...chainable }),
      }),
      rpc: async () => ({ data: null, error: { message: "RPC not available: missing Supabase env vars" } }),
    } as any;
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    return createServerClient(
      url,
      key,
      {
        global: {
          fetch: noStoreFetch,
        },
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
  } catch {
    // In production builds without proper cookie context, fallback to anon client
    const { createClient: supabaseCreateClient } = await import("@supabase/supabase-js");
    return supabaseCreateClient(url, key, {
      global: { fetch: noStoreFetch },
    });
  }
}

// Admin client that uses service role key to bypass RLS
export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL_KEY || process.env.SUPABASE_URL || process.env.SUPABASE_URL_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) {
    // Fallback to anon key if service role not available
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!anonKey) {
      const emptyResult = { data: [], error: null };
      const nullResult = { data: null, error: null };
      const chainable: any = {
        eq: () => ({ ...chainable }),
        order: () => ({ ...chainable }),
        single: () => ({ ...nullResult }),
        all: () => ({ ...emptyResult }),
        limit: () => ({ ...chainable }),
        maybeSingle: () => ({ ...nullResult }),
      };
      return {
        from: () => ({
          select: () => ({ ...chainable }),
          upsert: async () => ({}),
          insert: async () => ({}),
          delete: () => ({ ...chainable }),
        }),
      } as any;
    }
    // Return anon client without cookie handling (for build-time/static generation)
    const { createClient: supabaseCreateClient } = await import("@supabase/supabase-js");
    return supabaseCreateClient(url!, anonKey);
  }

  // Use service role key for admin operations
  const { createClient: supabaseCreateClient } = await import("@supabase/supabase-js");
  return supabaseCreateClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
