type SegmentedProgressProps = {
  current: number;
  total: number;
  label?: string;
};

export function SegmentedProgress({ current, total, label }: SegmentedProgressProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(0, current), safeTotal);
  const progressLabel = label ?? `Step ${safeCurrent} of ${safeTotal}`;

  return (
    <div className="segmented-progress-wrap" aria-label={progressLabel}>
      <div
        className="segmented-progress-track"
        style={{ gridTemplateColumns: `repeat(${safeTotal}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: safeTotal }, (_, index) => (
          <span
            className={index < safeCurrent ? "filled" : ""}
            key={`segment-${index}`}
            aria-hidden
          />
        ))}
      </div>
      <span>{progressLabel}</span>
    </div>
  );
}
