import type { MatrixRow } from "@/lib/types";
import { matrixValue, scoreLevel } from "@/lib/insights";

type CapabilityHeatmapProps = {
  rows: MatrixRow[];
};

const columns = [
  { key: "ai_capability", label: "AI" },
  { key: "team_features", label: "Team" },
  { key: "enterprise", label: "Enterprise" },
];

export function CapabilityHeatmap({ rows }: CapabilityHeatmapProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel backdrop-blur">
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Capability Heatmap</p>
        <h2 className="font-display text-3xl font-bold">Readiness by Competitor</h2>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] gap-2 text-xs font-black uppercase tracking-[0.16em] text-ink/45">
          <span>Competitor</span>
          {columns.map((column) => (
            <span key={column.key}>{column.label}</span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={matrixValue(row, "competitor")} className="grid grid-cols-[1.4fr_repeat(3,1fr)] gap-2">
            <div className="rounded-2xl bg-paper/80 px-3 py-3 text-sm font-extrabold text-moss">{matrixValue(row, "competitor")}</div>
            {columns.map((column) => {
              const score = scoreLevel(row[column.key]);
              return (
                <div key={column.key} className="rounded-2xl px-3 py-3 text-sm font-extrabold text-white" style={{ backgroundColor: heatColor(score) }}>
                  {matrixValue(row, column.key)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function heatColor(score: number) {
  if (score >= 80) return "#2f5d50";
  if (score >= 55) return "#8f7a3d";
  return "#e56b3f";
}
