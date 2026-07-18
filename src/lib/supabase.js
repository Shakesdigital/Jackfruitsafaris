// src/lib/supabase.js
// A minimal Supabase client wrapper for the Jackfruit Safaris project
//
// 1. The client uses the public anon key for client‑side requests.
// 2. For privileged server‑side operations you can export a separate
//    client that uses the service‑role key. Import it only in
//    getStaticProps / API routes.
//
// 3. All environment variables are loaded from Vercel/Netlify’s
//    deployment environment. When running locally you can create a
//    .env.local file that looks like:
//      SUPABASE_URL=https://xxxxx.supabase.co
//      SUPABASE_ANON_KEY=xxxxxxxx
//      SUPABASE_SERVICE_ROLE_KEY=xxxxxxxx
//    (Make sure the file is ignored by git – your repo’s .gitignore
//    already takes care of that.)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Public client – can be used from browser components
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    // Persist the session on the router for client‑side navigation.
    auth: { persistSession: true },
  }
);

// Optional: server‑side client for privileged ops
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: eager‑load all rows from a table with optional filter.
export const fetchTable = async (table, options = {}) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(`Supabase fetch error on ${table}`, error);
    return [];
  }
  return data || [];
};
