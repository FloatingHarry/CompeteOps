import type { EvidenceCard } from "@/lib/types";
import { evidenceDistribution } from "@/lib/insights";

type EvidenceDistributionProps = {
  evidence: EvidenceCard[];
};

export function EvidenceDistribution({ evidence }: EvidenceDistributionProps) {
  const distribution = evidenceDistribution(evidence);
  const max = Math.max(...distribution.map((item) => item.count), 1);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel backdrop-blur">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Evidence Coverage</p>
      <h2 className="font-display text-3xl font-bold">Signal Distribution</h2>
      <div className="mt-5 grid gap-3">
        {distribution.map((item) => (
          <div key={item.dimension}>
            <div className="mb-1 flex items-center justify-between text-sm font-bold">
              <span className="capitalize text-ink">{item.dimension.replace("_", " ")}</span>
              <span className="text-ink/55">{item.count} cards</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-paper">
              <div className="h-full rounded-full bg-moss" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
