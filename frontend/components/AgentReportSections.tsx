import Link from "next/link";

import type { AgentOutput, Competitor, EvidenceCard, FinalReport, MatrixRow } from "@/lib/types";
import { evidenceCountByDimension, getStrategyAgentMode } from "@/lib/insights";
import { AgentSection } from "./AgentSection";
import { CapabilityHeatmap } from "./CapabilityHeatmap";
import { CompetitorList } from "./CompetitorList";
import { EvidenceBadges } from "./EvidenceBadges";
import { EvidenceDistribution } from "./EvidenceDistribution";
import { FeatureMatrix } from "./FeatureMatrix";
import { FinalBattlecard } from "./FinalBattlecard";
import { PricingMatrix } from "./PricingMatrix";
import { PricingStrategyBars } from "./PricingStrategyBars";
import { WorkflowGtmMap } from "./WorkflowGtmMap";

type SectionProps = {
  runId: string;
  competitors: Competitor[];
  evidence: EvidenceCard[];
  agents: AgentOutput[];
  report: FinalReport;
};

export function DiscoverySection({ competitors, evidence, agents, report }: SectionProps) {
  const discovery = agentResult<Record<string, unknown>>(agents, "discovery_agent");

  return (
    <AgentSection
      index={1}
      eyebrow="Discovery Agent"
      title="Map the Competitive Field"
      description="The workflow starts by scoping the market, discovering direct and indirect rivals, then preparing the evidence surface that downstream agents can cite."
    >
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <WorkflowGtmMap competitors={competitors} featureRows={report.feature_matrix} />
        <div className="grid gap-5">
          <CategoryRings competitors={competitors} />
          <SourceSummary discovery={discovery} evidence={evidence} />
        </div>
      </div>
      <div className="mt-5">
        <CompetitorList competitors={competitors} />
      </div>
    </AgentSection>
  );
}

export function AnalysisSection({ runId, evidence, report }: SectionProps) {
  const evidenceHref = `/runs/${runId}/evidence`;

  return (
    <AgentSection
      index={2}
      eyebrow="Competitive Analyst"
      title="Compare Capability, Pricing, and User Signals"
      description="This agent compresses product, pricing, user voice, and market signals into matrices and visual summaries before any strategy judgment is made."
    >
      <div className="grid gap-5 xl:grid-cols-3">
        <CapabilityHeatmap rows={report.feature_matrix} />
        <PricingStrategyBars rows={report.pricing_matrix} />
        <EvidenceDistribution evidence={evidence} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <FeatureMatrix rows={report.feature_matrix} evidenceHref={evidenceHref} />
        <PricingMatrix rows={report.pricing_matrix} evidenceHref={evidenceHref} />
      </div>
    </AgentSection>
  );
}

export function DebateSection({ runId, agents }: SectionProps) {
  const evidenceHref = `/runs/${runId}/evidence`;
  const debate = agentResult<DebateResult>(agents, "debate_agent");
  const strength = debate?.strength_case;
  const weakness = debate?.weakness_case;
  const strengthCount = strength?.evidence_ids?.length ?? 0;
  const weaknessCount = weakness?.evidence_ids?.length ?? 0;
  const total = Math.max(strengthCount + weaknessCount, 1);

  return (
    <AgentSection
      index={3}
      eyebrow="Debate Agent"
      title="Stress-Test the Market Thesis"
      description="The Debate Agent keeps the useful tension: a strength advocate argues why competitors are durable, while a weakness critic searches for strategic openings."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <DebatePanel
          label="Strength Advocate"
          title="Why the category can be defensible"
          body={String(strength?.argument ?? "Workflow ownership and distribution can create durable control points.")}
          points={stringList(strength?.supporting_points)}
          evidenceIds={strength?.evidence_ids}
          evidenceHref={evidenceHref}
          tone="moss"
        />
        <DebatePanel
          label="Weakness Critic"
          title="Where the category can crack"
          body={String(weakness?.argument ?? "Generic coding assistance can be bundled, commoditized, or constrained by cost.")}
          points={stringList(weakness?.weakness_points)}
          evidenceIds={weakness?.evidence_ids}
          evidenceHref={evidenceHref}
          tone="ember"
        />
      </div>
      <div className="mt-5 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Debate Tension</p>
            <h3 className="font-display text-3xl font-bold text-ink">Evidence Balance</h3>
          </div>
          <p className="max-w-2xl text-sm font-semibold leading-6 text-ink/60">{debate?.synthesis}</p>
        </div>
        <div className="mt-5 h-5 overflow-hidden rounded-full bg-paper">
          <div className="flex h-full">
            <div className="bg-moss" style={{ width: `${(strengthCount / total) * 100}%` }} />
            <div className="bg-ember" style={{ width: `${(weaknessCount / total) * 100}%` }} />
          </div>
        </div>
        <div className="mt-3 flex justify-between text-xs font-black uppercase tracking-[0.16em] text-ink/45">
          <span>{strengthCount} strength evidence cards</span>
          <span>{weaknessCount} weakness evidence cards</span>
        </div>
      </div>
    </AgentSection>
  );
}

