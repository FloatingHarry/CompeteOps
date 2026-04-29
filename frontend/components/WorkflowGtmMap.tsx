import type { Competitor, MatrixRow } from "@/lib/types";
import { matrixValue, workflowGtmPosition } from "@/lib/insights";

type WorkflowGtmMapProps = {
  competitors: Competitor[];
  featureRows: MatrixRow[];
};

const categoryStyles: Record<Competitor["category"], string> = {
  direct: "border-moss bg-moss text-white",
  indirect: "border-cyan-600 bg-cyan-600 text-white",
  emerging: "border-ember bg-ember text-white",
};

const categoryLabels: Record<Competitor["category"], string> = {
  direct: "Direct",
  indirect: "Indirect",
  emerging: "Emerging",
};

export function WorkflowGtmMap({ competitors, featureRows }: WorkflowGtmMapProps) {
  const rowsByCompetitor = new Map(featureRows.map((row) => [matrixValue(row, "competitor"), row]));

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft-panel backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Market Map</p>
          <h3 className="font-display text-3xl font-bold text-ink">Workflow Ownership vs GTM Leverage</h3>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-ink/58">
            Directional scoring derived from sample positioning, workflow depth, competitor category, and commercial motion.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["direct", "indirect", "emerging"] as const).map((category) => (
            <span key={category} className="rounded-full border border-moss/15 bg-paper/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">
              {categoryLabels[category]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="relative h-[430px] min-w-[760px] rounded-[1.75rem] border border-moss/10 bg-[linear-gradient(90deg,rgba(47,93,80,0.08)_1px,transparent_1px),linear-gradient(rgba(47,93,80,0.08)_1px,transparent_1px)] bg-[length:25%_25%] p-8">
          <div className="absolute bottom-7 left-8 right-8 h-px bg-moss/25" />
          <div className="absolute bottom-7 left-8 top-8 w-px bg-moss/25" />
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-[0.18em] text-ink/45">
            GTM / Distribution Leverage
          </span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-black uppercase tracking-[0.18em] text-ink/45">
            Workflow Ownership
          </span>
          <Quadrant label="Niche workflow wedge" className="left-12 top-10" />
          <Quadrant label="Strategic control point" className="right-10 top-10" />
          <Quadrant label="Feature adjacency" className="bottom-12 left-12" />
          <Quadrant label="Distribution-led bundle" className="bottom-12 right-10" />

          {competitors.map((competitor) => {
            const row = rowsByCompetitor.get(competitor.name);
            const position = workflowGtmPosition(competitor, row);
            return (
              <div
                key={competitor.id}
                className="group absolute"
                style={{
                  left: `calc(${position.gtm}% - 1.25rem)`,
                  bottom: `calc(${position.workflow}% - 1.25rem)`,
                }}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-black shadow-[0_16px_35px_rgba(47,93,80,0.22)] ${categoryStyles[competitor.category]}`}>
                  {competitor.name.slice(0, 1)}
                </div>
                <div className="pointer-events-none absolute left-1/2 top-12 z-10 w-56 -translate-x-1/2 rounded-2xl border border-white/80 bg-white/95 p-3 text-left opacity-0 shadow-soft-panel transition group-hover:opacity-100">
                  <p className="font-extrabold text-ink">{competitor.name}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-moss">{categoryLabels[competitor.category]}</p>
                  <p className="mt-2 text-xs leading-5 text-ink/62">{position.rationale}</p>
                  <p className="mt-2 font-mono text-[11px] text-ink/45">
                    Workflow {position.workflow} / GTM {position.gtm}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Quadrant({ label, className }: { label: string; className: string }) {
  return (
    <span className={`absolute rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs font-extrabold text-ink/45 ${className}`}>
      {label}
    </span>
  );
}
