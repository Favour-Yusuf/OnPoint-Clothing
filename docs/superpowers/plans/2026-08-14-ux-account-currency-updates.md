# UX / Account Flow / Currency / Admin Routing Updates

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. No test runner — verify via `tsc --noEmit`, `npm run build`, and manual checks.

**Goal:** Fix the post-signup dead-end with a real email-verification flow, switch the storefront's default/only currency from USD to NGN end-to-end (display + Paystack + DB), and make admin sign-in/navigation route intelligently without breaking guest checkout.

## Global constraints

- Don't touch unrelated storefront design/layout.
- Guest checkout must keep working with zero forced account creation.
- Money stays integer minor units everywhere (kobo, same 100:1 ratio as cents — the existing `×100`/`÷100` conversion code is currency-agnostic and needs no changes, only currency *labels* and *values* do).
- Admin authorization stays server-side only (existing `customers.is_admin` + layout guard) — no client-side gating.

## Key external dependency — must tell the user

Supabase's default "Confirm signup" email template links to Supabase's own hosted `/verify` endpoint, which — after verifying — redirects with session tokens in a URL fragment (implicit-flow style). To get a proper in-app "Email verified" success screen with the modern `@supabase/ssr` PKCE-friendly pattern, the email template must instead link to **this app's** `/auth/confirm` route with `token_hash`/`type` params. That's a Supabase Dashboard change (Authentication → Email Templates → Confirm signup) I cannot make via code — must ask the user to update it, and to add `/auth/confirm` to the Redirect URLs allowlist (Authentication → URL Configuration).

## Design decisions

1. **Detecting "needs verification" after signup**: `supabase.auth.signUp()` returns `data.session === null` when email confirmation is required (the common case) vs. a populated session when auto-confirm is on. Branch on that instead of assuming either way.
2. **Change email pre-verification**: no active session exists for an unconfirmed signup, so the regular client can't call `updateUser({email})`. Doing this via the service-role admin client is possible but unverifiable end-to-end here (real email delivery) and adds an unaudited privileged code path for uncertain benefit. Per the spec's own escape hatch, this ships as a safe "start over with a different email" link back to sign-up instead of true in-place change — documented in the final report with what real support would need.
3. **Redirect preservation**: a `next` query param carries the originally-requested path through `/account` → sign-in. Admins always land on `/admin` regardless of `next` (explicit spec requirement); non-admins honor `next` when present and same-origin-relative, else default `/account`.
4. **Currency rescale, not just relabel**: mock catalog prices are USD-scale numbers ($95–$890). Relabeling them NGN as-is would make a wool overcoat cost ₦890. Multiplying every mock `price`/`compareAtPrice` by 100 lands the range at ₦9,500–₦89,000, consistent with the spec's own examples (₦85,000/₦120,000/₦250,000) and avoids hand-authoring 16 arbitrary new numbers. Re-seeding overwrites the live DB via the existing idempotent `upsert`-based seed script. Flagged in the final report as placeholder pricing for the developer to replace with real figures whenever ready.
5. **Header account menu**: `Header` is a Client Component with no server data today. Rather than restructure it, `(storefront)/layout.tsx` (already a Server Component) fetches `{ isSignedIn, isAdmin }` once and passes it down as props — small, additive, no unrelated redesign.

## File map

```
supabase/migrations/0007_currency_ngn.sql   — NEW: default currency NGN, backfill existing rows

lib/format.ts                                — MODIFY: NGN/₦ formatting
lib/types.ts                                  — MODIFY: Product.currency "USD" -> "NGN"
lib/data/products.ts                          — MODIFY: currency field + ×100 price rescale
scripts/seed.ts                               — MODIFY: pass currency from mock data explicitly
lib/actions/checkout.ts                       — MODIFY: ORDER_CURRENCY "NGN", shipping fee rescale
components/checkout/checkout-view.tsx         — MODIFY: DELIVERY_OPTIONS price rescale (major units)

lib/actions/auth.ts                           — MODIFY: signUp verification branch + emailRedirectTo,
                                                  signIn admin-redirect + next-param honoring, add
                                                  resendVerificationEmail
app/(storefront)/auth/confirm/route.ts        — NEW: verifyOtp handler
app/(storefront)/account/verify-email/page.tsx — NEW: "check your email" state
components/account/verify-email-view.tsx      — NEW: resend button w/ client cooldown
components/account/auth-form.tsx              — MODIFY: thread `next` hidden field
app/(storefront)/account/page.tsx             — MODIFY: pass `next` through to AuthForm; append
                                                  `?next=` when redirecting unauth users elsewhere

app/(storefront)/layout.tsx                   — MODIFY: fetch isSignedIn/isAdmin, pass to Header
components/layout/header.tsx                  — MODIFY: account menu (My Account/Orders/Admin
                                                  Dashboard if admin/Sign Out) instead of a bare icon
                                                  link, for signed-in users only

app/admin/layout.tsx                          — MODIFY: unauthenticated -> /account?next=/admin
components/admin/admin-header.tsx             — MODIFY: add "View Store" link to "/"
```

## Task order

1. Currency: migration 0007, format.ts, types.ts, mock data rescale, seed script, checkout action + view — re-seed the live DB.
2. Email verification: signUp branch + emailRedirectTo, verify-email page + resend action + cooldown, /auth/confirm route.
3. Admin routing: signIn admin branch, next-param plumbing through account page/admin guard, admin header "View Store", storefront header account menu.
4. Verify: tsc, build, manual pass (signup → verify-email page renders; admin sign-in → /admin; customer sign-in → /account; guest checkout still completes in NGN).

## Self-review

Spec coverage: §1–2 (verification UX + states) → task 2; §3 (guest checkout preserved) → no changes to checkout's guest path, only currency; §4–8 (NGN everywhere incl. Paystack + DB) → task 1; §9–15 (admin routing/authorization) → task 3, reusing the already-server-side `is_admin` guard (§14 already satisfied by existing architecture, not rebuilt); §17–18 (premium feel, accessibility) → verify-email page reuses existing Field/Button patterns, visible focus states inherited from those components.
