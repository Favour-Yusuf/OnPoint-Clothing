"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useUI } from "@/lib/ui-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { CloseIcon, BagIcon } from "@/components/ui/icons";
import { CartLineItem } from "@/components/cart/cart-line-item";

export function CartDrawer() {
  const { items, subtotal } = useCart();
  const { isCartOpen, closeCart } = useUI();

  useEffect(() => {
    if (!isCartOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        onClick={closeCart}
        aria-label="Close bag"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />

      <div className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-burgundy/25 bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-5">
          <p className="font-sans text-xs font-light tracking-[0.3em] text-foreground uppercase">
            Your Bag {items.length > 0 ? `(${items.length})` : ""}
          </p>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center text-foreground/70 hover:text-foreground"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <BagIcon className="h-8 w-8 text-foreground/25" />
            <div>
              <p className="font-display text-xl font-light text-foreground">Your bag is empty</p>
              <p className="mt-1 text-sm text-foreground/55">Pieces you add will appear here.</p>
            </div>
            <Button href="/shop" variant="outline" onClick={closeCart} className="mt-2">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <CartLineItem key={item.key} item={item} compact />
                ))}
              </div>
            </div>

            <div className="border-t border-foreground/10 px-6 py-6">
              <div className="mb-5 flex items-center justify-between font-sans text-sm text-foreground">
                <span className="text-foreground/60">Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-5 text-xs text-foreground/45">Shipping and taxes calculated at checkout.</p>
              <Button href="/checkout" onClick={closeCart} className="w-full">
                Proceed to Checkout
              </Button>
              <Button href="/cart" variant="text" onClick={closeCart} className="mt-3 w-full">
                View Bag
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
