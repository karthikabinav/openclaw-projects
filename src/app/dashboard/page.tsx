"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { getSupabaseClient } from "@/lib/supabase";

type Checkin = {
  checkin_date: string;
  did_complete: boolean;
  note: string | null;
};

export default function DashboardPage() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [note, setNote] = useState("");
  const [didComplete, setDidComplete] = useState(true);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<string>("inactive");

  const streak = useMemo(() => {
    const sorted = [...checkins].sort((a, b) => (a.checkin_date < b.checkin_date ? 1 : -1));
    let s = 0;
    for (const c of sorted) {
      if (c.did_complete) s += 1;
      else break;
    }
    return s;
  }, [checkins]);

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setStatus("Supabase not configured. Add env vars to enable auth/data.");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setStatus("Not signed in. Use /auth first.");
        return;
      }
      setEmail(user.email ?? null);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();
      if (sub?.status) setSubStatus(sub.status);

      const { data, error } = await supabase
        .from("checkins")
        .select("checkin_date,did_complete,note")
        .eq("user_id", user.id)
        .order("checkin_date", { ascending: false })
        .limit(30);

      if (error) setStatus(error.message);
      else setCheckins((data as Checkin[]) || []);
    };

    void run();
  }, []);

  async function submitCheckin(e: FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const { error } = await supabase.from("checkins").upsert(
      {
        user_id: user.id,
        checkin_date: today,
        did_complete: didComplete,
        note: note || null,
      },
      { onConflict: "user_id,checkin_date" }
    );

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Saved");
    const { data } = await supabase
      .from("checkins")
      .select("checkin_date,did_complete,note")
      .eq("user_id", user.id)
      .order("checkin_date", { ascending: false })
      .limit(30);
    setCheckins((data as Checkin[]) || []);
  }

  async function subscribe() {
    const res = await fetch("/api/create-checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setStatus(data.error || "Unable to start checkout");
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">{email ?? "No signed-in user"}</p>
      <p className="mt-1 text-sm">Subscription: <b>{subStatus}</b></p>

      {subStatus !== "active" && (
        <div className="mt-4 rounded border p-4">
          <p className="text-sm">Unlock full access for $2/month.</p>
          <button onClick={subscribe} className="mt-3 rounded bg-black px-4 py-2 text-white">
            Subscribe
          </button>
        </div>
      )}

      <div className="mt-6 rounded border p-4">
        <h2 className="font-semibold">Today&apos;s check-in</h2>
        <form onSubmit={submitCheckin} className="mt-3 space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={didComplete} onChange={(e) => setDidComplete(e.target.checked)} />
            Completed today&apos;s goal
          </label>
          <textarea
            className="w-full rounded border p-2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
          />
          <button className="rounded bg-black px-4 py-2 text-white" type="submit">
            Save check-in
          </button>
        </form>
      </div>

      <div className="mt-6 rounded border p-4">
        <h2 className="font-semibold">Current streak: {streak}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {checkins.map((c) => (
            <li key={c.checkin_date} className="flex justify-between border-b pb-1">
              <span>{c.checkin_date}</span>
              <span>{c.did_complete ? "✅" : "❌"}</span>
            </li>
          ))}
        </ul>
      </div>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </main>
  );
}
