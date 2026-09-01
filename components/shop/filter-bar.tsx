"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import type { SortOption, ColorFamily } from "@/lib/products";
import { CloseIcon } from "@/components/ui/icons";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "color", label: "By Color" },
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function FilterBar({
  availableSizes,
  availableColors,
  resultCount,
}: {
  availableSizes: string[];
  availableColors: ColorFamily[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeSize = searchParams.get("size") ?? "";
  const activeColor = searchParams.get("color") ?? "";
  const activeSort = (searchParams.get("sort") as SortOption) || "color";
  const activeCount = [activeSize, activeColor].filter(Boolean).length;

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
    setDrawerOpen(false);
  }

  const controls = (
    <>
      <FilterGroup label="Size">
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => updateParam("size", activeSize === size ? "" : size)}
              className={`border px-3 py-1.5 font-sans text-xs font-light tracking-wide transition-colors ${
                activeSize === size
                  ? "border-burgundy bg-burgundy text-foreground"
                  : "border-background/25 text-background/70 hover:border-burgundy hover:text-burgundy"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Color">
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => updateParam("color", activeColor === color.name ? "" : color.name)}
              aria-pressed={activeColor === color.name}
              aria-label={color.name}
              title={color.name}
              className={`h-7 w-7 rounded-full border transition-all ${
                activeColor === color.name ? "ring-2 ring-burgundy ring-offset-2 ring-offset-foreground" : "border-background/20"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </FilterGroup>
    </>
  );

  return (
    <div className="border-b border-background/10 py-5">
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-xs text-background/50">
          {resultCount} {resultCount === 1 ? "piece" : "pieces"}
        </p>

        <div className="hidden items-center gap-6 lg:flex">
          {controls}
          <label className="flex items-center gap-2 font-sans text-xs text-background/60">
            Sort
            <select
              value={activeSort}
              onChange={(event) => updateParam("sort", event.target.value)}
              className="border border-background/25 bg-transparent px-2 py-1.5 font-sans text-xs text-background focus-visible:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-foreground text-background">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {activeCount > 0 ? (
            <button type="button" onClick={clearAll} className="font-sans text-xs text-background/50 underline hover:text-background">
              Clear
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 border border-background/25 px-4 py-2 font-sans text-xs font-light tracking-wide text-background uppercase lg:hidden"
        >
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <div className="relative flex max-h-[80vh] flex-col gap-6 overflow-y-auto bg-foreground px-6 pt-6 pb-10">
            <div className="flex items-center justify-between">
              <p className="font-sans text-xs font-light tracking-[0.25em] text-background uppercase">Filters</p>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <CloseIcon className="h-5 w-5 text-background/70" />
              </button>
            </div>
            {controls}
            <FilterGroup label="Sort">
              <select
                value={activeSort}
                onChange={(event) => updateParam("sort", event.target.value)}
                className="w-full border border-background/25 bg-transparent px-3 py-2 font-sans text-sm text-background"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-foreground text-background">
                    {option.label}
                  </option>
                ))}
              </select>
            </FilterGroup>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={clearAll} className="flex-1 border border-background/25 py-3 font-sans text-xs font-light tracking-wide text-background uppercase">
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 bg-burgundy py-3 font-sans text-xs font-light tracking-wide text-foreground uppercase"
              >
                Show {resultCount} Results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
      <p className="font-sans text-xs text-background/50 lg:hidden">{label}</p>
      {children}
    </div>
  );
}
