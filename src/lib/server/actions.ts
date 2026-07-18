"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  // Log for debugging (remove after fixing)
  console.log("LOGIN ATTEMPT:", { email, hasClient: !!supabase });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("LOGIN RESULT:", { error: error?.message, hasUser: !!data?.user });

  if (error) {
    console.log("LOGIN ERROR REDIRECT:", `/auth/login?error=${encodeURIComponent(error.message)}`);
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
    return;
  }

  console.log("LOGIN SUCCESS REDIRECT TO /admin");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
