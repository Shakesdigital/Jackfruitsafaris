/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_KEY;
const supabaseAnonKey = process.env.NEXT_SUPABASE_ANON_KEY;

// Server-side client creator with cookies (lazy - only called when needed)
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL_KEY;
  const key = process.env.NEXT_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a mock client that will fail gracefully
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ error: { message: "Not configured" } }),
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