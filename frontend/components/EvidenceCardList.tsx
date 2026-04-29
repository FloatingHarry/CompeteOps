import type { Competitor, EvidenceCard } from "@/lib/types";

type EvidenceCardListProps = {
  evidence: EvidenceCard[];
  competitors: Competitor[];
};

export function EvidenceCardList({ evidence, competitors }: EvidenceCardListProps) {
  const competitorById = new Map(competitors.map((competitor) => [competitor.id, competitor.name]));

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft-panel backdrop-blur">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Traceability</p>
          <h2 className="font-display text-3xl font-bold">Evidence Cards</h2>
        </div>
        <p className="max-w-xl text-sm font-semibold text-ink/60">
          Sample evidence sources are normalized into traceable cards. Source URLs remain visible in metadata for auditability.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {evidence.map((card) => (
          <article
            id={`evidence-${card.id}`}
            key={card.id}
            className="scroll-mt-6 rounded-3xl border border-moss/10 bg-paper/75 p-5 transition target:ring-4 target:ring-ember/30"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-moss px-2.5 py-1 text-xs font-extrabold text-white">{card.id}</span>
              <span className="rounded-full bg-moss/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-moss">
                {card.dimension}
              </span>
              <span className="rounded-full bg-ember/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-ember">
                {card.confidence}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-ink">{card.claim}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">{card.evidence_text}</p>
            <dl className="mt-4 grid gap-2 text-xs font-semibold text-ink/55">
              <div>
                <dt className="inline uppercase tracking-wider">Source: </dt>
                <dd className="inline text-ink">{sampleSourceTitle(card.source_title)}</dd>
              </div>
              <div>
                <dt className="inline uppercase tracking-wider">URL: </dt>
                <dd className="inline font-mono text-ember">{card.source_url}</dd>
              </div>
              <div>
                <dt className="inline uppercase tracking-wider">Competitor: </dt>
                <dd className="inline text-ink">{card.competitor_id ? competitorById.get(card.competitor_id) : "Market-level"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function sampleSourceTitle(title?: string | null) {
  return title?.replace(/^Mock /, "Sample ") ?? "Sample evidence source";
}
