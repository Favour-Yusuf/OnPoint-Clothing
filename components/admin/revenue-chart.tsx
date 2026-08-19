"use client";

import { useId, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { RevenuePoint } from "@/lib/dashboard";

const HEIGHT = 120;
const BAR_GAP = 2;

// Single series (revenue) — magnitude only, so one sequential hue off the
// brand's burgundy accent rather than a categorical palette. No legend
// needed for one series; the section heading already names it. Orders are
// surfaced as tooltip/sr-only text rather than a second scale, since a
// dual-axis chart (revenue $ vs. order count) is the #1 chart anti-pattern.
export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const captionId = useId();

  const max = Math.max(1, ...data.map((d) => d.revenue));
  const barWidth = data.length > 0 ? 100 / data.length : 100;

  if (data.length === 0 || data.every((d) => d.revenue === 0 && d.orders === 0)) {
    return <p className="font-sans text-sm text-foreground/45">No activity in this period yet.</p>;
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 100 ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-32 w-full overflow-visible"
        role="img"
        aria-describedby={captionId}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <line x1="0" y1={HEIGHT - 1} x2="100" y2={HEIGHT - 1} stroke="currentColor" strokeWidth="0.5" className="text-foreground/10" />
        {data.map((point, i) => {
          const barHeight = (point.revenue / max) * (HEIGHT - 12);
          const x = i * barWidth + BAR_GAP / 2;
          const w = Math.max(0, barWidth - BAR_GAP);
          const y = HEIGHT - 1 - barHeight;
          const isHovered = hoverIndex === i;
          return (
            <rect
              key={point.label + i}
              x={x}
              y={barHeight > 0 ? y : HEIGHT - 2}
              width={w}
              height={barHeight > 0 ? barHeight : 1}
              rx="1"
              className={isHovered ? "fill-burgundy-light" : "fill-burgundy"}
              onMouseEnter={() => setHoverIndex(i)}
            />
          );
        })}
      </svg>

      {hoverIndex !== null ? (
        <div className="pointer-events-none absolute -top-2 left-0 -translate-y-full font-sans text-xs whitespace-nowrap text-foreground">
          <p className="text-foreground/50">{data[hoverIndex].label}</p>
          <p>
            {formatPrice(data[hoverIndex].revenue / 100)} &middot; {data[hoverIndex].orders}{" "}
            {data[hoverIndex].orders === 1 ? "order" : "orders"}
          </p>
        </div>
      ) : null}

      <div className="mt-2 flex justify-between font-sans text-[10px] font-light tracking-[0.05em] text-foreground/35 uppercase">
        <span>{data[0]?.label}</span>
        {data.length > 1 ? <span>{data[data.length - 1]?.label}</span> : null}
      </div>

      <table id={captionId} className="sr-only">
        <caption>Revenue and orders by period</caption>
        <thead>
          <tr>
            <th>Period</th>
            <th>Revenue</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <td>{point.label}</td>
              <td>{formatPrice(point.revenue / 100)}</td>
              <td>{point.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
