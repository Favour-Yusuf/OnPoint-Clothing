# Commerce Setup — Supabase + Paystack

This app is a single Next.js project. Supabase is the Postgres database; Paystack handles payment. No separate backend.

## 1. Supabase project setup

1. In your Supabase project dashboard: **Project Settings → API** — copy the Project URL and the `anon` public key, and the `service_role` secret key.
2. Create `.env.local` in the repo root (copy `.env.example`) and fill in the values from step 1, plus Paystack/site values (see below).
3. Apply the migrations in `supabase/migrations/` **in filename order** — either:
   - Using the Supabase CLI: `supabase link --project-ref <your-project-ref>` then `supabase db push`, or
   - Manually: open **SQL Editor** in the Supabase dashboard and run each file in `supabase/migrations/` in order (`0001_...` through `0005_...`).

## 2. Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=          # Supabase → Project Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase → Project Settings → API → anon public key
SUPABASE_SERVICE_ROLE_KEY=         # Supabase → Project Settings → API → service_role secret — server only, never expose
PAYSTACK_SECRET_KEY=               # Paystack → Settings → API Keys & Webhooks → Secret Key — server only
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=   # Paystack → Settings → API Keys & Webhooks → Public Key
NEXT_PUBLIC_SITE_URL=              # Your deployed origin, e.g. https://www.onpointclothing.com (no trailing slash)
```

Never commit `.env.local` — it's already covered by the `.env*` rule in `.gitignore` (with `.env.example` explicitly un-ignored so the placeholder file stays tracked).

## 3. Database seeding

Once `.env.local` has real Supabase values and migrations are applied:

```bash
npm run seed
```

This inserts the existing mock catalog (16 products, 3 categories, 3 collections) into Supabase, converting dollar prices to integer cents. It's safe to re-run — every table is seeded with an upsert on its unique key.

## 4. Local development

```bash
npm install
npm run dev
```

The app reads product/category/collection data from Supabase via `lib/products.ts` — there is no mock-data fallback once this is wired up, so seeding (step 3) must happen before pages will show products.

## 5. Paystack setup

1. Create/use a Paystack account at https://dashboard.paystack.com.
2. **Settings → API Keys & Webhooks**: copy the **Secret Key** into `PAYSTACK_SECRET_KEY` and the **Public Key** into `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`. Use test keys while developing.
3. In the same page, set the **Webhook URL** to:
   ```text
   https://YOUR-DOMAIN/api/paystack/webhook
   ```
   Replace `YOUR-DOMAIN` with the value of `NEXT_PUBLIC_SITE_URL` (production domain). Paystack webhooks require a publicly reachable HTTPS URL — `localhost` will not work here (see local testing below).
4. Confirm your Paystack account's enabled currency matches `ORDER_CURRENCY` in `lib/actions/checkout.ts` (currently `"USD"`, matching the existing product data's `currency` field). If your account is only enabled for NGN, either enable USD with Paystack support or change that constant (and the product `currency` values) to `"NGN"`.

## 6. Testing the webhook locally

Paystack can't reach `localhost` directly. Options:
- Use a tunnel (e.g. `ngrok http 3000`) and temporarily set the webhook URL in the Paystack dashboard to the tunnel's HTTPS URL.
- Or trigger a real test-mode payment against your deployed environment once it's live.

To sanity-check signature verification without a real event, you can hand-craft a signed request:

```bash
BODY='{"event":"charge.success","data":{"reference":"onpt_test","amount":1000}}'
SIG=$(echo -n "$BODY" | openssl dgst -sha512 -hmac "$PAYSTACK_SECRET_KEY" | sed 's/^.* //')
curl -X POST http://localhost:3000/api/paystack/webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: $SIG" \
  -d "$BODY"
```

This will fail past signature verification (no matching `payments.reference` exists) unless you first place a real test order — but it confirms the signature check itself is wired correctly (a `401` means the signature logic is broken; a `404 Unknown reference` means it passed and moved on to the reference lookup).

## 7. Testing payments end-to-end

1. Place an order through the storefront checkout with a Paystack **test** secret key active.
2. On the Paystack payment page, use a [Paystack test card](https://paystack.com/docs/payments/test-payments/) (e.g. `4084084084084081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`).
3. Confirm: the webhook fires, `payments.status` and `orders.payment_status` become `paid`, `product_variants.stock_quantity` decrements, and `/payment/success` shows the confirmation.
4. Test a failed/declined test card too, and confirm the order is left in a sane state (not marked paid).

## 8. Production deployment checklist

- [ ] All env vars in section 2 set in the hosting provider's environment (not committed).
- [ ] Migrations applied to the production Supabase project.
- [ ] `npm run seed` run once against production (or real product data entered another way).
- [ ] Paystack webhook URL set to the production domain, using **live** keys once ready to accept real payments.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the actual production domain (used to build the Paystack callback URL).
- [ ] Confirm no `console.log` of secrets, and that `SUPABASE_SERVICE_ROLE_KEY` / `PAYSTACK_SECRET_KEY` are only referenced from server-only files (`lib/supabase/admin.ts`, `lib/paystack.ts`, Server Actions, Route Handlers — never a Client Component).
- [ ] Promote at least one account to admin: in the Supabase SQL editor, `update customers set is_admin = true where email = 'you@example.com';` — there is no self-service admin signup.

## Not implemented yet

- **Email/notifications** (order confirmation, shipping updates) — intentionally left out; needs a provider decision (e.g. Resend, Postmark) before wiring up.
- **Wishlist UI** — the `wishlist_items` table exists, but no product-page "save" affordance was added since the original UI didn't have one; the sanctioned data seam (`lib/products.ts`/a future `lib/wishlist.ts`) is ready for it.
