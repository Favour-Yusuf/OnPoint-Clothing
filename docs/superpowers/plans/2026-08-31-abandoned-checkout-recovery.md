# Abandoned Checkout Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send a one-time reminder email to customers whose checkout created an order (Paystack attempt) that never completed payment, on a Vercel Cron schedule.

**Architecture:** A nullable `abandoned_email_sent_at` column on `orders` tracks whether a reminder has gone out. A new protected Route Handler, called by Vercel Cron, queries orders matching `payment_status = 'pending'`, `paystack_reference is not null`, `abandoned_email_sent_at is null`, and a 1-hour-to-7-day age window; for each match it sends a plain-text email (reusing the existing Yahoo SMTP transporter, generalized to send to a customer instead of only the fixed admin address) and marks the column only on send success.

**Tech Stack:** Next.js 16 App Router (Route Handlers), Supabase (Postgres + service-role client), nodemailer/Yahoo SMTP (already configured), TypeScript, no test framework in this repo (verification is `tsc`/`eslint` + manual checks, matching the rest of the codebase).

**Spec:** `docs/superpowers/specs/2026-08-31-abandoned-checkout-recovery-design.md`

## Global Constraints

- Scope is **abandoned checkout only** (order row exists, `payment_status = 'pending'`, real Paystack attempt) — not pre-checkout cart abandonment, and not bank-transfer orders (`paystack_reference is null`).
- **Email only** for v1 — no WhatsApp (the existing WhatsApp channel can only message one fixed admin number).
- **One reminder per order, ever** — enforced by `abandoned_email_sent_at`, set only after a successful send.
- Matching window: `created_at` between 1 hour ago and 7 days ago.
- No HTML email templates — plain text, matching `lib/notifications/orders.ts`'s existing style.
- No new npm dependencies — nodemailer, Supabase JS client, and Next.js Route Handlers are all already in the project.
- The recovery email's call to action is a link to `/checkout`, not a resume-specific-payment flow (see spec's "Why No Resume Payment Flow Is Needed").

---

### Task 1: Migration — `abandoned_email_sent_at` column

**Files:**
- Create: `supabase/migrations/0010_abandoned_checkout_reminder.sql`

**Interfaces:**
- Produces: `orders.abandoned_email_sent_at` (nullable `timestamptz`, no default), consumed by Task 4's query and update.

- [ ] **Step 1: Write the migration**

```sql
-- Tracks whether the one-time abandoned-checkout reminder email has been
-- sent for this order. Nullable/no default: null means "not sent yet"; the
-- cron route (app/api/cron/abandoned-checkouts) sets it only after a
-- successful send, so an order is never emailed twice no matter how often
-- the cron fires.
alter table orders add column abandoned_email_sent_at timestamptz;
```

- [ ] **Step 2: Check it against the existing migration style**

Open `supabase/migrations/0009_backdrop_color.sql` and confirm the new file matches: a comment explaining the column's purpose and nullability rationale, then a single `alter table` statement. No other differences expected.

- [ ] **Step 3: Apply the migration — ask before running against the live project**

This repo's Supabase project is a real, live database (per `docs/COMMERCE_SETUP.md`, applied manually via the Supabase SQL Editor or `supabase db push`). Before applying this migration, confirm with the user that it's OK to run `alter table orders add column abandoned_email_sent_at timestamptz;` against their project (it's additive, nullable, and has no default, so it can't break existing rows or queries — but it's still a live production database and the user should get to say yes first). Apply it via whichever method they prefer (Supabase SQL Editor, or `psql` using the connection details already in `.env.local` if they'd rather you run it directly).

- [ ] **Step 4: Verify the column exists**

In the Supabase SQL Editor (or via `psql`), run:

```sql
select column_name, data_type, is_nullable
from information_schema.columns
where table_name = 'orders' and column_name = 'abandoned_email_sent_at';
```

