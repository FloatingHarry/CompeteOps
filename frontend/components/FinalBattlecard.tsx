import type { FinalReport } from "@/lib/types";
import { EvidenceBadges } from "./EvidenceBadges";

type FinalBattlecardProps = {
  report: FinalReport;
  evidenceHref?: string;
};

export function FinalBattlecard({ report, evidenceHref }: FinalBattlecardProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-soft-panel backdrop-blur">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Final Battlecard</p>
          <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">{report.title}</h1>
        </div>
        <div className="rounded-full border border-moss/20 bg-moss/10 px-4 py-2 text-sm font-bold text-moss">
          Evidence-grounded sample run
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <BattlecardPanel title="Executive Summary" body={report.executive_summary} />
        <BattlecardPanel title="Competitor Landscape" body={report.competitor_landscape} />
        <BattlecardPanel title="Strength vs Weakness Debate" body={report.debate_summary} />
        <BattlecardPanel
          title="Recommended Strategy"
          body={report.recommended_strategy}
          evidenceIds={report.evidence_ids.slice(-3)}
          evidenceHref={evidenceHref}
          accent
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-moss/15 bg-moss/10 p-5">
          <h3 className="font-display text-2xl font-bold text-moss">Opportunity Gaps</h3>
          <div className="mt-4 grid gap-4">
            {report.opportunity_gaps.map((gap, index) => (
              <div key={index} className="rounded-2xl bg-white/70 p-4">
                <p className="font-bold text-ink">{String(gap.gap)}</p>
                <p className="mt-1 text-sm text-ink/68">{String(gap.rationale)}</p>
                <div className="mt-3">
                  <EvidenceBadges ids={gap.evidence_ids} compact hrefBase={evidenceHref} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-ember/15 bg-ember/10 p-5">
          <h3 className="font-display text-2xl font-bold text-ember">Risks and Next Steps</h3>
          <div className="mt-4 grid gap-4">
            {report.risks.map((risk, index) => (
              <div key={index} className="rounded-2xl bg-white/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-ink">{String(risk.risk)}</p>
                  <span className="rounded-full bg-ember px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
                    {String(risk.severity)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/68">{String(risk.mitigation)}</p>
                <div className="mt-3">
                  <EvidenceBadges ids={risk.evidence_ids} compact hrefBase={evidenceHref} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BattlecardPanel({
  title,
  body,
  evidenceIds,
  evidenceHref,
  accent = false,
}: {
  title: string;
  body: string;
  evidenceIds?: string[];
  evidenceHref?: string;
  accent?: boolean;
}) {
  return (
    <article className={`rounded-3xl p-5 ${accent ? "bg-wheat/70" : "bg-paper/80"}`}>
      <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-3 leading-7 text-ink/78">{body}</p>
      {evidenceIds?.length ? (
        <div className="mt-4">
          <EvidenceBadges ids={evidenceIds} hrefBase={evidenceHref} />
        </div>
      ) : null}
    </article>
  );
}
