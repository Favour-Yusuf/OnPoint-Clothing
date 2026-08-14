# Supabase + Paystack Ecommerce Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This project has **no test runner** (no jest/vitest installed) — "verify" steps mean `npx tsc --noEmit`, `npm run build`, and manual curl/browser checks, not automated tests. Do not add a test framework as part of this work; that's a separate decision for the user.

**Goal:** Replace OnPoint Clothing's mock-data prototype with a real Supabase Postgres backend and Paystack payment flow, without changing the existing visual design.

**Architecture:** Single Next.js 16 app (App Router, no `src/`). Supabase Postgres is the only database, accessed via `@supabase/ssr` browser/server clients from Server Components, Server Actions, and new Route Handlers. Paystack is called server-side only (initialize in the checkout server action, verify in a webhook Route Handler). No separate backend.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, TypeScript 5, Tailwind v4, npm. New deps: `@supabase/supabase-js`, `@supabase/ssr`. No Paystack SDK needed — it's a plain REST API called with `fetch`.

## Global Constraints

- Package manager is **npm** (`package-lock.json` present) — use `npm install`, not pnpm/yarn.
- No `src/` directory; path alias is `@/*` → repo root (`tsconfig.json`).
- Preserve `app/globals.css` design tokens (dark background `#0a0a0a`, burgundy accents, Cormorant Garamond serif) — no visual redesign.
- Dynamic route `params` are `Promise`-based everywhere (Next 15+ convention, confirmed in this repo). New Route Handlers should use the global `RouteContext<'/path/[id]'>` typed helper where params are needed, per `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`.
- `lib/products.ts` is the sanctioned data-access seam — its exported function names/signatures (`getAllProducts`, `getProductBySlug`, `getFeaturedProducts`, `getNewArrivals`, `getRelatedProducts`, `searchProducts`, `filterProducts`, `getAvailableSizes`, `getAvailableColors`, `getAllCategories`, `getCategory`, `getAllCollections`, `getCollection`, `getCollectionProducts`) must not change so existing components (`app/product/[slug]/page.tsx`, `app/shop/**`, `app/collections/**`, home page sections) keep working unmodified.
- `lib/actions/checkout.ts`'s `placeOrder(prevState, formData)` server action is the sanctioned checkout seam — its `CheckoutState` shape can gain fields but the export name/signature stays.
- Cart stays client-side/localStorage (`lib/cart-context.tsx`, key `onpoint:cart`) — guest carts are not persisted server-side in this phase; server only re-validates cart contents at checkout time.
- `.gitignore` already ignores `.env*`; a tracked `.env.example` needs an explicit `!.env.example` negation.
- Never trust client-submitted price or stock. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `PAYSTACK_SECRET_KEY` to the browser.
- Guest checkout must work with zero account creation. `orders.user_id` is nullable.
- Money stored as integer minor units (kobo) in the DB to avoid float rounding; existing mock `Product.price` is in major units (dollars/naira-equivalent) — convert at the seam.

---

## Task 1: Dependencies, env scaffolding, Supabase clients

**Files:**
- Modify: `package.json` (add `@supabase/supabase-js`, `@supabase/ssr`)
- Create: `.env.example`
- Modify: `.gitignore` (add `!.env.example` negation if needed)
- Create: `lib/supabase/client.ts` — browser client
- Create: `lib/supabase/server.ts` — server client (Server Components/Actions, cookie-based session)
- Create: `lib/supabase/admin.ts` — service-role client, server-only, for webhook/inventory RPCs
- Modify: `next.config.ts` — add Cloudinary `images.remotePatterns`

- [ ] Run `npm install @supabase/supabase-js @supabase/ssr`
- [ ] Create `.env.example` with placeholders:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  PAYSTACK_SECRET_KEY=
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- [ ] Check `.gitignore`; if `.env.example` would be excluded by `.env*`, add `!.env.example` after that line.
- [ ] Write `lib/supabase/client.ts`:
  ```ts
  import { createBrowserClient } from "@supabase/ssr";

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  ```
- [ ] Write `lib/supabase/server.ts` (async, cookies from `next/headers`, per `@supabase/ssr` Next App Router guide):
  ```ts
  import { createServerClient } from "@supabase/ssr";
  import { cookies } from "next/headers";

  export async function createClient() {
    const cookieStore = await cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // called from a Server Component; middleware refreshes the session instead
            }
          },
        },
      }
    );
  }
  ```
