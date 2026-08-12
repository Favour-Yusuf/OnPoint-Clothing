import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  return <Tag className={`mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16 xl:px-20 ${className}`}>{children}</Tag>;
}
