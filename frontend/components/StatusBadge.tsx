type StatusBadgeProps = {
  status: string;
};

const styles: Record<string, string> = {
  completed: "bg-moss text-white",
  running: "bg-ember text-white",
  pending: "bg-wheat text-ink",
  failed: "bg-red-700 text-white",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}
