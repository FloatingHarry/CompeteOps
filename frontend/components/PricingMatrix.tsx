import type { MatrixRow } from "@/lib/types";
import { EvidenceBadges } from "./EvidenceBadges";

type PricingMatrixProps = {
  rows: MatrixRow[];
  evidenceHref?: string;
};

export function PricingMatrix({ rows, evidenceHref }: PricingMatrixProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel backdrop-blur">
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Matrix</p>
        <h2 className="font-display text-3xl font-bold">Pricing Matrix</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.16em] text-ink/55">
              <th className="px-3 py-2">Competitor</th>
              <th className="px-3 py-2">Free Tier</th>
              <th className="px-3 py-2">Pro</th>
              <th className="px-3 py-2">Team</th>
              <th className="px-3 py-2">Enterprise</th>
              <th className="px-3 py-2">Strategy</th>
              <th className="px-3 py-2">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.competitor)} className="bg-wheat/55 align-top">
                <Cell strong>{String(row.competitor)}</Cell>
                <Cell>{String(row.free_tier)}</Cell>
                <Cell>{String(row.pro)}</Cell>
                <Cell>{String(row.team)}</Cell>
                <Cell>{String(row.enterprise)}</Cell>
                <Cell>{String(row.pricing_strategy)}</Cell>
                <td className="rounded-r-2xl px-3 py-3">
                  <EvidenceBadges ids={row.evidence_ids} compact hrefBase={evidenceHref} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Cell({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return <td className={`px-3 py-3 ${strong ? "rounded-l-2xl font-extrabold text-moss" : "text-ink/78"}`}>{children}</td>;
}
