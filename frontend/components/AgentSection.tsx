type AgentSectionProps = {
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AgentSection({ index, eyebrow, title, description, children }: AgentSectionProps) {
  return (
    <section className="rounded-[2.25rem] border border-white/75 bg-white/65 p-4 shadow-soft-panel backdrop-blur md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-moss/10 text-lg font-black text-moss ring-1 ring-moss/15">
            {index}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-ember">{eyebrow}</p>
            <h2 className="mt-1 font-display text-4xl font-bold tracking-[-0.03em] text-ink">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-ink/60">{description}</p>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
