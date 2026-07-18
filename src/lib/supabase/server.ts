/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function createClient() {
  // Try multiple env var names for flexibility
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL_KEY || process.env.SUPABASE_URL_KEY || process.env.SUPABASE_URL;
  const key = process.env.NEXT_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  console.log("SUPABASE CLIENT INIT:", { 
    hasUrl: !!url, 
    hasKey: !!key,
    urlPrefix: url ? url.substring(0, 30) + "..." : "undefined"
  });

  if (!url || !key) {
    // Return a mock client that will fail gracefully
    console.log("SUPABASE RETURNING MOCK - NOT CONFIGURED");
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ error: { message: "Not configured: check NEXT_PUBLIC_SUPABASE_URL_KEY and NEXT_SUPABASE_ANON_KEY" } }),
        signOut: async () => ({}),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }),
      }),
    } as any;
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createSupabaseClient(
    url,
    key,
    {
      global: {
        headers: {
          cookie: cookieStore.getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; "),
        },
      },
    }
  );
}
