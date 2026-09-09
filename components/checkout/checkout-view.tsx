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
import { ChevronDownIcon, BankIcon, CopyIcon, CheckIcon, ChatIcon } from "@/components/ui/icons";
import { CONTACT, BANK_TRANSFER } from "@/lib/contact";
import { COUNTRIES, NIGERIA, NIGERIA_STATES, getShippingZone, SHIPPING_RATES } from "@/lib/shipping";
import type { CartItem } from "@/lib/types";

const initialState: CheckoutState = { status: "idle" };

const PAYMENT_METHODS = [
  { id: "paystack", label: "Pay Online", detail: "Card, bank transfer, or USSD via Paystack" },
  { id: "bank_transfer", label: "Direct Bank Transfer", detail: "If Paystack isn't working for you" },
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
  const { items, subtotal, clear } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]["id"]>("paystack");
  const [phase, setPhase] = useState<Phase>("form");
  const [phaseMessage, setPhaseMessage] = useState<string | null>(null);
  const openedReferenceRef = useRef<string | null>(null);
  const clearedForBankTransferRef = useRef(false);

  // Shipping is resolved from the address, not chosen — see lib/shipping.ts.
  // Nigeria defaults selected since almost every order ships domestically.
  const [country, setCountry] = useState<string>(NIGERIA);
  const [addressState, setAddressState] = useState<string>("");
  const [lagosArea, setLagosArea] = useState<"island" | "mainland">("island");

  const shippingZone = getShippingZone(country, addressState, lagosArea);
  const shippingRate = SHIPPING_RATES[shippingZone];
  // SHIPPING_RATES.fee is minor units (kobo), matching the server-side
  // convention in lib/actions/checkout.ts — but subtotal here (from
  // useCart()) is major units (naira), so it needs converting before it's
  // combined with anything client-side.
  const shipping = (shippingRate.fee ?? 0) / 100;
  const total = subtotal + shipping;
  const showLagosArea = country === NIGERIA && addressState === "Lagos";
  // No zone is ever actually free — a $0 shipping fee only ever means
  // "international, not priced yet" (see SHIPPING_RATES), never a discount.
  const shippingDisplay = shippingRate.fee === null ? "To be confirmed" : formatPrice(shipping);

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

  useEffect(() => {
    if (state.status !== "bank_transfer" || clearedForBankTransferRef.current) return;
    clearedForBankTransferRef.current = true;
    clear();
  }, [state.status, clear]);

  if (state.status === "bank_transfer" && state.bankTransfer) {
    const { orderNumber, total: orderTotal } = state.bankTransfer;
    const whatsappMessage = `Hi OnPoint, I just placed order #${orderNumber} (${formatPrice(
      orderTotal
    )}) and made a bank transfer. Attaching my payment receipt.`;

    return (
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-burgundy-light">
          <CheckIcon className="h-6 w-6 text-burgundy-light" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-light text-foreground sm:text-4xl">Order Placed</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/60">
            Transfer {formatPrice(orderTotal)} using the details below, then send us your receipt on WhatsApp so we
            can confirm and start processing right away.
          </p>
        </div>
        <p className="font-sans text-xs font-light tracking-[0.2em] text-foreground/45 uppercase">
          Reference {orderNumber}
        </p>

        <BankTransferDetails />

        <div className="flex w-full max-w-sm flex-col gap-3">
          <a
            href={`${CONTACT.whatsapp.href}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-burgundy px-6 py-3 font-sans text-xs font-medium tracking-[0.18em] text-foreground uppercase transition-colors hover:bg-burgundy-light"
          >
            <ChatIcon className="h-4 w-4" />
            Send Receipt on WhatsApp
          </a>
          <Button href="/shop" variant="outline">
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  if (phase === "awaiting-payment" || phase === "verifying") {
    return (
      <Container className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-light text-foreground">
          {phase === "verifying" ? "Confirming Your Payment…" : "Complete Your Payment"}
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/55">
          {phase === "verifying"
            ? "Almost there, just a moment while we confirm your payment with Paystack."
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

      <form action={formAction} className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-[1fr_380px]">
        <input type="hidden" name="cartItems" value={JSON.stringify(items)} />

        <MobileOrderSummary items={items} subtotal={subtotal} shippingDisplay={shippingDisplay} total={total} />

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

              <Select
                label="Country"
                name="country"
                value={country}
                onChange={(value) => {
                  setCountry(value);
                  setAddressState("");
                }}
                error={state.errors?.country}
                autoComplete="country-name"
              >
                {COUNTRIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>

              {country === NIGERIA ? (
                <Select
                  label="State"
                  name="state"
                  value={addressState}
                  onChange={setAddressState}
                  error={state.errors?.state}
                  autoComplete="address-level1"
                >
                  <option value="">Select a state</option>
                  {NIGERIA_STATES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : (
                <Field
                  label="State / Province"
                  name="state"
                  error={state.errors?.state}
                  autoComplete="address-level1"
                />
              )}

              <Field label="Postal Code" name="postalCode" error={state.errors?.postalCode} autoComplete="postal-code" />
              <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />

              {showLagosArea ? (
                <Select
                  label="Lagos Area"
                  name="lagosArea"
                  value={lagosArea}
                  onChange={(value) => setLagosArea(value as "island" | "mainland")}
                  error={state.errors?.lagosArea}
                  className="sm:col-span-2"
                >
                  <option value="island">Lagos Island</option>
                  <option value="mainland">Lagos Mainland</option>
                </Select>
              ) : null}
            </div>
          </Section>

          <Section index="03" title="Delivery">
            <div className="border border-foreground/20 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-foreground">{shippingRate.label}</span>
                <span className="font-sans text-sm text-foreground/70 tabular-nums">
                  {shippingRate.fee === null ? "To be confirmed" : formatPrice(shippingRate.fee / 100)}
                </span>
              </div>
              <p className="mt-1 font-sans text-xs text-foreground/50">{shippingRate.eta}</p>
            </div>
          </Section>

          <Section index="04" title="Payment">
            <input type="hidden" name="paymentMethod" value={paymentMethod} />
            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center justify-between border px-4 py-3 transition-colors ${
                    paymentMethod === method.id ? "border-burgundy" : "border-foreground/20 hover:border-burgundy-light/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethodChoice"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="h-4 w-4 accent-burgundy"
                    />
                    <span>
                      <span className="block font-sans text-sm text-foreground">{method.label}</span>
                      <span className="block font-sans text-xs text-foreground/50">{method.detail}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {paymentMethod === "paystack" ? (
              <div className="mt-4 border border-foreground/15 p-6 text-center">
                <p className="font-sans text-sm text-foreground/60">
                  You&rsquo;ll enter your card details securely in a Paystack window on this page. OnPoint never
                  sees or stores your card information.
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-start gap-4">
                <p className="font-sans text-sm text-foreground/60">
                  Transfer the order total to the account below, then send your receipt on WhatsApp. We&rsquo;ll
                  confirm and process your order right away.
                </p>
                <BankTransferDetails />
              </div>
            )}
          </Section>

          {state.status === "error" ? (
            <p className="font-sans text-sm text-burgundy-light">{state.message}</p>
          ) : null}
          {phase === "verify-failed" && phaseMessage ? (
            <p className="font-sans text-sm text-burgundy-light">{phaseMessage}</p>
          ) : null}
        </div>

        <div className="h-fit border border-t-2 border-foreground/10 border-t-burgundy bg-foreground/2 p-6 lg:sticky lg:top-28">
          {/* Full breakdown: desktop-only — the mobile equivalent is the
              collapsible MobileOrderSummary above the form. */}
          <div className="hidden lg:block">
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
                <span className="tabular-nums">{shippingDisplay}</span>
              </div>
              <div className="flex justify-between border-t border-foreground/10 pt-2 text-base text-foreground">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={pending} className="w-full lg:mt-6">
            {pending
              ? "Placing Order…"
              : paymentMethod === "bank_transfer"
                ? `Place Order · ${formatPrice(total)}`
                : `Pay Now · ${formatPrice(total)}`}
          </Button>
        </div>
      </form>
    </Container>
  );
}

function MobileOrderSummary({
  items,
  subtotal,
  shippingDisplay,
  total,
}: {
  items: CartItem[];
  subtotal: number;
  shippingDisplay: string;
  total: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-foreground/10 bg-foreground/2 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5"
      >
        <span className="flex items-center gap-2 font-sans text-xs font-light tracking-[0.15em] text-foreground/70 uppercase">
          <ChevronDownIcon className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          Order Summary &middot; {items.length} {items.length === 1 ? "item" : "items"}
        </span>
        <span className="shrink-0 font-sans text-sm text-foreground tabular-nums">{formatPrice(total)}</span>
      </button>

      {open ? (
        <div className="border-t border-foreground/10 px-4 py-4">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 font-sans text-sm">
                <span className="text-foreground/70">
                  {item.name} <span className="text-foreground/40">&times;{item.quantity}</span>
                </span>
                <span className="shrink-0 text-foreground tabular-nums">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-foreground/10 pt-4 font-sans text-sm">
            <div className="flex justify-between text-foreground/60">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>Shipping</span>
              <span className="tabular-nums">{shippingDisplay}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BankTransferDetails() {
  return (
    <div className="w-full max-w-sm border border-foreground/15 p-5 text-left">
      <div className="flex items-center gap-2 text-foreground/50">
        <BankIcon className="h-4 w-4" />
        <p className="font-sans text-xs font-light tracking-[0.15em] uppercase">Bank Transfer Details</p>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <DetailRow label="Bank" value={BANK_TRANSFER.bankName} />
        <DetailRow label="Account Name" value={BANK_TRANSFER.accountName} />
        <DetailRow label="Account Number" value={BANK_TRANSFER.accountNumber} copyable />
      </div>
    </div>
  );
}

function DetailRow({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the value is still visible/selectable text.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="font-sans text-xs text-foreground/45">{label}</p>
        <p className="font-sans text-sm text-foreground tabular-nums">{value}</p>
      </div>
      {copyable ? (
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 border border-foreground/20 px-3 py-1.5 font-sans text-xs text-foreground/70 transition-colors hover:border-burgundy-light hover:text-burgundy-light"
        >
          {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      ) : null}
    </div>
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

function Select({
  label,
  name,
  value,
  onChange,
  error,
  className = "",
  autoComplete,
  children,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  autoComplete?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-sans text-xs text-foreground/50">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className={`border bg-transparent px-3 py-2.5 font-sans text-sm text-foreground focus-visible:outline-none ${
          error ? "border-burgundy-light" : "border-foreground/20 focus:border-burgundy-light"
        }`}
      >
        {children}
      </select>
      {error ? <span className="font-sans text-xs text-burgundy-light">{error}</span> : null}
    </label>
  );
}
