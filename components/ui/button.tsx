import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "text";
type Tone = "on-dark" | "on-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans text-xs font-medium tracking-[0.18em] uppercase transition-all duration-300 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  md: "px-6 py-3",
  lg: "px-8 py-4 text-[13px]",
};

function variantClasses(variant: Variant, tone: Tone): string {
  if (variant === "primary") {
    return "bg-burgundy text-[#f7f1e8] shadow-[0_0_0_0_rgba(176,47,71,0)] hover:-translate-y-px hover:bg-burgundy-light hover:shadow-[0_6px_20px_-4px_rgba(176,47,71,0.55)]";
  }
  if (variant === "outline") {
    return tone === "on-dark"
      ? "border border-foreground/30 text-foreground hover:-translate-y-px hover:border-burgundy-light hover:text-burgundy-light"
      : "border border-background/30 text-background hover:-translate-y-px hover:border-burgundy hover:text-burgundy";
  }
  // text
  return tone === "on-dark"
    ? "text-foreground/80 hover:text-burgundy-light underline decoration-burgundy decoration-2 underline-offset-8"
    : "text-background/70 hover:text-burgundy underline decoration-burgundy decoration-2 underline-offset-8";
}

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", tone = "on-dark", size = "md", className = "" } = props;
  const classes = `${base} ${sizes[size]} ${variantClasses(variant, tone)} ${className}`;

  if ("href" in props && props.href) {
    const { children, href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude from `rest`
  const { children, variant: _variant, tone: _tone, size: _size, className: _className, ...rest } =
    props as ButtonAsButton;
  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
