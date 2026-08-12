import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "on-dark",
  action,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "on-dark" | "on-light";
  action?: ReactNode;
  className?: string;
}) {
  const mutedColor = tone === "on-dark" ? "text-foreground/60" : "text-background/60";
  const alignClasses = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-5 ${alignClasses} ${className}`}>
      <div className={`flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${align === "center" ? "sm:justify-center" : ""}`}>
        <div className={`flex flex-col gap-4 ${align === "center" ? "items-center" : "items-start"}`}>
          {eyebrow ? (
            <p className="font-sans text-xs font-medium tracking-[0.35em] text-burgundy uppercase">{eyebrow}</p>
          ) : null}
          <h2 className="max-w-2xl font-serif text-3xl leading-[1.1] font-light sm:text-4xl lg:text-5xl">{title}</h2>
          {description ? <p className={`max-w-xl text-base leading-relaxed sm:text-lg ${mutedColor}`}>{description}</p> : null}
        </div>
        {action && align !== "center" ? <div className="shrink-0">{action}</div> : null}
      </div>
      {action && align === "center" ? <div>{action}</div> : null}
    </div>
  );
}