- [ ] Write `lib/supabase/admin.ts` (service role, bypasses RLS — only import from server-only files: webhook route, seed script, inventory RPC callers):
  ```ts
  import { createClient as createSupabaseClient } from "@supabase/supabase-js";

  export function createAdminClient() {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  ```
- [ ] Add Cloudinary to `next.config.ts` `images.remotePatterns`: `{ protocol: "https", hostname: "res.cloudinary.com" }`.
- [ ] Verify: `npx tsc --noEmit` passes.
- [ ] Commit.

## Task 2: Auth session middleware

**Files:**
- Create: `middleware.ts` (repo root)
- Create: `lib/supabase/middleware.ts`

- [ ] Implement the standard `@supabase/ssr` middleware pattern: refresh the session cookie on every request so Server Components get a valid session without each one hitting Supabase Auth.
  ```ts
  // lib/supabase/middleware.ts
  import { createServerClient } from "@supabase/ssr";
  import { NextResponse, type NextRequest } from "next/server";

  export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    await supabase.auth.getUser();
    return response;
  }
  ```
  ```ts
  // middleware.ts
  import { type NextRequest } from "next/server";
  import { updateSession } from "@/lib/supabase/middleware";

  export async function middleware(request: NextRequest) {
    return updateSession(request);
  }

  export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
  };
  ```
- [ ] Verify: `npm run dev` boots without middleware errors; a request logs no cookie errors in the terminal.
- [ ] Commit.

## Task 3: Database schema migration

**Files:**
- Create: `supabase/migrations/0001_initial_schema.sql`

Design decisions (documented here since they resolve ambiguity in the spec):
- **Inventory** lives directly on `product_variants.stock_quantity` (not a separate `inventory` table) — one row per SKU already represents one stockable unit, a separate table would just be a 1:1 join with no independent lifecycle. Oversell safety comes from an atomic RPC (Task 5), not from table shape.
- **Money** stored as `integer` minor units (kobo/cents) in `price`, `compare_at_price`, `unit_price`, totals, etc.
- `customers` is a profile table keyed by `auth.users.id` (1:1), not a duplicate identity system.
- `orders.user_id` nullable + customer fields duplicated onto the order row directly, per guest-checkout requirement.

- [ ] Write `supabase/migrations/0001_initial_schema.sql`:
  ```sql
  create extension if not exists "pgcrypto";

  create table categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    image_url text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create table collections (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    season text,
    description text,
    image_url text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create table products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text not null default '',
    short_description text not null default '',
    details text[] not null default '{}',
    care text[] not null default '{}',
    price integer not null check (price >= 0),
    compare_at_price integer check (compare_at_price is null or compare_at_price >= 0),
    currency text not null default 'USD',
    category_id uuid references categories(id) on delete set null,
    is_active boolean not null default true,
    is_featured boolean not null default false,
    is_new boolean not null default false,
    is_bespoke_eligible boolean not null default false,
    availability text not null default 'in-stock'
      check (availability in ('in-stock', 'low-stock', 'made-to-order', 'sold-out')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create table product_collections (
    product_id uuid not null references products(id) on delete cascade,
    collection_id uuid not null references collections(id) on delete cascade,
    primary key (product_id, collection_id)
  );

  create table product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references products(id) on delete cascade,
    url text not null,
    alt text not null default '',
    position integer not null default 0,
    created_at timestamptz not null default now()
  );

  create table product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references products(id) on delete cascade,
    size text not null,
    color_name text not null,
    color_hex text not null default '#000000',
    sku text not null unique,
    stock_quantity integer not null default 0 check (stock_quantity >= 0),
    price_override integer check (price_override is null or price_override >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (product_id, size, color_name)
  );

  create table customers (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    email text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create table addresses (
    id uuid primary key default gen_random_uuid(),
    customer_id uuid not null references customers(id) on delete cascade,
    label text,
    full_name text not null,
    address1 text not null,
    address2 text,
    city text not null,
    state text not null,
    postal_code text not null,
    country text not null,
    phone text,
    is_default boolean not null default false,
    created_at timestamptz not null default now()
  );

  create table wishlist_items (
    customer_id uuid not null references customers(id) on delete cascade,
    product_id uuid not null references products(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (customer_id, product_id)
  );

  create table orders (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique,
    user_id uuid references customers(id) on delete set null,
    customer_name text not null,
    customer_email text not null,
    customer_phone text,
    status text not null default 'pending'
      check (status in ('pending', 'processing', 'ready_for_delivery', 'shipped', 'delivered', 'cancelled')),
    payment_status text not null default 'pending'
      check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
    subtotal integer not null check (subtotal >= 0),
    shipping_fee integer not null default 0 check (shipping_fee >= 0),
    discount integer not null default 0 check (discount >= 0),
    total integer not null check (total >= 0),
    currency text not null default 'USD',
    shipping_address jsonb not null,
    billing_address jsonb,
    paystack_reference text unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references orders(id) on delete cascade,
    product_id uuid references products(id) on delete set null,
    variant_id uuid references product_variants(id) on delete set null,
    product_name text not null,
    size text,
    color text,
    sku text,
    quantity integer not null check (quantity > 0),
    unit_price integer not null check (unit_price >= 0),
    total_price integer not null check (total_price >= 0),
    created_at timestamptz not null default now()
  );

  create table payments (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references orders(id) on delete cascade,
    provider text not null default 'paystack',
    reference text not null unique,
    amount integer not null check (amount >= 0),
    currency text not null default 'USD',
    status text not null default 'pending'
      check (status in ('pending', 'paid', 'failed', 'refunded')),
    paid_at timestamptz,
    metadata jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  create table bespoke_requests (
    id uuid primary key default gen_random_uuid(),
    customer_id uuid references customers(id) on delete set null,
    name text not null,
    email text not null,
    phone text,
    garment_type text not null,
    notes text,
    status text not null default 'new' check (status in ('new', 'in_review', 'contacted', 'closed')),
    created_at timestamptz not null default now()
  );
  ```
