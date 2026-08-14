export function MetricCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="border-l border-foreground/10 pl-5 first:border-l-0 first:pl-0">
      <p className="font-sans text-xs font-medium tracking-[0.18em] text-foreground/45 uppercase">{label}</p>
      <p className="mt-2 font-serif text-3xl font-light text-foreground tabular-nums sm:text-[2.25rem]">{value}</p>
      {sublabel ? <p className="mt-1 font-sans text-xs text-foreground/45">{sublabel}</p> : null}
    </div>
  );
}
