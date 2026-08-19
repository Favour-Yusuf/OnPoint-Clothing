"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartLineItem } from "@/components/cart/cart-line-item";

export function CartView() {
  const { items, subtotal } = useCart();

  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-12 sm:py-16">
        <h1 className="font-display text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">Your Bag</h1>
      </Container>

      <Container className="pb-20">
        {items.length === 0 ? (
          <EmptyState
            title="Your bag is empty"
            description="Pieces you add to your bag will appear here."
            action={<Button href="/shop">Continue Shopping</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-8 divide-y divide-foreground/10">
              {items.map((item) => (
                <div key={item.key} className="pt-8 first:pt-0">
                  <CartLineItem item={item} />
                </div>
              ))}
            </div>

            <div className="h-fit border border-foreground/10 p-6">
              <p className="font-sans text-xs font-light tracking-[0.25em] text-foreground/60 uppercase">Order Summary</p>
              <div className="mt-5 flex items-center justify-between font-sans text-sm text-foreground">
                <span className="text-foreground/60">Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-foreground/45">Shipping and taxes calculated at checkout.</p>
              <Button href="/checkout" className="mt-6 w-full">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
