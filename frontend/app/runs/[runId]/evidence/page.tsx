import Link from "next/link";

import { EvidenceCardList } from "@/components/EvidenceCardList";
import { EvidenceDistribution } from "@/components/EvidenceDistribution";
import { getCompetitors, getEvidence, getRun } from "@/lib/api";
import type { Competitor, EvidenceCard } from "@/lib/types";

export const dynamic = "force-dynamic";

type EvidencePageProps = {
  params: Promise<{
    runId: string;
  }>;
};

export default async function EvidencePage({ params }: EvidencePageProps) {
  const { runId } = await params;
  const [run, competitors, evidence] = await Promise.all([getRun(runId), getCompetitors(runId), getEvidence(runId)]);

  return (
    <main className="mx-auto grid w-full max-w-[1400px] gap-6 px-5 py-8">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-white/75 p-6 shadow-soft-panel backdrop-blur">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="absolute -bottom-16 left-12 h-64 w-64 rounded-full bg-moss/[0.18] blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href={`/runs/${runId}`} className="text-xs font-bold uppercase tracking-[0.24em] text-moss hover:text-ember">
              Back to agent report
            </Link>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-ember">Evidence Library</p>
            <h1 className="mt-1 max-w-4xl font-display text-5xl font-bold tracking-[-0.04em] text-ink md:text-7xl">
              Traceable source cards for {run.market}
            </h1>
            <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-ink/62">
              Inspect every normalized sample source, citation ID, dimension, competitor link, confidence score, and metadata URI used by the report.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Cards" value={evidence.length} />
            <Metric label="Competitors" value={competitors.length} />
            <Metric label="Source types" value={new Set(evidence.map((card) => card.source_type)).size} />
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <EvidenceDistribution evidence={evidence} />
        <SourceAndCompetitorCoverage evidence={evidence} competitors={competitors} />
      </section>

      <EvidenceCardList evidence={evidence} competitors={competitors} />
    </main>
  );
}

function SourceAndCompetitorCoverage({ evidence, competitors }: { evidence: EvidenceCard[]; competitors: Competitor[] }) {
  const sourceGroups = countBy(evidence, (card) => card.source_type);
  const competitorById = new Map(competitors.map((competitor) => [competitor.id, competitor.name]));
  const competitorGroups = countBy(evidence, (card) => (card.competitor_id ? competitorById.get(card.competitor_id) ?? "Unknown" : "Market-level"));

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel backdrop-blur">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Coverage</p>
      <h2 className="font-display text-3xl font-bold">Source and Competitor Grouping</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <CoverageBars title="By source type" groups={sourceGroups} />
        <CoverageBars title="By competitor" groups={competitorGroups} />
      </div>
    </section>
  );
}

function CoverageBars({ title, groups }: { title: string; groups: Array<{ label: string; count: number }> }) {
  const max = Math.max(...groups.map((group) => group.count), 1);

  return (
    <div className="rounded-3xl bg-paper/80 p-4">
      <h3 className="font-extrabold text-ink">{title}</h3>
      <div className="mt-4 grid gap-3">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="mb-1 flex items-center justify-between text-sm font-bold">
              <span className="capitalize text-ink/70">{group.label.replace("_", " ")}</span>
              <span className="text-moss">{group.count}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-moss" style={{ width: `${(group.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/70 p-4 text-center">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className="mt-1 text-3xl font-black text-moss">{value}</p>
    </div>
  );
}

function countBy<T>(items: T[], getLabel: (item: T) => string) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const label = getLabel(item);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}
