import type { MatrixRow } from "@/lib/types";
import { matrixValue, scoreLevel } from "@/lib/insights";

type PricingStrategyBarsProps = {
  rows: MatrixRow[];
};

export function PricingStrategyBars({ rows }: PricingStrategyBarsProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel backdrop-blur">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Commercial Motion</p>
      <h2 className="font-display text-3xl font-bold">Pricing Strategy Bars</h2>
      <div className="mt-5 grid gap-4">
        {rows.map((row) => {
          const score = Math.round((scoreLevel(row.free_tier) + scoreLevel(row.pro) + scoreLevel(row.team) + scoreLevel(row.enterprise)) / 4);
          return (
            <div key={matrixValue(row, "competitor")}>
              <div className="mb-1 flex items-center justify-between text-sm font-bold">
                <span className="text-ink">{matrixValue(row, "competitor")}</span>
                <span className="text-ink/55">{matrixValue(row, "pricing_strategy")}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-paper">
                <div className="h-full rounded-full bg-ember" style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
