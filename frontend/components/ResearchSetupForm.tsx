"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createRun } from "@/lib/api";

export function ResearchSetupForm() {
  const router = useRouter();
  const [market, setMarket] = useState("AI coding tools");
  const [region, setRegion] = useState("Global");
  const [depth, setDepth] = useState("Standard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const run = await createRun({ market, region, depth });
      router.push(`/runs/${run.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create research run.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-soft-panel backdrop-blur">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Market / Product Category</span>
          <input
            value={market}
            onChange={(event) => setMarket(event.target.value)}
            placeholder="AI coding tools"
            className="rounded-2xl border border-moss/20 bg-paper px-4 py-3 text-lg font-semibold outline-none transition focus:border-ember focus:ring-4 focus:ring-ember/15"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Region</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="rounded-2xl border border-moss/20 bg-paper px-4 py-3 font-semibold outline-none transition focus:border-ember focus:ring-4 focus:ring-ember/15"
            >
              <option>Global</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia-Pacific</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Research Depth</span>
            <select
              value={depth}
              onChange={(event) => setDepth(event.target.value)}
              className="rounded-2xl border border-moss/20 bg-paper px-4 py-3 font-semibold outline-none transition focus:border-ember focus:ring-4 focus:ring-ember/15"
            >
              <option>Quick</option>
              <option>Standard</option>
              <option>Deep</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-moss px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-moss/20 transition hover:-translate-y-0.5 hover:bg-ember disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Running intelligence workflow..." : "Start Research"}
        </button>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
