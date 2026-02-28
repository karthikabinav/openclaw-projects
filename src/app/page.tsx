"use client";

import { useEffect, useMemo, useState } from "react";

function formatTime(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function Home() {
  const [seconds, setSeconds] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      return;
    }

    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [running, remaining]);

  const progress = useMemo(() => {
    if (seconds <= 0) return 0;
    return Math.min(100, Math.max(0, ((seconds - remaining) / seconds) * 100));
  }, [seconds, remaining]);

  const presets = [60, 300, 600, 1500];

  function applyPreset(value: number) {
    setSeconds(value);
    setRemaining(value);
    setRunning(false);
  }

  function reset() {
    setRemaining(seconds);
    setRunning(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Simple Timer</h1>
        <p className="mt-1 text-sm text-gray-600">Shareable countdown timer for quick focus sessions.</p>

        <div className="mt-6 text-center">
          <div className="text-6xl font-mono font-semibold tracking-tight">{formatTime(remaining)}</div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded bg-gray-200">
          <div className="h-full bg-black transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className="rounded border px-2 py-2 text-sm hover:bg-gray-100"
            >
              {Math.floor(p / 60)}m
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          {!running ? (
            <button
              onClick={() => setRunning(true)}
              className="flex-1 rounded bg-black px-4 py-2 text-white hover:opacity-90"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => setRunning(false)}
              className="flex-1 rounded bg-gray-800 px-4 py-2 text-white hover:opacity-90"
            >
              Pause
            </button>
          )}
          <button onClick={reset} className="flex-1 rounded border px-4 py-2 hover:bg-gray-100">
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}
