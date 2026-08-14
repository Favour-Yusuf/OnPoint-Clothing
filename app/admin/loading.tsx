export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-[1400px] animate-pulse px-4 py-8 sm:px-6 sm:py-10">
      <div className="h-7 w-40 bg-foreground/10" />
      <div className="mt-8 h-32 border border-foreground/10 bg-foreground/[0.03]" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-foreground/[0.03]" />
        ))}
      </div>
    </div>
  );
}