- [ ] Verify: file is valid SQL — visually re-check every `references` target exists earlier in the file (declaration order matters).
- [ ] Commit.

## Task 4: Indexes migration

**Files:**
- Create: `supabase/migrations/0002_indexes.sql`

- [ ] Write indexes for the query patterns actually used by `lib/products.ts` (slug lookups, category/collection filtering, active-only listing) and by orders/payments lookups:
  ```sql
  create index idx_products_slug on products(slug);
  create index idx_products_category on products(category_id);
  create index idx_products_active on products(is_active) where is_active = true;
  create index idx_products_featured on products(is_featured) where is_featured = true;
  create index idx_product_variants_product on product_variants(product_id);
  create index idx_product_images_product on product_images(product_id, position);
  create index idx_product_collections_collection on product_collections(collection_id);
  create index idx_orders_order_number on orders(order_number);
  create index idx_orders_user on orders(user_id);
  create index idx_orders_customer_email on orders(customer_email);
  create index idx_orders_status on orders(status);
  create index idx_orders_payment_status on orders(payment_status);
  create index idx_orders_created_at on orders(created_at desc);
  create index idx_payments_reference on payments(reference);
  create index idx_payments_order on payments(order_id);
  create index idx_order_items_order on order_items(order_id);
  create index idx_addresses_customer on addresses(customer_id);
  ```
- [ ] Commit.

## Task 5: Functions and triggers (updated_at, order numbering, atomic stock decrement)

**Files:**
- Create: `supabase/migrations/0003_functions.sql`

- [ ] Write `updated_at` trigger function and attach to every table with that column:
  ```sql
  create or replace function set_updated_at()
  returns trigger as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$ language plpgsql;

  create trigger trg_categories_updated_at before update on categories
    for each row execute function set_updated_at();
  create trigger trg_collections_updated_at before update on collections
    for each row execute function set_updated_at();
  create trigger trg_products_updated_at before update on products
    for each row execute function set_updated_at();
  create trigger trg_product_variants_updated_at before update on product_variants
    for each row execute function set_updated_at();
  create trigger trg_customers_updated_at before update on customers
    for each row execute function set_updated_at();
  create trigger trg_orders_updated_at before update on orders
    for each row execute function set_updated_at();
  create trigger trg_payments_updated_at before update on payments
    for each row execute function set_updated_at();
  ```
