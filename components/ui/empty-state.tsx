import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="h-px w-10 bg-foreground/20" aria-hidden="true" />
      <p className="font-serif text-2xl font-light text-foreground">{title}</p>
      {description ? <p className="max-w-sm text-sm text-foreground/55">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
