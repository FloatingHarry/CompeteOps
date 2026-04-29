import { AgentTimeline } from "@/components/AgentTimeline";
import {
  AnalysisSection,
  DebateSection,
  DiscoverySection,
  ReportSection,
  StrategySection,
} from "@/components/AgentReportSections";
import { RunCommandHeader } from "@/components/RunCommandHeader";
import { getAgentOutputs, getCompetitors, getEvidence, getReport, getRun } from "@/lib/api";

export const dynamic = "force-dynamic";

type RunPageProps = {
  params: Promise<{
    runId: string;
  }>;
};

export default async function RunPage({ params }: RunPageProps) {
  const { runId } = await params;
  const [run, competitors, evidence, agents, report] = await Promise.all([
    getRun(runId),
    getCompetitors(runId),
    getEvidence(runId),
    getAgentOutputs(runId),
    getReport(runId),
  ]);

  return (
    <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-5 py-8">
      <RunCommandHeader run={run} report={report} competitors={competitors} evidence={evidence} agents={agents} />
      {run.demo_note ? (
        <div className="rounded-2xl border border-ember/25 bg-ember/10 px-4 py-3 text-sm font-semibold text-ink/75">
          {run.demo_note}
        </div>
      ) : null}
      <DiscoverySection runId={runId} report={report} competitors={competitors} evidence={evidence} agents={agents} />
      <AnalysisSection runId={runId} report={report} competitors={competitors} evidence={evidence} agents={agents} />
      <DebateSection runId={runId} report={report} competitors={competitors} evidence={evidence} agents={agents} />
      <StrategySection runId={runId} report={report} competitors={competitors} evidence={evidence} agents={agents} />
      <ReportSection runId={runId} report={report} competitors={competitors} evidence={evidence} agents={agents} />
      <AgentTimeline agents={agents} evidenceHref={`/runs/${runId}/evidence`} />
    </main>
  );
}
