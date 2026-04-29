import Link from "next/link";

import type { AgentOutput, Competitor, EvidenceCard, FinalReport, ResearchRun } from "@/lib/types";
import { getStrategyAgentMode, summaryStats } from "@/lib/insights";
import { StatusBadge } from "./StatusBadge";

type RunCommandHeaderProps = {
  run: ResearchRun;
  report: FinalReport;
  competitors: Competitor[];
  evidence: EvidenceCard[];
  agents: AgentOutput[];
};

export function RunCommandHeader({ run, report, competitors, evidence, agents }: RunCommandHeaderProps) {
  const stats = summaryStats(report, competitors, evidence, agents);
  const strategyMode = getStrategyAgentMode(agents);

  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-white/75 p-6 text-ink shadow-soft-panel backdrop-blur">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="absolute right-8 top-10 h-56 w-56 rounded-full bg-moss/[0.18] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-44 w-80 -translate-x-1/2 rounded-full bg-ember/[0.12] blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link href="/" className="text-xs font-bold uppercase tracking-[0.24em] text-moss hover:text-ember">
              Back to command center
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <StatusBadge status={run.status} />
              <span className="rounded-full border border-moss/15 bg-moss/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-moss">
                Evidence-grounded sample run
              </span>
              <span className="rounded-full border border-ember/15 bg-ember/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-ember">
                Strategy: {strategyMode.mode}
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-ink md:text-7xl">
              {report.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-ink/62">
              {run.market} intelligence workspace across {run.region}, generated at {run.depth} depth.
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-paper/70 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-moss">Run Metadata</p>
            <dl className="mt-3 grid gap-2 text-sm text-ink/62">
              <div className="flex justify-between gap-8">
                <dt>Mode</dt>
                <dd className="font-bold text-ink">{run.mode}</dd>
              </div>
              <div className="flex justify-between gap-8">
                <dt>Model</dt>
                <dd className="font-bold text-ink">{strategyMode.model ?? "sample strategy"}</dd>
              </div>
              <div className="flex justify-between gap-8">
                <dt>Created</dt>
                <dd className="font-bold text-ink">{new Date(run.created_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/70 bg-white/60 p-4 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">{stat.label}</p>
              <p className="mt-2 text-4xl font-black text-moss">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink/58">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
