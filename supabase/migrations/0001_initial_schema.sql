-- OnPoint Clothing: initial schema
-- Money columns are integer minor units (e.g. cents) to avoid float rounding.

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

-- Profile row for an authenticated user. Keyed 1:1 to auth.users so there is
-- exactly one identity system (Supabase Auth), not a parallel one.
create table customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  is_admin boolean not null default false,
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

-- user_id is nullable and customer contact info is duplicated onto the row
-- directly (not just via a join) so guest orders (user_id = null) work and
-- historical orders remain readable even if the account is later deleted.
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

-- Snapshot of product info at time of purchase. product_id/variant_id are
-- nullable references for traceability only — never join back to products
-- to render historical order details, the columns below are the source of
-- truth for what was actually purchased.
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
