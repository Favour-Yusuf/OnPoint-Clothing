# Admin Operations Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. No test runner exists in this project — "verify" means `npx tsc --noEmit`, `npm run build`, and manual checks against the live seeded Supabase project.

**Goal:** A premium, read-mostly operations dashboard for order/customer/bespoke/payment management, built on the existing Supabase schema, auth, and admin guard from the prior integration work. No product/catalog CRUD.

**Architecture:** Server Components fetch paginated/filtered data straight from Supabase (RLS + explicit `is_admin` checks); mutations (order/bespoke status) are Server Actions. One new SQL view for customer aggregation; everything else reuses existing tables.

## Global constraints

- No product/category/collection/inventory management UI — display-only where products appear (order items).
- Reuse `app/admin/layout.tsx`'s existing admin guard pattern (session + `customers.is_admin`), extend it with the new shell instead of replacing the security check.
- Storefront (`app/(non-admin)`, components outside `components/admin/`) must not change.
- Design: black/neutral background, burgundy as a restrained accent (reuse existing `--color-burgundy*` tokens from `app/globals.css` — do not add new global tokens), Cormorant Garamond serif for headings, Geist sans for UI text — matches the existing storefront system already in `app/globals.css`.
- All metrics/lists come from real Supabase queries — no hardcoded numbers.
- Pagination on every list (orders/customers/bespoke/payments) — never fetch unbounded rows.

## Design decisions

1. **Customer aggregation** needs GROUP BY-style rollups (order count, total spent, last order) that PostgREST/supabase-js can't express directly. Adding a read-only SQL view (`admin_customer_summary`) is the one schema addition — a window-function query keyed by `coalesce(user_id, lower(email))` so guest customers who reuse an email are grouped, registered customers grouped by `user_id`. Queried only via the admin client from already-guard-checked admin pages (views don't inherit table RLS automatically), so this must never be exposed to non-admin code paths.
2. **Bespoke requests currently aren't persisted at all** — `lib/actions/bespoke.ts`'s `submitBespokeRequest` validates and returns success without an insert. Fixing this is in scope (otherwise `/admin/bespoke` has nothing to ever show, defeating the point).
3. **Bespoke status values** in migration `0001` (`new`, `in_review`, `contacted`, `closed`) don't match the spec's required flow (`new`, `contacted`, `consultation`, `in_progress`, `completed`, `cancelled`). Needs a migration to change the check constraint.
4. **Order item product images**: `order_items` snapshots name/price/size/color but not an image (correctly — that's the financially/legally relevant snapshot data). For the admin thumbnail, best-effort join to `product_images` via the nullable `product_id` — if the product was later removed, the thumbnail just falls back to a placeholder; this is acceptable since it's a display convenience, not the source of truth.
5. **Customer detail route param**: registered customers are keyed by `user_id` (uuid); guests have no id, so guest detail pages are keyed by `guest:<url-encoded-email>`.
6. **Mobile tables**: each list component renders two variants controlled by CSS breakpoints (`hidden sm:table` desktop table / `sm:hidden` stacked cards on mobile) from the same data — not a squeezed desktop table.
7. Date range: Today/7d/30d/90d/12mo as plain link-based tabs via URL search params (`?range=7d`) — no custom range picker (spec marks it optional; keeping it out satisfies YAGNI).

## File map

```
supabase/migrations/0006_admin_dashboard.sql   — bespoke status constraint fix, admin_customer_summary view, payments/bespoke indexes

lib/actions/bespoke.ts                          — MODIFY: actually insert into bespoke_requests
lib/bespoke.ts                                  — NEW: admin read layer (list w/ filters+pagination, byId)
lib/actions/bespoke-admin.ts                    — NEW: updateBespokeStatus server action
lib/customers.ts                                — NEW: admin customer list (view-backed) + detail + order history
lib/payments.ts                                 — NEW: admin payments list w/ filters+pagination
lib/dashboard.ts                                 — NEW: metrics, attention counts, chart series for a date range
lib/orders.ts                                    — MODIFY: paginated/filterable getOrdersForAdmin, product-image join for detail

components/admin/admin-sidebar.tsx               — NEW
components/admin/admin-header.tsx                — NEW (mobile menu trigger)
components/admin/admin-shell.tsx                 — NEW (client: mobile drawer state)
components/admin/status-badge.tsx                — NEW (OrderStatusBadge, PaymentStatusBadge, BespokeStatusBadge)
components/admin/metric-card.tsx                 — NEW
components/admin/date-range-tabs.tsx             — NEW
components/admin/revenue-chart.tsx               — NEW (restrained bar chart, see dataviz skill)
components/admin/attention-panel.tsx             — NEW
components/admin/orders-table.tsx                — NEW (used by dashboard "recent" + /admin/orders, responsive dual-render)
components/admin/customers-table.tsx             — NEW
components/admin/bespoke-table.tsx               — NEW
components/admin/payments-table.tsx              — NEW
components/admin/confirm-dialog.tsx              — NEW (client, native <dialog>)
components/admin/search-input.tsx                — NEW (client, debounced, updates URL)
components/admin/pagination.tsx                  — NEW (link-based)

app/admin/layout.tsx                             — MODIFY: swap old top-bar for AdminShell/Sidebar/Header
app/admin/page.tsx                               — NEW: dashboard
app/admin/orders/page.tsx                        — MODIFY: search/filter/pagination
app/admin/orders/[id]/page.tsx                   — MODIFY: customer type, payment info, images, cancel confirm dialog
app/admin/customers/page.tsx                     — NEW
app/admin/customers/[id]/page.tsx                — NEW
app/admin/bespoke/page.tsx                       — NEW
app/admin/bespoke/[id]/page.tsx                  — NEW
app/admin/payments/page.tsx                      — NEW
app/admin/loading.tsx, app/admin/error.tsx        — NEW
```

## Task order

1. Migration `0006` (bespoke constraint, customer view, indexes) — apply via `psql "$DIRECT_URL"` against the live project (same approach as the prior migrations).
2. Wire `submitBespokeRequest` to persist.
3. Data layer: `lib/dashboard.ts`, `lib/bespoke.ts`, `lib/customers.ts`, `lib/payments.ts`, paginate `lib/orders.ts`.
4. Shared admin components (badges, cards, tables, dialog, pagination, search).
5. Admin shell (sidebar/header/layout).
6. Dashboard page.
7. Orders list + detail rewrite.
8. Customers list + detail.
9. Bespoke list + detail.
10. Payments list.
11. Loading/error states.
12. `tsc --noEmit`, `npm run build`, manual pass against live data, responsive check.

## Self-review

Spec coverage: shell/nav (§1) → task 5; dashboard/metrics/date range/chart/attention/recent orders (§2–7) → task 6; orders list+detail+status+cancel confirm (§8–15) → tasks 7; customers (§16–18) → task 8; bespoke (§19–20) → task 9; payments (§21) → task 10; no product CRUD (§22) → enforced by omission, no such files planned; security (§24–25) → reuses existing `is_admin` guard, extended not replaced; performance/pagination (§26) → every list paginates; loading/empty/error (§27–29) → task 11; responsive (§30) → dual-render tables; components (§31) → file map above, adapted names to this project's kebab-case convention instead of PascalCase to match existing `components/*` files.