Expected: one row, `data_type = 'timestamp with time zone'`, `is_nullable = 'YES'`.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0010_abandoned_checkout_reminder.sql
git commit -m "Add abandoned_email_sent_at column to orders"
```

---

### Task 2: Generalize the email channel for customer-facing sends

**Files:**
- Modify: `lib/notifications/channels/email.ts`

**Interfaces:**
- Consumes: nothing new (same `nodemailer`, same `YAHOO_SMTP_USER`/`YAHOO_SMTP_APP_PASSWORD` env vars already in use).
- Produces: `sendCustomerEmail({ to, subject, text }: { to: string; subject: string; text: string }): Promise<boolean>` — new export, returns `true` on a successful send and `false` on any failure (misconfiguration or SMTP error), so callers can decide whether to retry. `sendAdminEmail`'s existing signature and void return are unchanged — no other file that calls it needs to change.

- [ ] **Step 1: Read the current file**

Confirm the starting point matches what's already in the repo:

```typescript
import "server-only";
import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.YAHOO_SMTP_USER;
  const pass = process.env.YAHOO_SMTP_APP_PASSWORD;
  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  return transporter;
}

export async function sendAdminEmail({ subject, text }: { subject: string; text: string }): Promise<void> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  const transport = getTransporter();
  if (!to || !transport) {
    console.error(
      "sendAdminEmail: not configured — set YAHOO_SMTP_USER, YAHOO_SMTP_APP_PASSWORD, ADMIN_NOTIFICATION_EMAIL"
    );
    return;
  }

  try {
    await transport.sendMail({ from: `"OnPoint Clothing" <${process.env.YAHOO_SMTP_USER}>`, to, subject, text });
  } catch (error) {
    console.error(`sendAdminEmail: send failed ("${subject}"):`, error);
  }
}
```

- [ ] **Step 2: Replace the file with the generalized version**

```typescript
import "server-only";
import nodemailer from "nodemailer";

// Lazily created and cached across invocations (a fresh SMTP connection per
// event would be wasteful) — Yahoo SMTP via an account app password, not a
// transactional email provider. See .env.example for the vars this needs.
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.YAHOO_SMTP_USER;
  const pass = process.env.YAHOO_SMTP_APP_PASSWORD;
  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  return transporter;
}

/** Shared send path. Returns whether the send actually succeeded, so callers that need to know (unlike the fire-and-forget admin notifications) can act on failure. */
async function send({ to, subject, text }: { to: string; subject: string; text: string }): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.error("email: not configured — set YAHOO_SMTP_USER, YAHOO_SMTP_APP_PASSWORD");
    return false;
  }

  try {
    await transport.sendMail({ from: `"OnPoint Clothing" <${process.env.YAHOO_SMTP_USER}>`, to, subject, text });
    return true;
  } catch (error) {
    console.error(`email: send failed ("${subject}"):`, error);
    return false;
  }
}

/** Best-effort — logs and returns on any failure rather than throwing. */
export async function sendAdminEmail({ subject, text }: { subject: string; text: string }): Promise<void> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!to) {
    console.error("sendAdminEmail: not configured — set ADMIN_NOTIFICATION_EMAIL");
    return;
  }
  await send({ to, subject, text });
}

/** Sends to an arbitrary customer address. Returns success so callers (e.g. the abandoned-checkout cron) can decide whether to retry. */
export async function sendCustomerEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  return send({ to, subject, text });
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `npx eslint lib/notifications/channels/email.ts`
Expected: no errors.

- [ ] **Step 5: Confirm existing callers still compile unchanged**

Run: `npx eslint lib/notifications/orders.ts lib/notifications/bespoke.ts`
Expected: no errors (these files call `sendAdminEmail` with the same `{ subject, text }` shape as before — nothing there should need to change).

- [ ] **Step 6: Commit**

```bash
git add lib/notifications/channels/email.ts
git commit -m "Generalize email channel with a customer-facing send path"
```

---

### Task 3: Abandoned-checkout notification builder

**Files:**
- Modify: `lib/notifications/types.ts`
- Create: `lib/notifications/abandoned-checkout.ts`

