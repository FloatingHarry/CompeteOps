import { ResearchSetupForm } from "@/components/ResearchSetupForm";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-12">
      <div className="grid w-full gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <section>
          <div className="mb-6 inline-flex rounded-full border border-moss/15 bg-white/70 px-4 py-2 text-sm font-bold text-moss shadow-soft-panel backdrop-blur">
            v0.6 Agent-Ordered Intelligence Report / Sample Dataset
          </div>
          <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-[-0.04em] text-ink md:text-7xl">
            CompeteOps turns market signals into strategic battlecards.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-ink/70">
            Run a five-agent competitive intelligence workflow, inspect evidence-grounded matrices, and read the
            recommended strategy as a product-grade agent report.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["5-agent graph", "Discovery, analysis, debate, strategy, report"],
              ["Evidence layer", "Source-linked claims and traceability"],
              ["Market maps", "Workflow ownership and GTM leverage"],
              ["LLM strategy", "Optional OpenAI-compatible strategy agent"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur">
                <p className="font-extrabold text-moss">{title}</p>
                <p className="mt-1 text-sm font-semibold text-ink/55">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <ResearchSetupForm />
          <p className="mt-4 text-sm font-semibold text-ink/55">
            Starts with a sample evidence dataset. Add an API key to let the Strategy Agent use a real LLM.
          </p>
        </section>
      </div>
    </main>
  );
}
