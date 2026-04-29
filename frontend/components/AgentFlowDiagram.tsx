import type { AgentOutput } from "@/lib/types";

type AgentFlowDiagramProps = {
  agents: AgentOutput[];
};

export function AgentFlowDiagram({ agents }: AgentFlowDiagramProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel backdrop-blur">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Workflow</p>
      <h2 className="font-display text-3xl font-bold">5-Agent Graph</h2>
      <div className="mt-5 overflow-x-auto pb-2">
        <div className="flex min-w-[860px] items-stretch gap-3">
          {agents.map((agent, index) => (
            <div key={agent.id} className="flex flex-1 items-center gap-3">
              <div className="h-full min-h-36 flex-1 rounded-3xl border border-moss/10 bg-paper/80 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-black text-white">{index + 1}</div>
                <p className="mt-4 text-base font-extrabold text-moss">{agent.agent_name}</p>
                <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-ink/60">{agent.output_json?.role}</p>
              </div>
              {index < agents.length - 1 ? <div className="text-2xl font-black text-moss/40">→</div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
