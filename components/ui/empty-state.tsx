import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  tone = "on-dark",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "on-dark" | "on-light";
}) {
  const textColor = tone === "on-light" ? "text-background" : "text-foreground";
  const mutedColor = tone === "on-light" ? "text-background/55" : "text-foreground/55";

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="h-px w-10 bg-burgundy" aria-hidden="true" />
      <p className={`font-display text-2xl font-light ${textColor}`}>{title}</p>
      {description ? <p className={`max-w-sm text-sm ${mutedColor}`}>{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
