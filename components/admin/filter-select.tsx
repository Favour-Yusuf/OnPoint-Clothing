"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FilterSelect({
  paramName,
  label,
  options,
}: {
  paramName: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(paramName) ?? "all";

  function handleChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") params.delete(paramName);
    else params.set(paramName, next);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 font-sans text-xs text-foreground/50">
      <span className="hidden sm:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="border border-foreground/20 bg-transparent px-2.5 py-2 font-sans text-xs text-foreground focus:border-foreground/50 focus-visible:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-background">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