**Interfaces:**
- Consumes: `sendCustomerEmail` from `@/lib/notifications/channels/email` (Task 2); `formatPrice` from `@/lib/format`; `CONTACT` from `@/lib/contact`.
- Produces: `AbandonedCheckoutNotification` type (exported from `lib/notifications/types.ts`); `sendAbandonedCheckoutEmail(order: AbandonedCheckoutNotification): Promise<boolean>` (exported from `lib/notifications/abandoned-checkout.ts`), consumed by Task 4's route handler.

- [ ] **Step 1: Add the notification type**

Append to `lib/notifications/types.ts`:

```typescript
export type AbandonedCheckoutNotification = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number; // minor units (kobo), same convention as the orders table
  items: {
    productName: string;
    size: string | null;
    color: string | null;
    quantity: number;
    totalPrice: number; // minor units
  }[];
  checkoutUrl: string;
};
```

- [ ] **Step 2: Write the notification builder**

Create `lib/notifications/abandoned-checkout.ts`:

```typescript
import "server-only";
import { sendCustomerEmail } from "@/lib/notifications/channels/email";
import { formatPrice } from "@/lib/format";
import { CONTACT } from "@/lib/contact";
import type { AbandonedCheckoutNotification } from "@/lib/notifications/types";

function formatItemLine(item: AbandonedCheckoutNotification["items"][number]): string {
  const attrs = [item.size, item.color].filter(Boolean).join(", ");
  return `  • ${item.productName}${attrs ? ` (${attrs})` : ""} × ${item.quantity} — ${formatPrice(item.totalPrice / 100)}`;
}

function buildEmail(order: AbandonedCheckoutNotification) {
  const text = `Hi ${order.customerName},

You started an order with us but the payment didn't go through — your order is still saved and nothing has been charged.

Order #${order.orderNumber}
${order.items.map(formatItemLine).join("\n")}

Total: ${formatPrice(order.total / 100)}

Pick up where you left off: ${order.checkoutUrl}

Had a problem paying, or have a question about your order? Reach us at ${CONTACT.email.display} or on WhatsApp at ${CONTACT.whatsapp.display} — we're happy to help.

— OnPoint Clothing
`;
  return { subject: `You left something at OnPoint — order #${order.orderNumber}`, text };
}

/** Best-effort — returns whether the send succeeded so the caller (the abandoned-checkout cron) can decide whether to retry on the next run. */
export async function sendAbandonedCheckoutEmail(order: AbandonedCheckoutNotification): Promise<boolean> {
  const { subject, text } = buildEmail(order);
  return sendCustomerEmail({ to: order.customerEmail, subject, text });
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `npx eslint lib/notifications/types.ts lib/notifications/abandoned-checkout.ts`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add lib/notifications/types.ts lib/notifications/abandoned-checkout.ts
git commit -m "Add abandoned-checkout email notification builder"
```

---

### Task 4: Cron Route Handler

**Files:**
- Create: `app/api/cron/abandoned-checkouts/route.ts`

**Interfaces:**
- Consumes: `createAdminClient` from `@/lib/supabase/admin`; `sendAbandonedCheckoutEmail` from `@/lib/notifications/abandoned-checkout` (Task 3); reads `process.env.CRON_SECRET` and `process.env.NEXT_PUBLIC_SITE_URL`.
- Produces: `GET /api/cron/abandoned-checkouts`, returning JSON `{ sent: number, failed: number }` (200) or `{ error: string }` (401 on bad auth, 500 on query failure) — this is the endpoint Task 5's `vercel.json` schedules.

- [ ] **Step 1: Write the route handler**

Create `app/api/cron/abandoned-checkouts/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAbandonedCheckoutEmail } from "@/lib/notifications/abandoned-checkout";