- [ ] Write an order number generator (`ONPT-<base36 timestamp>-<random 4 chars>`, matching the existing mock format's spirit from `lib/actions/checkout.ts`):
  ```sql
  create or replace function generate_order_number()
  returns text as $$
  begin
    return 'ONPT-' || upper(to_hex(extract(epoch from clock_timestamp())::bigint)) ||
      upper(substr(md5(random()::text), 1, 4));
  end;
  $$ language plpgsql;
  ```
- [ ] Write the atomic stock-decrement RPC — this is the oversell-prevention mechanism. It locks the variant row, checks stock, decrements, and raises if insufficient, all in one transaction so concurrent buyers can't both succeed:
  ```sql
  create or replace function decrement_variant_stock(p_variant_id uuid, p_quantity integer)
  returns void as $$
  declare
    v_stock integer;
  begin
    select stock_quantity into v_stock
    from product_variants
    where id = p_variant_id
    for update;

    if v_stock is null then
      raise exception 'variant_not_found';
    end if;

    if v_stock < p_quantity then
      raise exception 'insufficient_stock';
    end if;

    update product_variants
    set stock_quantity = stock_quantity - p_quantity
    where id = p_variant_id;
  end;
  $$ language plpgsql security definer;
  ```
- [ ] Commit.

## Task 6: Row Level Security policies

**Files:**
- Create: `supabase/migrations/0004_rls.sql`

- [ ] Enable RLS and write policies. Public catalog tables are readable by anyone; personal tables are owner-only; write access to orders/payments/inventory goes through the service-role client only (Server Actions/webhook), never the anon/browser client:
  ```sql
  alter table categories enable row level security;
  alter table collections enable row level security;
  alter table products enable row level security;
  alter table product_collections enable row level security;
  alter table product_images enable row level security;
  alter table product_variants enable row level security;
  alter table customers enable row level security;
  alter table addresses enable row level security;
  alter table wishlist_items enable row level security;
  alter table orders enable row level security;
  alter table order_items enable row level security;
  alter table payments enable row level security;
  alter table bespoke_requests enable row level security;

  -- Public catalog: readable by anyone, no writes via anon/authenticated roles.
  create policy "categories are publicly readable" on categories for select using (is_active = true);
  create policy "collections are publicly readable" on collections for select using (is_active = true);
  create policy "products are publicly readable" on products for select using (is_active = true);
  create policy "product_collections are publicly readable" on product_collections for select using (true);
  create policy "product_images are publicly readable" on product_images for select using (true);
  create policy "product_variants are publicly readable" on product_variants for select using (true);

  -- Customers: a user can only see/update their own profile row.
  create policy "customers select own row" on customers for select using (auth.uid() = id);
  create policy "customers update own row" on customers for update using (auth.uid() = id);
  create policy "customers insert own row" on customers for insert with check (auth.uid() = id);

  -- Addresses: owner only.
  create policy "addresses select own" on addresses for select using (
    customer_id = auth.uid()
  );
  create policy "addresses modify own" on addresses for all using (
    customer_id = auth.uid()
  ) with check (customer_id = auth.uid());

  -- Wishlist: owner only.
  create policy "wishlist select own" on wishlist_items for select using (customer_id = auth.uid());
  create policy "wishlist modify own" on wishlist_items for all using (
    customer_id = auth.uid()
  ) with check (customer_id = auth.uid());

  -- Orders: a signed-in customer can see their own orders (by user_id). Guest orders
  -- and all writes are only reachable via the service-role client (Server Actions/webhook),
  -- which bypasses RLS entirely, so no insert/update policy is granted to anon/authenticated.
  create policy "customers select own orders" on orders for select using (user_id = auth.uid());
  create policy "customers select own order items" on order_items for select using (
    exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );
  create policy "customers select own payments" on payments for select using (
    exists (select 1 from orders o where o.id = payments.order_id and o.user_id = auth.uid())
  );

  -- Bespoke requests: insert-only from anon/authenticated (public form), no public read.
  create policy "anyone can submit a bespoke request" on bespoke_requests for insert with check (true);
  create policy "customers select own bespoke requests" on bespoke_requests for select using (
    customer_id = auth.uid()
  );
  ```
- [ ] Verify: re-read each policy against "customers must never access another customer's orders/addresses/payments" — confirm every `select`/`all` policy on a personal table filters by `auth.uid()`.
- [ ] Commit.

## Task 7: Seed script

**Files:**
- Create: `scripts/seed.ts`
- Modify: `package.json` (add `"seed": "tsx scripts/seed.ts"` script + `tsx` devDependency)

- [ ] `npm install -D tsx`
- [ ] Write `scripts/seed.ts`: import the existing mock arrays from `lib/data/products.ts`, `lib/data/categories.ts`, `lib/data/collections.ts`, convert dollar prices to integer cents (`Math.round(price * 100)`), and insert via the admin client in dependency order (categories → collections → products → product_collections → product_images → product_variants). Use `upsert` on unique `slug`/`sku` so the script is re-runnable. Read `NEXT_PUBLIC_SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` from `.env.local` via `dotenv`— add `dotenv` as a devDependency too and call `import "dotenv/config"` at the top.
- [ ] Log a summary count (`X categories, Y collections, Z products, W variants seeded`) at the end.
- [ ] Verify: cannot run against a live DB without real credentials (none provided yet) — leave this task's actual execution to the user once they supply `.env.local`; note this in the final report.
- [ ] Commit.

## Task 8: Data access layer swap

**Files:**
- Modify: `lib/products.ts` — replace `lib/data/*` reads with Supabase queries via `lib/supabase/server.ts`, keep every exported signature identical
- Modify: `lib/types.ts` — add `priceMinor`/DB-shaped helper types as needed without breaking `Product`/`Category`/`Collection` shape consumed by components (map DB integer-cents back to the same major-unit `price: number` field components already expect)
- Delete usage of `lib/data/products.ts`, `lib/data/categories.ts`, `lib/data/collections.ts` as runtime sources (keep the files themselves — `scripts/seed.ts` still imports them as the seed source)

- [ ] Rewrite each `lib/products.ts` export to query Supabase (via the server client) and map rows back into the existing `Product`/`Category`/`Collection`/`ProductVariant` shapes — e.g. `getProductBySlug(slug)` does a `select` with nested `product_images`, `product_variants`, `product_collections(collections(*))` joins, converts `price`/`compare_at_price` from cents to major units, and returns `null` on no-row instead of throwing.
- [ ] Keep `filterProducts`/`searchProducts`/sort logic working against the Supabase-returned array (in-memory filtering is fine at this catalog size — do not prematurely push filtering into SQL).
- [ ] Verify: `npm run build` succeeds and every page under `app/shop`, `app/product/[slug]`, `app/collections` still type-checks against the unchanged `Product` shape.
- [ ] Commit.

## Task 9: Auth — sign up, sign in, sign out, account page

**Files:**
- Create: `lib/actions/auth.ts` — `signUp`, `signIn`, `signOut` server actions
- Modify: `app/account/page.tsx` — replace "Accounts Are Coming Soon" stub with real profile/order-history/address/wishlist view when signed in, sign-in/sign-up form when signed out
- Create: `app/account/orders/page.tsx` — order history list (query `orders` where `user_id = auth.uid()`)
- Create: `components/account/auth-form.tsx`, `components/account/account-view.tsx`

- [ ] Implement `lib/actions/auth.ts` using `lib/supabase/server.ts`'s `createClient()`, calling `supabase.auth.signUp`/`signInWithPassword`/`signOut`, and on successful sign-up also inserting the matching `customers` row (`id = auth user id`, `email`, `full_name`).
- [ ] Update `app/account/page.tsx` to be an async Server Component: fetch the session via the server client; if signed out render `AuthForm`; if signed in render `AccountView` with profile, addresses, wishlist, and a link to `/account/orders`.
- [ ] Keep this entirely additive — do not touch `CartProvider`/`UIProvider` wiring in `app/layout.tsx` beyond adding nothing (auth state is read per-request via Server Components, no new client provider needed).
- [ ] Verify: manually sign up a test user once Supabase credentials exist; note in final report this needs live credentials to test.
- [ ] Commit.

## Task 10: Server-side cart revalidation

**Files:**
- Create: `lib/cart/validate.ts`

- [ ] Write `validateCartItems(items: CartItem[])` that, for each line item, re-fetches the product+variant from Supabase (service or server client), and returns a structured result:
  ```ts
  export type CartValidationIssue =
    | { key: string; type: "unavailable" }
    | { key: string; type: "price_changed"; newPrice: number }
    | { key: string; type: "insufficient_stock"; available: number };

  export type CartValidationResult = {
    valid: boolean;
    issues: CartValidationIssue[];
    serverItems: Array<{ key: string; unitPrice: number; variantId: string; productId: string }>;
  };

  export async function validateCartItems(items: CartItem[]): Promise<CartValidationResult>;
  ```
  This never trusts `item.price` from the client for totals — it looks up the current `products.price`/`product_variants.price_override` and `stock_quantity` and reports mismatches instead of silently trusting them.
- [ ] Verify: `npx tsc --noEmit` passes.
- [ ] Commit.

## Task 11: Paystack client helper

**Files:**
- Create: `lib/paystack.ts`

- [ ] Write two server-only functions against the Paystack REST API (`https://api.paystack.co`), using `PAYSTACK_SECRET_KEY` from `process.env` (never imported by client components):
  ```ts
  const PAYSTACK_BASE = "https://api.paystack.co";

  export async function initializeTransaction(params: {
    email: string;
    amount: number; // minor units
    reference: string;
    currency?: string;
    callback_url: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ authorization_url: string; access_code: string; reference: string }>;

  export async function verifyTransaction(reference: string): Promise<{
    status: "success" | "failed" | "abandoned";
    amount: number;
    currency: string;
    reference: string;
    paid_at: string | null;
  }>;
  ```
  Both throw a typed `PaystackError` on non-2xx so callers can distinguish "Paystack rejected this" from a network failure.
- [ ] Commit.

## Task 12: Checkout rewrite — validate, price, create pending order, initialize Paystack

**Files:**
- Modify: `lib/actions/checkout.ts`
- Modify: `components/checkout/checkout-view.tsx` — replace the placeholder payment box with a "Continue to Paystack" submit state, and on success redirect (client-side `window.location.href = authorizationUrl`) instead of assuming the order is complete

- [ ] Rewrite `placeOrder` to: (1) parse cart items out of `formData` (client posts the current cart's `items` as JSON in a hidden field, since Server Actions can't read `CartContext` directly), (2) call `validateCartItems`, reject with a user-facing error listing exactly which items changed if invalid, (3) compute `subtotal` server-side from the re-fetched prices, (4) compute `shipping_fee` server-side from the existing Standard/Express options (still hardcoded — no business rule for real shipping rates was given), (5) insert a `pending`/`pending` order + `order_items` snapshot rows via the admin client, (6) call `initializeTransaction` with the order total and `callback_url = ${NEXT_PUBLIC_SITE_URL}/payment/callback?reference=...`, (7) insert a matching `payments` row (`status: "pending"`), (8) return `{ status: "redirect", authorizationUrl }` in `CheckoutState` instead of fabricating a fake `orderId` success.
- [ ] Update `CheckoutState` type to include `authorizationUrl?: string` and a `"redirect"` status; keep `"idle" | "error"` as-is, drop the old fake `"success"` (real success only happens after webhook confirmation, shown on `/payment/success`).
- [ ] Update `CheckoutView` to redirect on `status === "redirect"` and stop calling `cart.clear()` on submit — the cart clears only once the payment success page confirms a paid order (avoids losing the cart if the customer abandons Paystack).
- [ ] Verify: `npm run build` succeeds; manually exercise the form once Paystack test keys exist (noted as needing user input).
- [ ] Commit.

## Task 13: Paystack webhook

**Files:**
- Create: `app/api/paystack/webhook/route.ts`

- [ ] Implement `POST`: read the raw body text (needed for signature verification), compute `crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(rawBody).digest("hex")`, compare against the `x-paystack-signature` header (constant-time compare), reject with 401 on mismatch.
- [ ] Parse the JSON body; only act on `event === "charge.success"`.
- [ ] Idempotency: look up the `payments` row by `reference`; if `status` is already `"paid"`, return 200 immediately without reprocessing (handles Paystack's at-least-once delivery).
- [ ] Re-verify server-side via `verifyTransaction(reference)` (don't trust the webhook payload's amount alone) and confirm `verified.amount === payments.amount` and `verified.status === "success"` before mutating anything.
- [ ] On confirmed success, inside a single flow: update `payments.status = "paid"`, `paid_at`; update `orders.payment_status = "paid"`, `orders.status = "processing"`; for each `order_items` row call the `decrement_variant_stock` RPC (Task 5) — if any RPC raises `insufficient_stock` at this point (should be rare since Task 12 already checked), log it and flag the order for manual review rather than failing the whole webhook (the customer already paid).
- [ ] Return 200 on success; return 4xx/5xx with no sensitive detail in the body on failure (log details server-side only).
- [ ] Verify: cannot fire a real Paystack webhook without a live Paystack account — note in final report how to test locally (Paystack CLI / `paystack listen`, or `curl` with a hand-crafted signed payload using the test secret key) and in production (Paystack dashboard test webhook button).
- [ ] Commit.

## Task 14: Payment callback / success page

**Files:**
- Create: `app/payment/callback/route.ts` — Route Handler that receives Paystack's browser redirect (`?reference=...`), does its own `verifyTransaction` call (belt-and-suspenders, but still not the source of truth — the webhook already updated the row, this just reads it) and redirects to `/payment/success?reference=...`
- Create: `app/payment/success/page.tsx` — Server Component that looks up the order by `paystack_reference`, shows `payment_status`: `paid` → confirmation with order number/items/total (and clears cart via a small client component that calls `cart.clear()` only when `payment_status === "paid"`); `pending` → "we're confirming your payment" state with a note to refresh; not found → generic error

- [ ] Implement both files per the description above, reusing `lib/supabase/server.ts`.
- [ ] Verify: `npm run build` succeeds.
- [ ] Commit.

## Task 15: Admin order management foundation

**Files:**
- Modify: `supabase/migrations/0004_rls.sql` → actually add a follow-up migration instead (RLS files should stay append-only once applied): Create `supabase/migrations/0005_admin_role.sql`
- Create: `app/admin/layout.tsx` — server-side guard: redirect to `/account` unless `customers.is_admin = true` for the current session
- Create: `app/admin/orders/page.tsx` — list orders (status, payment status, total, customer, date) via the server client (RLS will block non-admins; admin check in the layout is defense-in-depth, not the only gate)
- Create: `app/admin/orders/[id]/page.tsx` — order detail + status-update form
- Create: `lib/actions/admin.ts` — `updateOrderStatus` server action (uses admin client after re-checking `is_admin` server-side)

- [ ] `0005_admin_role.sql`: add `is_admin boolean not null default false` to `customers`, and an RLS policy granting admins full `select`/`update` on `orders`/`order_items`/`payments`:
  ```sql
  alter table customers add column is_admin boolean not null default false;

  create policy "admins select all orders" on orders for select using (
    exists (select 1 from customers c where c.id = auth.uid() and c.is_admin)
  );
  create policy "admins update all orders" on orders for update using (
    exists (select 1 from customers c where c.id = auth.uid() and c.is_admin)
  );
  create policy "admins select all order items" on order_items for select using (
    exists (select 1 from customers c where c.id = auth.uid() and c.is_admin)
  );
  create policy "admins select all payments" on payments for select using (
    exists (select 1 from customers c where c.id = auth.uid() and c.is_admin)
  );
  ```
- [ ] Build the three admin files using the existing dark/burgundy design tokens (no new visual system) — keep this minimal (list + detail + status dropdown), matching "necessary architecture, don't over-build" from the spec.
- [ ] Note in the final report: making a given user an admin requires manually setting `is_admin = true` on their `customers` row (via Supabase SQL editor) — there's no self-service admin signup, intentionally.
- [ ] Verify: `npm run build` succeeds.
- [ ] Commit.

## Task 16: Documentation

**Files:**
- Create: `docs/COMMERCE_SETUP.md`

- [ ] Write concise, practical setup docs covering: Supabase project setup, env vars + where to get each one, running migrations (`supabase db push` or pasting files into the SQL editor in order), running the seed script, local dev, Paystack dashboard setup + webhook URL, testing payments (test card numbers), production deployment checklist.
- [ ] Commit.

---

## Self-review notes

- Spec coverage: schema (categories/collections/products/variants/images/customers/addresses/orders/order_items/payments/bespoke/wishlist) → Task 3; indexes → Task 4; RLS → Task 6 + 15; migrations as files → Tasks 3–6, 15; seed → Task 7; data layer swap → Task 8; guest checkout → Task 12 (`user_id` nullable, no forced auth); cart → Task 10; checkout → Task 12; Paystack init → Task 12; webhook → Task 13; callback/success → Task 14; admin → Task 15; docs → Task 16; env vars → Task 1. Email/notifications intentionally **not** implemented (spec says ask first) — flagged in final report only.
- No placeholders: every task names exact files and either full SQL or concrete function signatures/behavior. Task 7 (seed) and Task 9/12/13 (live auth/payment testing) explicitly can't be *executed* without real credentials — that's a credentials gap, not a spec gap, and is called out per-task rather than hidden.
