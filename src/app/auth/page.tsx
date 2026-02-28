"use client";

import { FormEvent, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus("Auth not configured yet (missing Supabase env vars).");
      return;
    }

    const redirectTo = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setStatus(error ? error.message : "Magic link sent. Check your inbox.");
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600">Use a magic link (passwordless).</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          className="w-full rounded border p-2"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
        />
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          Send magic link
        </button>
      </form>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </main>
  );
}
