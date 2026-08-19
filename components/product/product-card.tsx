"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useUI } from "@/lib/ui-context";
import { MediaImage } from "@/components/ui/media-image";
import { getPrimaryImage } from "@/lib/cloudinary/image";

export function ProductCard({ product, tone = "on-light" }: { product: Product; tone?: "on-light" | "on-dark" }) {
  const { addItem } = useCart();
  const { openCart } = useUI();
  const [justAdded, setJustAdded] = useState(false);
  const textColor = tone === "on-light" ? "text-background" : "text-foreground";
  const mutedColor = tone === "on-light" ? "text-background/60" : "text-foreground/60";
  const fadedColor = tone === "on-light" ? "text-background/35" : "text-foreground/35";

  const primaryImage = getPrimaryImage(product.images);
  const secondaryImage = product.images[1] ?? primaryImage;
  const defaultVariant = product.variants.find((variant) => variant.inStock);

  function handleQuickAdd() {
    if (!defaultVariant) return;
    addItem(
      {
        key: `${product.id}:${defaultVariant.id}`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: primaryImage,
        size: defaultVariant.size,
        color: defaultVariant.color,
      },
      1
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
    openCart();
  }

  return (
    <div className="group relative flex flex-col gap-3">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-4/5 w-full overflow-hidden bg-foreground/5 ring-0 ring-inset ring-burgundy transition-shadow duration-300 hover:ring-1"
      >
        <div className="absolute inset-0 opacity-100 transition-opacity duration-500 group-hover:opacity-0">
          <MediaImage image={primaryImage} sizes="(min-width: 1024px) 25vw, 50vw" />
        </div>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <MediaImage image={secondaryImage} sizes="(min-width: 1024px) 25vw, 50vw" />
        </div>

        {product.isNew ? (
          <span className="absolute top-3 left-3 bg-burgundy-deep px-2.5 py-1 font-sans text-[10px] font-light tracking-[0.15em] text-foreground uppercase">
            New
          </span>
        ) : null}
        {product.availability === "low-stock" ? (
          <span className="absolute top-3 left-3 bg-burgundy px-2.5 py-1 font-sans text-[10px] font-light tracking-[0.15em] text-foreground uppercase">
            Low Stock
          </span>
        ) : null}
      </Link>

      {defaultVariant ? (
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute inset-x-3 bottom-16 hidden translate-y-2 bg-burgundy-deep/95 py-3 text-center font-sans text-xs font-medium tracking-[0.15em] text-foreground uppercase opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:block"
        >
          {justAdded ? "Added" : "Quick Add"}
        </button>
      ) : null}

      <Link href={`/product/${product.slug}`} className="flex flex-col gap-1.5">
        <p className={`font-sans text-sm font-semibold transition-colors group-hover:text-burgundy-light ${textColor}`}>{product.name}</p>
        <div className={`flex items-center gap-2 font-sans text-base font-light tracking-wide tabular-nums ${mutedColor}`}>
          <span>{formatPrice(product.price)}</span>
          {product.compareAtPrice ? <span className={`line-through ${fadedColor}`}>{formatPrice(product.compareAtPrice)}</span> : null}
        </div>
      </Link>
    </div>
  );
}
