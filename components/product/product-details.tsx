"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useUI } from "@/lib/ui-context";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, CheckIcon } from "@/components/ui/icons";

const AVAILABILITY_LABEL: Record<Product["availability"], string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "made-to-order": "Made to Order",
  "sold-out": "Sold Out",
};

export function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { openCart } = useUI();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => v.color === selectedColor && v.size === selectedSize),
    [product.variants, selectedColor, selectedSize]
  );

  function isSizeInStock(size: string) {
    return product.variants.some((v) => v.color === selectedColor && v.size === size && v.inStock);
  }

  function handleAddToBag() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    if (!variant || !variant.inStock) return;

    addItem(
      {
        key: `${product.id}:${variant.id}`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: variant.size,
        color: variant.color,
      },
      quantity
    );
    setJustAdded(true);
    openCart();
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  const soldOut = product.availability === "sold-out";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-sans text-xs font-medium tracking-[0.3em] text-foreground/45 uppercase">{product.categorySlug}</p>
        <h1 className="mt-3 font-serif text-3xl leading-tight font-light text-foreground sm:text-4xl">{product.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          <p className="font-sans text-lg text-foreground tabular-nums">{formatPrice(product.price)}</p>
          {product.compareAtPrice ? (
            <p className="font-sans text-sm text-foreground/40 line-through tabular-nums">{formatPrice(product.compareAtPrice)}</p>
          ) : null}
        </div>
      </div>

      <p className="max-w-md text-sm leading-relaxed text-foreground/65">{product.shortDescription}</p>

      {/* Color */}
      <div>
        <p className="font-sans text-xs font-medium tracking-[0.15em] text-foreground/60 uppercase">
          Color <span className="text-foreground">{selectedColor}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {product.colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => {
                setSelectedColor(color.name);
                setSelectedSize(null);
              }}
              aria-pressed={selectedColor === color.name}
              aria-label={color.name}
              title={color.name}
              className={`h-9 w-9 rounded-full border-2 transition-all ${
                selectedColor === color.name ? "border-burgundy" : "border-transparent hover:border-foreground/30"
              }`}
              style={{ backgroundColor: color.hex, boxShadow: "inset 0 0 0 1px rgba(242,240,238,0.15)" }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs font-medium tracking-[0.15em] text-foreground/60 uppercase">Size</p>
          <button type="button" className="font-sans text-xs text-foreground/50 underline hover:text-foreground">
            Size Guide
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((size) => {
            const inStock = isSizeInStock(size);
            return (
              <button
                key={size}
                type="button"
                disabled={!inStock}
                onClick={() => {
                  setSelectedSize(size);
                  setSizeError(false);
                }}
                className={`min-w-11 border px-3 py-2.5 font-sans text-sm transition-colors ${
                  selectedSize === size
                    ? "border-foreground bg-foreground text-background"
                    : inStock
                      ? "border-foreground/25 text-foreground hover:border-foreground/60"
                      : "border-foreground/10 text-foreground/25 line-through"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
        {sizeError ? <p className="mt-2 font-sans text-xs text-burgundy-light">Select a size to continue.</p> : null}
      </div>

      {/* Quantity + Add to bag */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <p className="font-sans text-xs font-medium tracking-[0.15em] text-foreground/60 uppercase">Qty</p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        <Button type="button" onClick={handleAddToBag} disabled={soldOut} className="w-full">
          {soldOut ? "Sold Out" : justAdded ? "Added to Bag" : "Add to Bag"}
        </Button>

        <p className="flex items-center gap-2 font-sans text-xs text-foreground/50">
          {product.availability !== "sold-out" ? <CheckIcon className="h-3.5 w-3.5 text-burgundy-light" /> : null}
          {AVAILABILITY_LABEL[product.availability]}
          {product.isBespokeEligible ? " · Available as Bespoke" : ""}
        </p>
      </div>

      {/* Accordions */}
      <div className="flex flex-col border-t border-foreground/10">
        <DetailAccordion title="Details" items={product.details} />
        <DetailAccordion title="Care" items={product.care} />
        <DetailAccordion title="Shipping & Returns" text="Complimentary shipping on orders over ₦20,000. Returns accepted within 30 days of delivery, unworn and with tags attached." />
      </div>
    </div>
  );
}

function DetailAccordion({ title, items, text }: { title: string; items?: string[]; text?: string }) {
  return (
    <details className="group border-b border-foreground/10 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-sm text-foreground">
        {title}
        <ChevronDownIcon className="h-4 w-4 text-foreground/50 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-foreground/60">
        {items ? (
          <ul className="flex flex-col gap-1.5">
            {items.map((item) => (
              <li key={item}>&bull; {item}</li>
            ))}
          </ul>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </details>
  );
}