export function StrategySection({ runId, agents, report }: SectionProps) {
  const evidenceHref = `/runs/${runId}/evidence`;
  const strategyMode = getStrategyAgentMode(agents);
  const strategyAgent = agents.find((agent) => agent.output_json?.node_name === "strategy_agent");

  return (
    <AgentSection
      index={4}
      eyebrow="Strategy Agent"
      title="Turn Signals Into Product Moves"
      description="Strategy comes after discovery, analysis, and debate. This keeps recommendations anchored to evidence instead of generic advice."
    >
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[2rem] border border-moss/15 bg-moss/10 p-5 shadow-soft-panel">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-moss">
              {strategyMode.mode}
            </span>
            {strategyMode.model ? (
              <span className="rounded-full bg-white/75 px-3 py-1 font-mono text-xs font-bold text-ink/60">{strategyMode.model}</span>
            ) : null}
          </div>
          <h3 className="mt-4 font-display text-3xl font-bold text-ink">Recommended Strategy</h3>
          <p className="mt-3 leading-7 text-ink/72">{report.recommended_strategy}</p>
          <div className="mt-4">
            <EvidenceBadges ids={strategyAgent?.evidence_ids} hrefBase={evidenceHref} />
          </div>
        </article>
        <OpportunityPriorityGrid gaps={report.opportunity_gaps} evidenceHref={evidenceHref} />
      </div>
      <div className="mt-5">
        <RiskSeverityMatrix risks={report.risks} evidenceHref={evidenceHref} />
      </div>
    </AgentSection>
  );
}

export function ReportSection({ runId, evidence, report }: SectionProps) {
  const evidenceHref = `/runs/${runId}/evidence`;

  return (
    <AgentSection
      index={5}
      eyebrow="Report Agent"
      title="Package the Battlecard"
      description="The final step assembles an export-ready battlecard while keeping the full evidence library one click away."
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <FinalBattlecard report={report} evidenceHref={evidenceHref} />
        <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft-panel backdrop-blur">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Evidence Library</p>
          <h3 className="mt-1 font-display text-3xl font-bold text-ink">Audit Trail</h3>
          <p className="mt-3 text-sm font-semibold leading-6 text-ink/62">
            The report page shows coverage and citations only. Open the evidence page to inspect every normalized source card and metadata URI.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniMetric label="Total cards" value={evidence.length} />
            <MiniMetric label="Dimensions" value={new Set(evidence.map((card) => card.dimension)).size} />
            <MiniMetric label="Product" value={evidenceCountByDimension(evidence, "product")} />
            <MiniMetric label="Risk" value={evidenceCountByDimension(evidence, "risk")} />
          </div>
          <Link
            href={evidenceHref}
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-moss px-4 py-3 text-sm font-extrabold text-white transition hover:bg-ember"
          >
            View Evidence Library
          </Link>
        </aside>
      </div>
    </AgentSection>
  );
}

