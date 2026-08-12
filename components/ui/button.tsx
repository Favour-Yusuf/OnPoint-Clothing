import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "text";
type Tone = "on-dark" | "on-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans text-xs font-medium tracking-[0.18em] uppercase transition-colors duration-300 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  md: "px-6 py-3",
  lg: "px-8 py-4 text-[13px]",
};

function variantClasses(variant: Variant, tone: Tone): string {
  if (variant === "primary") {
    return "bg-burgundy text-[#f2f0ee] hover:bg-burgundy-light";
  }
  if (variant === "outline") {
    return tone === "on-dark"
      ? "border border-foreground/35 text-foreground hover:border-foreground hover:bg-foreground/5"
      : "border border-background/30 text-background hover:border-background hover:bg-background/5";
  }
  // text
  return tone === "on-dark"
    ? "text-foreground/80 hover:text-foreground underline decoration-burgundy decoration-2 underline-offset-8"
    : "text-background/70 hover:text-background underline decoration-burgundy decoration-2 underline-offset-8";
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
