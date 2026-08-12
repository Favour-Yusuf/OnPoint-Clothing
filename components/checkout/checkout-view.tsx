"use client";

import { useActionState, useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { placeOrder, type CheckoutState } from "@/lib/actions/checkout";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckIcon } from "@/components/ui/icons";

const initialState: CheckoutState = { status: "idle" };

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Shipping", detail: "5–7 business days", price: 0 },
  { id: "express", label: "Express Shipping", detail: "1–2 business days", price: 35 },
] as const;

export function CheckoutView() {
  const { items, subtotal, clear } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [delivery, setDelivery] = useState<(typeof DELIVERY_OPTIONS)[number]["id"]>("standard");

  const shipping = DELIVERY_OPTIONS.find((option) => option.id === delivery)?.price ?? 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (state.status === "success") clear();
    // Clearing intentionally excluded from deps — only run once when status flips to success.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  if (state.status === "success") {
    return (
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-burgundy-light">
          <CheckIcon className="h-6 w-6 text-burgundy-light" />
        </span>
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">Order Received</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/60">{state.message}</p>
        </div>
        <p className="font-sans text-xs tracking-[0.2em] text-foreground/45 uppercase">Reference {state.orderId}</p>
        <div className="max-w-md border border-foreground/15 p-5">
          <p className="text-sm leading-relaxed text-foreground/60">
            Payment processing isn&rsquo;t connected yet, so no charge has been made. Our team will follow up by
            email to confirm your order and arrange payment.
          </p>
        </div>
        <Button href="/shop">Continue Shopping</Button>
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
      <form action={formAction} className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
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
                    delivery === option.id ? "border-foreground" : "border-foreground/20 hover:border-foreground/40"
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
            <div className="border border-dashed border-foreground/20 p-6 text-center">
              <p className="font-sans text-sm text-foreground/60">
                Payment processing isn&rsquo;t connected yet. Placing your order records the details above without
                charging a card — a payment provider will be added ahead of launch.
              </p>
            </div>
          </Section>

          {state.status === "error" ? (
            <p className="font-sans text-sm text-burgundy-light">{state.message}</p>
          ) : null}
        </div>

        <div className="h-fit border border-foreground/10 p-6 lg:sticky lg:top-28">
          <p className="font-sans text-xs font-medium tracking-[0.25em] text-foreground/60 uppercase">Order Summary</p>
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
            {pending ? "Placing Order…" : "Place Order"}
          </Button>
        </div>
      </form>
    </Container>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-3 font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">
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
          error ? "border-burgundy-light" : "border-foreground/20 focus:border-foreground/50"
        }`}
      />
      {error ? <span className="font-sans text-xs text-burgundy-light">{error}</span> : null}
    </label>
  );
}
