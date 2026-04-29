import type { Competitor } from "@/lib/types";

type CompetitorListProps = {
  competitors: Competitor[];
};

const labels: Record<Competitor["category"], string> = {
  direct: "Direct Competitors",
  indirect: "Indirect Competitors",
  emerging: "Emerging Players",
};

export function CompetitorList({ competitors }: CompetitorListProps) {
  const groups = (["direct", "indirect", "emerging"] as const)
    .map((category) => ({
      category,
      items: competitors.filter((competitor) => competitor.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-soft-panel backdrop-blur">
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Discovery</p>
        <h2 className="font-display text-3xl font-bold">Competitor Landscape</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.category} className="rounded-3xl bg-paper/80 p-4">
            <h3 className="font-extrabold text-moss">{labels[group.category]}</h3>
            <div className="mt-3 grid gap-3">
              {group.items.map((competitor) => (
                <article key={competitor.id} className="rounded-2xl bg-white/70 p-4">
                  <p className="font-extrabold">{competitor.name}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/65">{competitor.description}</p>
                  <p className="mt-2 font-mono text-xs text-ember">{competitor.website_url?.replace("mock://", "sample://")}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