const ONE_HOUR_MS = 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Called by Vercel Cron (see vercel.json) on a schedule. Finds orders whose
// checkout was submitted (payment_status still 'pending', a real Paystack
// attempt exists) but never completed, and sends each a one-time reminder
// email. Protected by CRON_SECRET so it can't be triggered by anyone else —
// Vercel sends this automatically as an Authorization header when the
// project env var is set.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = Date.now();
  const oneHourAgo = new Date(now - ONE_HOUR_MS).toISOString();
  const sevenDaysAgo = new Date(now - SEVEN_DAYS_MS).toISOString();

  const { data: orders, error } = await admin
    .from("orders")
    .select("id, order_number, customer_name, customer_email, total")
    .eq("payment_status", "pending")
    .not("paystack_reference", "is", null)
    .is("abandoned_email_sent_at", null)
    .gte("created_at", sevenDaysAgo)
    .lte("created_at", oneHourAgo);

  if (error) {
    console.error("abandoned-checkouts cron: query failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  let sent = 0;
  let failed = 0;

  for (const order of orders ?? []) {
    try {
      const { data: items, error: itemsError } = await admin
        .from("order_items")
        .select("product_name, size, color, quantity, total_price")
        .eq("order_id", order.id);
      if (itemsError) throw new Error(itemsError.message);

      const ok = await sendAbandonedCheckoutEmail({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        total: order.total,
        items: (items ?? []).map((item) => ({
          productName: item.product_name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          totalPrice: item.total_price,
        })),
        checkoutUrl: `${siteUrl}/checkout`,
      });
      if (!ok) throw new Error("email send returned false");

      await admin.from("orders").update({ abandoned_email_sent_at: new Date().toISOString() }).eq("id", order.id);
      sent++;
    } catch (err) {
      console.error(`abandoned-checkouts cron: failed for order ${order.id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npx eslint "app/api/cron/abandoned-checkouts/route.ts"`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/api/cron/abandoned-checkouts/route.ts"
git commit -m "Add abandoned-checkout cron route handler"
```

---

### Task 5: Register the Vercel Cron and document the env var

**Files:**
- Create: `vercel.json`
- Modify: `.env.example`

**Interfaces:**
- Consumes: nothing (config only).
- Produces: the `/api/cron/abandoned-checkouts` schedule Vercel reads on deploy; the `CRON_SECRET` env var documented for setup.

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "crons": [
    { "path": "/api/cron/abandoned-checkouts", "schedule": "0 * * * *" }
  ]
}
```

Note for whoever deploys this: Vercel's free Hobby tier limits cron jobs to once per day. If the project is on Hobby, change `"schedule"` to a daily cron instead, e.g. `"0 9 * * *"` (09:00 UTC daily) — the 1-hour-to-7-day matching window in Task 4 tolerates either cadence without missing or double-sending orders.

- [ ] **Step 2: Document `CRON_SECRET` in `.env.example`**

Add this section to `.env.example` (after the existing "Admin notifications" block):

```env

# Abandoned checkout reminder cron (app/api/cron/abandoned-checkouts).
# Any random secret string of your choosing — set the same value here and
# as a Vercel project env var. Vercel Cron sends it automatically as
# "Authorization: Bearer <value>" when it calls the route.
CRON_SECRET=
```

- [ ] **Step 3: Add the same var to your local `.env.local`**

Generate a random value (e.g. `openssl rand -hex 32` or any password generator) and add `CRON_SECRET=<value>` to `.env.local` so Task 6's local verification can send the matching header.

- [ ] **Step 4: Commit**

```bash
git add vercel.json .env.example
git commit -m "Register abandoned-checkout Vercel Cron and document CRON_SECRET"
```

(`.env.local` is gitignored — nothing to commit there.)

---

### Task 6: End-to-end verification

**Files:** none (verification only — no code changes).

**Interfaces:** none.

This task touches the live Supabase project (inserting and deleting a test order) and sends a real email. **Confirm with the user before running it**, and use an email address they're comfortable receiving a test message at (their own, or the `customer_email` on the test row you insert) — don't reuse a real customer's address.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background it, e.g. via the same pattern used earlier in this project's session history — start it, poll `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` until it returns `200`).

- [ ] **Step 2: Insert a test order via the Supabase SQL Editor (or `psql`)**

```sql
insert into orders (
  order_number, customer_name, customer_email, status, payment_status,
  subtotal, total, currency, shipping_address, paystack_reference, created_at
) values (
  'TEST-ABANDONED-001', 'Test Customer', 'YOUR_TEST_EMAIL_HERE', 'pending', 'pending',
  500000, 500000, 'NGN',
  '{"fullName":"Test Customer","address1":"1 Test St","city":"Lagos","state":"Lagos","postalCode":"100001","country":"Nigeria"}'::jsonb,
  'onpt_test_abandoned_001',
  now() - interval '2 hours'
)
returning id;
```

Replace `YOUR_TEST_EMAIL_HERE` with the address confirmed in the task intro. Note the returned `id` — used in Step 6.

- [ ] **Step 3: Insert a matching order item**

```sql
insert into order_items (order_id, product_name, size, color, quantity, unit_price, total_price)
values ('PASTE_ORDER_ID_HERE', 'Test Product', 'M', 'Black', 1, 500000, 500000);
```

- [ ] **Step 4: Call the route handler without auth — confirm it's rejected**

Run: `curl -i http://localhost:3000/api/cron/abandoned-checkouts`
Expected: `HTTP/1.1 401` and `{"error":"Unauthorized"}`.

- [ ] **Step 5: Call it with the correct auth header**

Run (replace `YOUR_CRON_SECRET` with the value from `.env.local`):

```bash
curl -i -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/abandoned-checkouts
```

Expected: `HTTP/1.1 200` and a body like `{"sent":1,"failed":0}` (the count reflects the one test order plus anything else genuinely matching in the project — 1 is expected if the test order is the only match).

- [ ] **Step 6: Confirm the email arrived**

Check the test inbox for a message with subject `You left something at OnPoint — order #TEST-ABANDONED-001`, listing the test item and a link to `/checkout`.

- [ ] **Step 7: Confirm `abandoned_email_sent_at` was set**

```sql
select abandoned_email_sent_at from orders where order_number = 'TEST-ABANDONED-001';
```

Expected: a non-null timestamp.

- [ ] **Step 8: Confirm it does not send twice**

Run Step 5's `curl` command again.
Expected: `{"sent":0,"failed":0}` — the test order no longer matches since `abandoned_email_sent_at` is now set.

- [ ] **Step 9: Confirm a bank-transfer order is never matched**

Insert a second test order, identical except `payment_status` stays `'pending'` and `paystack_reference` is `null` (mirroring a real bank-transfer order per `lib/actions/checkout.ts`):

```sql
insert into orders (
  order_number, customer_name, customer_email, status, payment_status,
  subtotal, total, currency, shipping_address, paystack_reference, created_at
) values (
  'TEST-BANKTRANSFER-001', 'Test Customer', 'YOUR_TEST_EMAIL_HERE', 'pending', 'pending',
  500000, 500000, 'NGN',
  '{"fullName":"Test Customer","address1":"1 Test St","city":"Lagos","state":"Lagos","postalCode":"100001","country":"Nigeria"}'::jsonb,
  null,
  now() - interval '2 hours'
);
```

Run Step 5's `curl` command again. Expected: `{"sent":0,"failed":0}` — the bank-transfer order (`paystack_reference is null`) is excluded by the query's `.not("paystack_reference", "is", null)` filter.

Clean up:

```sql
delete from orders where order_number = 'TEST-BANKTRANSFER-001';
```

- [ ] **Step 10: Clean up the first test order's data**

```sql
delete from order_items where order_id = 'PASTE_ORDER_ID_HERE';
delete from orders where order_number = 'TEST-ABANDONED-001';
```

- [ ] **Step 11: Stop the dev server**

Find and stop the process listening on port 3000 (matching the cleanup pattern used elsewhere in this project's session history).

No commit for this task — it's verification only, and the test data has already been deleted in Steps 9 and 10.