function CategoryRings({ competitors }: { competitors: Competitor[] }) {
  const groups = (["direct", "indirect", "emerging"] as const).map((category) => ({
    category,
    count: competitors.filter((competitor) => competitor.category === category).length,
  }));
  const max = Math.max(...groups.map((group) => group.count), 1);

  return (
    <article className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft-panel">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Category Rings</p>
      <h3 className="font-display text-3xl font-bold text-ink">Discovery Mix</h3>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {groups.map((group) => (
          <div key={group.category} className="rounded-3xl bg-paper/80 p-3 text-center">
            <div
              className="mx-auto flex items-center justify-center rounded-full border-[10px] border-moss/20 bg-white text-2xl font-black text-moss"
              style={{
                height: `${72 + (group.count / max) * 42}px`,
                width: `${72 + (group.count / max) * 42}px`,
              }}
            >
              {group.count}
            </div>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-ink/50">{group.category}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function SourceSummary({ discovery, evidence }: { discovery?: Record<string, unknown>; evidence: EvidenceCard[] }) {
  return (
    <article className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft-panel">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Source Summary</p>
      <h3 className="font-display text-3xl font-bold text-ink">Prepared Signals</h3>
      <dl className="mt-5 grid gap-3">
        <SummaryRow label="Evidence cards" value={String(discovery?.evidence_card_count ?? evidence.length)} />
        <SummaryRow label="Raw source notes" value={String(discovery?.raw_source_count ?? evidence.length)} />
        <SummaryRow label="Policy" value="Sample Dataset with traceable source metadata" />
      </dl>
    </article>
  );
}

function DebatePanel({
  label,
  title,
  body,
  points,
  evidenceIds,
  evidenceHref,
  tone,
}: {
  label: string;
  title: string;
  body: string;
  points: string[];
  evidenceIds?: string[];
  evidenceHref: string;
  tone: "moss" | "ember";
}) {
  const toneClass = tone === "moss" ? "text-moss bg-moss/10 border-moss/15" : "text-ember bg-ember/10 border-ember/15";

  return (
    <article className={`rounded-[2rem] border p-5 shadow-soft-panel ${toneClass}`}>
      <p className="text-sm font-black uppercase tracking-[0.2em]">{label}</p>
      <h3 className="mt-2 font-display text-3xl font-bold text-ink">{title}</h3>
      <p className="mt-3 leading-7 text-ink/72">{body}</p>
      <div className="mt-4 grid gap-3">
        {points.map((point) => (
          <div key={point} className="rounded-2xl bg-white/75 p-3 text-sm font-semibold leading-6 text-ink/68">
            {point}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <EvidenceBadges ids={evidenceIds} compact hrefBase={evidenceHref} />
      </div>
    </article>
  );
}

function OpportunityPriorityGrid({ gaps, evidenceHref }: { gaps: MatrixRow[]; evidenceHref: string }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft-panel">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Opportunity Priority</p>
      <h3 className="font-display text-3xl font-bold text-ink">Where to Play</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {gaps.map((gap, index) => (
          <article key={String(gap.gap)} className="rounded-3xl bg-paper/85 p-4">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-moss text-sm font-black text-white">{index + 1}</span>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-ink/45">
                Priority {index === 0 ? "High" : index === 1 ? "Medium" : "Selective"}
              </span>
            </div>
            <h4 className="mt-4 font-extrabold text-ink">{String(gap.gap)}</h4>
            <p className="mt-2 text-sm leading-6 text-ink/62">{String(gap.rationale)}</p>
            <div className="mt-4">
              <EvidenceBadges ids={gap.evidence_ids} compact hrefBase={evidenceHref} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RiskSeverityMatrix({ risks, evidenceHref }: { risks: MatrixRow[]; evidenceHref: string }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft-panel">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Risk Matrix</p>
      <h3 className="font-display text-3xl font-bold text-ink">Severity and Mitigation</h3>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {risks.map((risk) => {
          const severity = String(risk.severity);
          return (
            <article key={String(risk.risk)} className="rounded-3xl border border-ember/10 bg-ember/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-extrabold text-ink">{String(risk.risk)}</h4>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black uppercase tracking-[0.14em] text-ember">
                  {severity}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-1">
                {["Low", "Medium", "High"].map((level) => (
                  <div
                    key={level}
                    className={`h-2 rounded-full ${severity.toLowerCase() === level.toLowerCase() ? "bg-ember" : "bg-white/80"}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-ink/66">{String(risk.mitigation)}</p>
              <div className="mt-4">
                <EvidenceBadges ids={risk.evidence_ids} compact hrefBase={evidenceHref} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-paper/80 p-3">
      <dt className="text-xs font-black uppercase tracking-[0.16em] text-ink/45">{label}</dt>
      <dd className="mt-1 text-sm font-extrabold text-ink">{value}</dd>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-paper/80 p-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className="mt-1 text-2xl font-black text-moss">{value}</p>
    </div>
  );
}

function agentResult<T>(agents: AgentOutput[], nodeName: string): T | undefined {
  return agents.find((agent) => agent.output_json?.node_name === nodeName)?.output_json?.result as T | undefined;
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

type DebateResult = {
  strength_case?: {
    argument?: string;
    supporting_points?: unknown;
    evidence_ids?: string[];
  };
  weakness_case?: {
    argument?: string;
    weakness_points?: unknown;
    evidence_ids?: string[];
  };
  synthesis?: string;
};
