import type { AgentOutput } from "@/lib/types";
import { EvidenceBadges } from "./EvidenceBadges";
import { StatusBadge } from "./StatusBadge";

type AgentTimelineProps = {
  agents: AgentOutput[];
  evidenceHref?: string;
};

export function AgentTimeline({ agents, evidenceHref }: AgentTimelineProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-soft-panel backdrop-blur">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Explainability</p>
        <h2 className="font-display text-3xl font-bold">5-Agent LangGraph Workflow</h2>
        <p className="mt-2 text-sm font-semibold text-ink/60">
          Each card is a visible research agent. Internal tools handle parsing, source collection, evidence normalization, and report assembly.
        </p>
      </div>
      <div className="grid gap-3">
        {agents.map((agent) => {
          const metadata = agent.output_json ?? {};
          const nodeName = metadata.node_name ?? agent.agent_name;

          return (
            <details key={agent.id} className="group rounded-3xl border border-moss/10 bg-paper/70 p-4">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss font-extrabold text-white">
                    {agent.order_index}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold">{agent.agent_name}</h3>
                      <span className="rounded-full bg-ink/10 px-2.5 py-1 font-mono text-xs font-bold text-ink/70">
                        {nodeName}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/55">{agent.input_summary}</p>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </summary>
              <div className="mt-4 grid gap-4 border-t border-moss/10 pt-4">
                {metadata.role ? <p className="text-sm font-semibold leading-6 text-ink/68">{metadata.role}</p> : null}
                {metadata.execution_mode ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] ${executionModeClass(metadata.execution_mode)}`}>
                      {metadata.execution_mode}
                    </span>
                    {metadata.model_name ? (
                      <span className="rounded-full bg-ink/10 px-3 py-1 font-mono text-xs font-bold text-ink/70">
                        {metadata.model_name}
                      </span>
                    ) : null}
                    {metadata.fallback_reason ? (
                      <span className="text-sm font-semibold text-ember">{metadata.fallback_reason}</span>
                    ) : null}
                  </div>
                ) : null}
                <p className="leading-7 text-ink/72">{agent.output_markdown}</p>
                {agent.error_message ? <p className="text-sm font-bold text-red-700">{agent.error_message}</p> : null}

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                  <MetadataGroup label="Depends on" values={metadata.depends_on} empty="Start" />
                  <MetadataGroup label="Internal tools" values={metadata.tools_used} />
                  <MetadataGroup label="Subroles" values={metadata.subroles} />
                  <MetadataGroup label="Reads state" values={metadata.state_keys_read} />
                  <MetadataGroup label="Writes state" values={metadata.state_keys_written} />
                </div>

                <div>
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-ink/45">Evidence used</p>
                  <EvidenceBadges ids={agent.evidence_ids} compact hrefBase={evidenceHref} />
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function executionModeClass(mode: string) {
  if (mode === "llm") {
    return "bg-moss text-white";
  }
  if (mode === "mock_fallback") {
    return "bg-ember/15 text-ember";
  }
  return "bg-ink/10 text-ink/70";
}

function MetadataGroup({ label, values = [], empty = "None" }: { label: string; values?: string[]; empty?: string }) {
  return (
    <div className="rounded-2xl bg-white/60 p-3">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-ink/45">{label}</p>
      {values.length ? (
        <div className="flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span key={value} className="rounded-full bg-moss/10 px-2 py-1 font-mono text-[11px] font-bold text-moss">
              {value}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-sm font-semibold text-ink/50">{empty}</span>
      )}
    </div>
  );
}
