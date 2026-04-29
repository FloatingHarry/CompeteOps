import type { AgentOutput, Competitor, EvidenceCard, FinalReport } from "@/lib/types";
import { AgentFlowDiagram } from "./AgentFlowDiagram";
import { CapabilityHeatmap } from "./CapabilityHeatmap";
import { CompetitiveMap } from "./CompetitiveMap";
import { EvidenceDistribution } from "./EvidenceDistribution";
import { PricingStrategyBars } from "./PricingStrategyBars";

type InsightDashboardProps = {
  report: FinalReport;
  competitors: Competitor[];
  evidence: EvidenceCard[];
  agents: AgentOutput[];
};

export function InsightDashboard({ report, evidence, agents }: InsightDashboardProps) {
  const topGap = report.opportunity_gaps[0];
  const topRisk = report.risks[0];

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <CompetitiveMap rows={report.feature_matrix} />
        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-moss/15 bg-moss/10 p-6 shadow-soft-panel">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Primary Opportunity</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">{String(topGap?.gap ?? "Opportunity gap")}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-ink/65">{String(topGap?.rationale ?? report.recommended_strategy)}</p>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft-panel">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Top Risk</p>
            <h2 className="mt-3 font-display text-3xl font-bold">{String(topRisk?.risk ?? "Risk")}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-ink/65">{String(topRisk?.mitigation ?? "Mitigation pending")}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <CapabilityHeatmap rows={report.feature_matrix} />
        <PricingStrategyBars rows={report.pricing_matrix} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <EvidenceDistribution evidence={evidence} />
        <AgentFlowDiagram agents={agents} />
      </section>
    </div>
  );
}
