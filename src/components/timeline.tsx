import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/lib/content";

interface Props {
  entries: TimelineEntry[];
}

/** Format "YYYY-MM" to "Mon YYYY" */
function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Color mapping per entry type */
const dotColors: Record<TimelineEntry["type"], string> = {
  education: "bg-blue-500",
  certification: "bg-[hsl(var(--primary))]",
  career: "bg-amber-500",
};

const labelColors: Record<TimelineEntry["type"], string> = {
  education: "text-blue-600 dark:text-blue-400",
  certification: "text-[hsl(var(--primary))]",
  career: "text-amber-600 dark:text-amber-400",
};

const typeLabels: Record<TimelineEntry["type"], string> = {
  education: "Education",
  certification: "Certification",
  career: "Career",
};

export function Timeline({ entries }: Props) {
  /* Layout constants (must stay in sync):
     - Date column: w-16 (64px) mobile, sm:w-20 (80px)
     - Gap between date and content: gap-6 (24px)
     - Vertical line + dot: centered at the boundary between date and content.
       Position = date-width + gap/2 = 64 + 12 = 76px mobile, 80 + 12 = 92px sm.
       Dot is 10px (w-2.5), so left-edge of dot = 76 - 5 = 71px / 87px.
       Line is 1px wide, so left-edge of line = 76 - 0.5 ≈ 75.5px / 91.5px.
       We use left-[76px]/sm:left-[92px] with -translate-x-1/2 for both. */

  return (
    <div className="relative">
      {/* Vertical line — centered between date column and content */}
      <div className="absolute left-[76px] top-0 bottom-0 w-px -translate-x-1/2 bg-border sm:left-[92px]" />

      <div className="space-y-0">
        {entries.map((entry, index) => (
          <div key={`${entry.date}-${entry.title}`} className="relative flex gap-6">
            {/* Date label — fixed width, right-aligned */}
            <div className="w-16 shrink-0 pt-1 text-right sm:w-20">
              <span className="text-xs font-medium text-muted-foreground">
                {formatDate(entry.date)}
              </span>
            </div>

            {/* Dot — absolutely positioned on the vertical line */}
            <div
              className={cn(
                "absolute left-[76px] top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-2 ring-background sm:left-[92px]",
                dotColors[entry.type]
              )}
            />

            {/* Content — offset to make room for the dot */}
            <div className={cn("min-w-0 flex-1 pl-3 pb-6", index === entries.length - 1 && "pb-0")}>
              <p className="text-sm font-medium leading-snug">{entry.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {entry.subtitle}
              </p>
              <span
                className={cn(
                  "mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider",
                  labelColors[entry.type]
                )}
              >
                {typeLabels[entry.type]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
