import Link from "next/link";
import { DATE_RANGE_LABELS } from "@/lib/dashboard";
import type { DateRangeKey } from "@/lib/types";

const RANGES: DateRangeKey[] = ["today", "7d", "30d", "90d", "12mo"];

export function DateRangeTabs({ active }: { active: DateRangeKey }) {
  return (
    <div className="flex items-center gap-1 font-sans text-xs">
      {RANGES.map((range) => (
        <Link
          key={range}
          href={`/admin?range=${range}`}
          className={`px-3 py-1.5 transition-colors ${
            range === active
              ? "bg-foreground text-background"
              : "text-foreground/55 hover:text-foreground"
          }`}
        >
          {DATE_RANGE_LABELS[range]}
        </Link>
      ))}
    </div>
  );
}
