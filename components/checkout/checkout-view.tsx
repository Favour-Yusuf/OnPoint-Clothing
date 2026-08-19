"use client";

import Script from "next/script";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { placeOrder, type CheckoutState } from "@/lib/actions/checkout";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const initialState: CheckoutState = { status: "idle" };

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Shipping", detail: "5–7 business days", price: 0 },
  { id: "express", label: "Express Shipping", detail: "1–2 business days", price: 3500 },
] as const;

// "form": the checkout form is visible and can be submitted.
// "awaiting-payment": placeOrder succeeded, the inline Paystack popup is
//   open (or about to open) — the form is hidden so it can't be
//   resubmitted while a payment attempt is in flight.
// "verifying": the popup reported success; confirming with our backend.
// "verify-failed": confirmation didn't come back paid — safe to go back to
//   the form and try again (the cart/details are untouched).
type Phase = "form" | "awaiting-payment" | "verifying" | "verify-failed";

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [delivery, setDelivery] = useState<(typeof DELIVERY_OPTIONS)[number]["id"]>("standard");
  const [phase, setPhase] = useState<Phase>("form");
  const [phaseMessage, setPhaseMessage] = useState<string | null>(null);
  const openedReferenceRef = useRef<string | null>(null);

  const shipping = DELIVERY_OPTIONS.find((option) => option.id === delivery)?.price ?? 0;
  const total = subtotal + shipping;

  const verifyPayment = useCallback(
    async (reference: string) => {
      try {
        const response = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const result: { ok: boolean; paid: boolean; message: string } = await response.json();

        if (result.paid) {
          // Cart clears on /payment/success itself, once it independently
          // confirms payment_status === "paid" — never here on the strength
          // of this one response alone.
          router.push(`/payment/success?reference=${encodeURIComponent(reference)}`);
          return;
        }

        setPhase("verify-failed");
        setPhaseMessage(result.message || "We couldn't confirm your payment.");
      } catch {
        setPhase("verify-failed");
        setPhaseMessage("A network error interrupted payment confirmation. Please try again.");
      }
    },
    [router]
  );

  const openInlinePayment = useCallback(
    (payment: NonNullable<CheckoutState["payment"]>) => {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!window.PaystackPop || !publicKey) {
        setPhase("verify-failed");
        setPhaseMessage("Payment could not be started. Please refresh the page and try again.");
        return;
      }

      setPhase("awaiting-payment");
      setPhaseMessage(null);

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: payment.email,
        amount: payment.amount,
        currency: "NGN",
        ref: payment.reference,
        metadata: { order_id: payment.orderId },
        onClose: () => {
          // Customer closed the popup without paying — back to the form,
          // cart and details untouched. The order stays pending; a fresh
          // "Pay Now" click will place a new order/reference.
          setPhase("form");
        },
        callback: (response) => {
          setPhase("verifying");
          verifyPayment(response.reference);
        },
      });
      handler.openIframe();
    },
    [verifyPayment]
  );

  useEffect(() => {
    if (state.status !== "ready" || !state.payment) return;
    if (openedReferenceRef.current === state.payment.reference) return;
    openedReferenceRef.current = state.payment.reference;
    openInlinePayment(state.payment);
  }, [state, openInlinePayment]);

  if (phase === "awaiting-payment" || phase === "verifying") {
    return (
      <Container className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-light text-foreground">
          {phase === "verifying" ? "Confirming Your Payment…" : "Complete Your Payment"}
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/55">
          {phase === "verifying"
            ? "Almost there — just a moment while we confirm your payment with Paystack."
            : "Enter your payment details in the Paystack window. Don’t close this page."}
        </p>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Your bag is empty"
          description="Add something to your bag before checking out."
          action={<Button href="/shop">Continue Shopping</Button>}
        />
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

      <form action={formAction} className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
        <input type="hidden" name="cartItems" value={JSON.stringify(items)} />
        <div className="flex flex-col gap-10">
          <Section index="01" title="Contact">
            <Field label="Email" name="email" type="email" error={state.errors?.email} autoComplete="email" />
          </Section>

          <Section index="02" title="Shipping Address">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" name="fullName" error={state.errors?.fullName} className="sm:col-span-2" autoComplete="name" />
              <Field label="Address" name="address1" error={state.errors?.address1} className="sm:col-span-2" autoComplete="address-line1" />
              <Field label="Apt, Suite, etc. (optional)" name="address2" autoComplete="address-line2" />
              <Field label="City" name="city" error={state.errors?.city} autoComplete="address-level2" />
              <Field label="State / Province" name="state" error={state.errors?.state} autoComplete="address-level1" />
              <Field label="Postal Code" name="postalCode" error={state.errors?.postalCode} autoComplete="postal-code" />
              <Field label="Country" name="country" error={state.errors?.country} autoComplete="country-name" />
              <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
            </div>
          </Section>

          <Section index="03" title="Delivery Method">
            <div className="flex flex-col gap-3">
              {DELIVERY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between border px-4 py-3 transition-colors ${
                    delivery === option.id ? "border-burgundy" : "border-foreground/20 hover:border-burgundy-light/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={delivery === option.id}
                      onChange={() => setDelivery(option.id)}
                      className="h-4 w-4 accent-burgundy"
                    />
                    <span>
                      <span className="block font-sans text-sm text-foreground">{option.label}</span>
                      <span className="block font-sans text-xs text-foreground/50">{option.detail}</span>
                    </span>
                  </span>
                  <span className="font-sans text-sm text-foreground/70 tabular-nums">
                    {option.price === 0 ? "Free" : formatPrice(option.price)}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          <Section index="04" title="Payment">
            <div className="border border-foreground/15 p-6 text-center">
              <p className="font-sans text-sm text-foreground/60">
                You&rsquo;ll enter your card details securely in a Paystack window on this page — OnPoint never sees
                or stores your card information.
              </p>
            </div>
          </Section>

          {state.status === "error" ? (
            <p className="font-sans text-sm text-burgundy-light">{state.message}</p>
          ) : null}
          {phase === "verify-failed" && phaseMessage ? (
            <p className="font-sans text-sm text-burgundy-light">{phaseMessage}</p>
          ) : null}
        </div>

        <div className="h-fit border border-t-2 border-foreground/10 border-t-burgundy bg-foreground/2 p-6 lg:sticky lg:top-28">
          <p className="font-sans text-xs font-light tracking-[0.25em] text-foreground/60 uppercase">Order Summary</p>
          <div className="mt-5 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 font-sans text-sm">
                <span className="text-foreground/70">
                  {item.name} <span className="text-foreground/40">&times;{item.quantity}</span>
                </span>
                <span className="shrink-0 text-foreground tabular-nums">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-2 border-t border-foreground/10 pt-5 font-sans text-sm">
            <div className="flex justify-between text-foreground/60">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>Shipping</span>
              <span className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-foreground/10 pt-2 text-base text-foreground">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
          <Button type="submit" disabled={pending} className="mt-6 w-full">
            {pending ? "Placing Order…" : "Pay Now"}
          </Button>
        </div>
      </form>
    </Container>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-3 font-sans text-xs font-light tracking-[0.2em] text-foreground/50 uppercase">
        <span className="text-burgundy">{index}</span> {title}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  className = "",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  className?: string;
  autoComplete?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-sans text-xs text-foreground/50">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        className={`border bg-transparent px-3 py-2.5 font-sans text-sm text-foreground focus-visible:outline-none ${
          error ? "border-burgundy-light" : "border-foreground/20 focus:border-burgundy-light"
        }`}
      />
      {error ? <span className="font-sans text-xs text-burgundy-light">{error}</span> : null}
    </label>
  );
}
