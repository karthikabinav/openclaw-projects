import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">Accountability App</h1>
      <p className="mt-3 text-gray-600">
        Daily check-ins + streak tracking. Subscription is $2/month.
      </p>
      <div className="mt-6 flex gap-3">
        <Link className="rounded bg-black px-4 py-2 text-white" href="/dashboard">
          Open Dashboard
        </Link>
        <Link className="rounded border px-4 py-2" href="/auth">
          Sign in (magic link)
        </Link>
      </div>
    </main>
  );
}
