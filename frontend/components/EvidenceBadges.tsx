type EvidenceBadgesProps = {
  ids?: string[];
  compact?: boolean;
  hrefBase?: string;
};

export function EvidenceBadges({ ids = [], compact = false, hrefBase = "" }: EvidenceBadgesProps) {
  if (!ids.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <a
          key={id}
          href={`${hrefBase}#evidence-${id}`}
          className={`rounded-full border border-moss/20 bg-moss/10 font-semibold text-moss transition hover:bg-moss hover:text-white ${
            compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
          }`}
        >
          {id}
        </a>
      ))}
    </div>
  );
}
