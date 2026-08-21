"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { MediaImage } from "@/components/ui/media-image";
import { TrashIcon } from "@/components/ui/icons";
import type { CartItem } from "@/lib/types";

export function CartLineItem({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { updateQuantity, removeItem } = useCart();
  const imageSize = compact ? "h-28 w-20" : "h-40 w-32";

  return (
    <div className="flex gap-4">
      <Link
        href={`/product/${item.slug}`}
        className={`relative shrink-0 overflow-hidden bg-foreground/5 ${imageSize}`}
      >
        <MediaImage image={item.image} sizes={compact ? "88px" : "128px"} />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/product/${item.slug}`} className="font-sans text-sm font-semibold tracking-wide text-foreground uppercase hover:text-foreground/80">
              {item.name}
            </Link>
            <p className="mt-1 font-sans text-xs text-foreground/50">
              {item.color} &middot; {item.size}
            </p>
          </div>
          <p className="font-sans text-sm font-light tracking-wide text-foreground tabular-nums">{formatPrice(item.price * item.quantity)}</p>
        </div>

        <div className="flex items-center justify-between">
          <QuantitySelector size="sm" value={item.quantity} onChange={(next) => updateQuantity(item.key, next)} />
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            aria-label={`Remove ${item.name} from bag`}
            className="flex items-center gap-1.5 font-sans text-xs text-foreground/45 transition-colors hover:text-burgundy-light"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
