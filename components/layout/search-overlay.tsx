"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUI } from "@/lib/ui-context";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/media-image";
import { getPrimaryImage } from "@/lib/cloudinary/image";

const POPULAR_SEARCHES = ["Overcoats", "Tailoring", "Cashmere", "Bespoke", "Accessories"];

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(isSearchOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query when the overlay closes. Adjusting state during render
  // (rather than in an effect) avoids an extra render pass — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (isSearchOpen !== wasOpen) {
    setWasOpen(isSearchOpen);
    if (!isSearchOpen) setQuery("");
  }

  useEffect(() => {
    if (!isSearchOpen) return;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(id);
    };
  }, [isSearchOpen]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return products
      .filter((product) => `${product.name} ${product.categorySlug} ${product.shortDescription}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background" role="dialog" aria-modal="true" aria-label="Search">
      <div className="border-b border-foreground/10">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-6">
          <SearchIcon className="h-5 w-5 shrink-0 text-foreground/50" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full bg-transparent font-display text-2xl font-light text-foreground placeholder:text-foreground/35 focus:outline-none sm:text-3xl"
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-foreground/70 hover:text-foreground"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 py-10">
        {query.trim() === "" ? (
          <div>
            <p className="font-sans text-xs font-light tracking-[0.25em] text-foreground/50 uppercase">Popular Searches</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="border border-foreground/15 px-4 py-2 font-sans text-sm text-foreground/75 transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-start gap-2 py-10">
            <p className="font-display text-2xl font-light text-foreground">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-foreground/55">Try a category like Men, Women, or Accessories.</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-foreground/10">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-5 py-4 transition-opacity hover:opacity-80"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-foreground/5">
                    <MediaImage image={getPrimaryImage(product.images)} sizes="80px" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="font-sans text-sm font-semibold text-foreground">{product.name}</p>
                    <p className="font-sans text-xs text-foreground/50 capitalize">{product.categorySlug}</p>
                  </div>
                  <p className="font-sans text-sm font-light tracking-wide text-foreground/80 tabular-nums">{formatPrice(product.price)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
