# Abandoned Checkout Recovery — Design Spec

**Date:** 2026-08-31
**Status:** Approved

## Purpose

Recover orders where a customer submitted checkout (so we have their email,
shipping address, and full order contents) but never completed payment —
Paystack sessions closed without paying, cards declined and not retried, etc.
A scheduled job finds these and sends the customer a one-time reminder email
with what they ordered and a link back to checkout.

## Scope

**In scope:** "abandoned checkout" — an `orders` row already exists
(`payment_status = 'pending'`), created via a real Paystack attempt
(`paystack_reference is not null`), that never became `paid`.

**Out of scope:** "true" abandoned cart recovery (items added to a cart,
checkout never even started). The cart today lives only in browser
`localStorage` — no server-side record of it exists before checkout is
submitted, and there's no email captured before that point either. Recovering
that would need new cart-persistence infrastructure and an earlier
email-capture point in the funnel; deliberately not part of this build.

**Also out of scope:** bank-transfer orders. These have `paystack_reference =
null` and sit `payment_status = 'pending'` until the admin manually confirms
the transfer — that's an expected wait state, not abandonment, and the
existing query naturally excludes them.

**Also out of scope:** WhatsApp reminders. The existing WhatsApp channel
(`lib/notifications/channels/whatsapp.ts`, via CallMeBot) only sends to one
fixed admin phone number — it cannot message arbitrary customers. Real
customer-facing WhatsApp would require the official WhatsApp Business API
(Meta business verification, an approved message template, per-message
billing) — a separate, materially bigger effort. v1 is email-only.

## Why No "Resume Payment" Flow Is Needed

The cart in `localStorage` is only cleared on confirmed payment success
(`ClearCartOnSuccess` on `/payment/success`) or immediately for a bank-transfer
order. If a customer opens the Paystack popup and closes it without paying,
their cart is untouched — the existing `onClose` handler in
`checkout-view.tsx` already assumes this ("the order stays pending; a fresh
Pay Now click will place a new order/reference"). So the recovery email's call
to action is simply a link to `/checkout`, not a resume-this-exact-payment
flow: if it's the same browser/device, their cart is still there and
re-submitting creates a fresh order + fresh Paystack reference through the
app's existing, already-working retry path. The email additionally lists the
order's actual items (from the already-saved `order_items`), so it's still
useful if opened on a different device where the cart isn't present.

## Data Flow

1. Customer submits checkout → `placeOrder` creates an `orders` row
   (`payment_status: 'pending'`) and a `payments` row, then opens the Paystack
   popup.
2. Customer closes the popup / payment fails / they simply leave — no further
   action happens. The order sits `pending`.
3. Vercel Cron calls `GET /api/cron/abandoned-checkouts` on a schedule.
4. The handler queries `orders` for: `payment_status = 'pending'`,
   `paystack_reference is not null`, `abandoned_email_sent_at is null`,
   `created_at` between 7 days ago and 1 hour ago.
5. For each match, it loads `order_items`, sends a reminder email to
   `customer_email`, and — only on send success — sets
   `abandoned_email_sent_at = now()` so the same order is never emailed twice.
6. If the customer later completes payment, `payment_status` becomes `paid`
   and the order no longer matches the query — no special-casing needed.

## Components

- **Migration** `supabase/migrations/0010_abandoned_checkout_reminder.sql` —
  adds `orders.abandoned_email_sent_at timestamptz`, nullable, no default.
- **`lib/notifications/channels/email.ts`** — factor the existing
  `sendAdminEmail` body into a shared `send({ to, subject, text })` helper
  (reusing the same lazily-cached Yahoo SMTP transporter), keep
  `sendAdminEmail({ subject, text })` as a thin wrapper defaulting `to` to
  `ADMIN_NOTIFICATION_EMAIL`, and add `sendCustomerEmail({ to, subject, text
  })` alongside it.
- **`lib/notifications/abandoned-checkout.ts`** (new) — builds the reminder
  email subject/body from an order + its items, following the same
  plain-text formatting `lib/notifications/orders.ts` already uses for the
  admin paid-order email. Exports `sendAbandonedCheckoutEmail(order)`.
- **`app/api/cron/abandoned-checkouts/route.ts`** (new) — `GET` handler:
  - Checks `Authorization: Bearer ${process.env.CRON_SECRET}`; `401` if it
    doesn't match (Vercel Cron sends this header automatically when
    `CRON_SECRET` is set as a project env var).
  - Uses `createAdminClient()` (service role, matches the existing
    webhook/checkout pattern — this must run outside RLS since it's not
    scoped to any signed-in user).
  - Queries and processes matches sequentially; wraps each send in
    try/catch so one failure doesn't abort the batch.
  - Returns `{ sent: number, failed: number }` as JSON.
- **`vercel.json`** (new) — registers the cron:
  ```json
  {
    "crons": [{ "path": "/api/cron/abandoned-checkouts", "schedule": "0 * * * *" }]
  }
  ```
  Hourly. Note: Vercel's free Hobby tier limits cron jobs to once per day —
  if the project is on Hobby, change the schedule to a daily cron (e.g. `"0
  9 * * *"`) instead. The 1-hour-to-7-day matching window already tolerates
  either cadence without missing or double-sending.
- **`.env.example`** — document `CRON_SECRET` under a new "Abandoned
  checkout reminder" section.

## Email Content

Plain text, matching the existing admin-notification style (no HTML
templating in this codebase yet):

- Subject: `You left something at OnPoint — order #<order_number>`
- Body: greeting, list of items (name, size/color, quantity — same
  `formatItemLine`-style formatting as the admin email), order total, a
  plain-text link to `${NEXT_PUBLIC_SITE_URL}/checkout`, and the existing
  contact details (email/WhatsApp from `lib/contact.ts`) for anyone who hit a
  payment problem rather than changing their mind.

## Error Handling

- Missing/incorrect `CRON_SECRET` header → `401`, nothing queried.
- Per-order send failure (SMTP error, etc.) → caught, logged, order is left
  with `abandoned_email_sent_at` still `null` so it's retried on the next
  cron run; does not stop processing the rest of the batch.
- No `YAHOO_SMTP_USER`/`YAHOO_SMTP_APP_PASSWORD` configured → same
  best-effort log-and-return behavior the existing `sendAdminEmail` already
  has; the route still responds `200` with `{ sent: 0, failed: N }`.

## Out of Scope (Explicit)

- True pre-checkout abandoned-cart recovery (see Scope above).
- WhatsApp reminders (see Scope above).
- A reminder sequence (e.g. 1-hour then 24-hour follow-up) — v1 sends exactly
  one reminder per order.
- Any change to the bank-transfer flow.
- HTML email templates — plain text, matching the rest of the notification
  system.

## Verification Plan

No test framework exists in this repo (consistent with prior work) —
verification is manual + type/lint checks:

1. `tsc --noEmit` and `eslint` on all new/changed files.
2. Apply the migration locally; hand-insert a `pending` order with a
   `paystack_reference` and a `created_at` a few hours in the past (via SQL),
   with `order_items` attached.
3. Call the route handler locally with the correct `Authorization` header
   and confirm: the email sends (check the configured Yahoo inbox, or
   temporarily point `customer_email` at a test address), the order's
   `abandoned_email_sent_at` gets set, and a second call does not re-send.
4. Call it with a missing/wrong header and confirm `401`.
5. Confirm an order with `paystack_reference = null` (bank transfer) is never
   matched.
