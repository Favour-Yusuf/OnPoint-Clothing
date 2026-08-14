import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { getOrderByReference } from "@/lib/orders";
import { ClearCartOnSuccess } from "@/components/checkout/clear-cart-on-success";

export const metadata: Metadata = {
  title: "Order Confirmation",
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  const order = reference ? await getOrderByReference(reference) : undefined;

  if (!order) {
    return (
      <Container className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-light text-foreground">We Couldn&rsquo;t Find That Order</h1>
        <p className="max-w-md text-sm leading-relaxed text-foreground/60">
          If you completed a payment, check your email for confirmation, or contact us with your reference number.
        </p>
        <Button href="/shop">Continue Shopping</Button>
      </Container>
    );
  }

  if (order.paymentStatus !== "paid") {
    return (
      <Container className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-light text-foreground">Confirming Your Payment&hellip;</h1>
        <p className="max-w-md text-sm leading-relaxed text-foreground/60">
          We&rsquo;re still confirming your payment with Paystack. This usually takes a few seconds — refresh this
          page shortly. You&rsquo;ll also receive an email once it&rsquo;s confirmed.
        </p>
        <p className="font-sans text-xs tracking-[0.2em] text-foreground/45 uppercase">
          Reference {order.orderNumber}
        </p>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col items-center gap-6 py-24 text-center">
      <ClearCartOnSuccess />
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-burgundy-light">
        <CheckIcon className="h-6 w-6 text-burgundy-light" />
      </span>
      <div>
        <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">Order Confirmed</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/60">
          Thank you — your payment was successful and your order is being processed.
        </p>
      </div>
      <p className="font-sans text-xs tracking-[0.2em] text-foreground/45 uppercase">Order {order.orderNumber}</p>

      <div className="w-full max-w-md border border-foreground/15 p-5 text-left">
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between font-sans text-sm">
              <span className="text-foreground/70">
                {item.productName} <span className="text-foreground/40">&times;{item.quantity}</span>
              </span>
              <span className="text-foreground tabular-nums">{formatPrice(item.totalPrice / 100)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-foreground/10 pt-3 font-sans text-sm text-foreground">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(order.total / 100)}</span>
        </div>
      </div>

      <Button href="/shop">Continue Shopping</Button>
    </Container>
  );
}
