import type { MatrixRow } from "@/lib/types";
import { EvidenceBadges } from "./EvidenceBadges";

type FeatureMatrixProps = {
  rows: MatrixRow[];
  evidenceHref?: string;
};

export function FeatureMatrix({ rows, evidenceHref }: FeatureMatrixProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel backdrop-blur">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Matrix</p>
          <h2 className="font-display text-3xl font-bold">Feature Matrix</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.16em] text-ink/55">
              <th className="px-3 py-2">Competitor</th>
              <th className="px-3 py-2">Target User</th>
              <th className="px-3 py-2">Core Features</th>
              <th className="px-3 py-2">AI</th>
              <th className="px-3 py-2">Team</th>
              <th className="px-3 py-2">Enterprise</th>
              <th className="px-3 py-2">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.competitor)} className="rounded-2xl bg-paper/80 align-top">
                <Cell strong>{String(row.competitor)}</Cell>
                <Cell>{String(row.target_user)}</Cell>
                <Cell>{String(row.core_features)}</Cell>
                <Cell>{String(row.ai_capability)}</Cell>
                <Cell>{String(row.team_features)}</Cell>
                <Cell>{String(row.enterprise)}</Cell>
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
