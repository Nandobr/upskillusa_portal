import { usePortalContent } from "@/components/language-provider";
import type { Language } from "@/lib/content";

type SegmentedProgressProps = {
  current: number;
  total: number;
  label?: string;
};

const defaultProgressLabel: Record<Language, (current: number, total: number) => string> = {
  en: (current, total) => `Step ${current} of ${total}`,
  es: (current, total) => `Paso ${current} de ${total}`,
  pt: (current, total) => `Passo ${current} de ${total}`,
};

export function SegmentedProgress({ current, total, label }: SegmentedProgressProps) {
  const { language } = usePortalContent();
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(0, current), safeTotal);
  const progressLabel = label ?? defaultProgressLabel[language](safeCurrent, safeTotal);

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
