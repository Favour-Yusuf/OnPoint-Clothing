"use client";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const height = size === "sm" ? "h-9" : "h-12";
  const width = size === "sm" ? "w-8" : "w-10";

  return (
    <div className={`inline-flex ${height} items-stretch border border-foreground/20`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${width} flex items-center justify-center text-foreground/70 transition-colors hover:bg-burgundy/10 hover:text-burgundy-light disabled:pointer-events-none disabled:opacity-30`}
      >
        &minus;
      </button>
      <span className="flex w-10 items-center justify-center font-sans text-sm tabular-nums text-foreground" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${width} flex items-center justify-center text-foreground/70 transition-colors hover:bg-burgundy/10 hover:text-burgundy-light disabled:pointer-events-none disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
}
