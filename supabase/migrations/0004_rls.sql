-- Row Level Security. Public catalog data is readable by anyone. Personal
-- data (customers, addresses, wishlist, own orders) is owner-only via
-- auth.uid(). Writes to orders/order_items/payments/inventory are NOT
-- granted to anon/authenticated roles at all — those only ever happen
-- through the service-role client from Server Actions and the webhook
-- Route Handler, which bypasses RLS entirely.

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

-- Public catalog: readable by anyone.
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
create policy "addresses select own" on addresses for select using (customer_id = auth.uid());
create policy "addresses modify own" on addresses for all
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- Wishlist: owner only.
create policy "wishlist select own" on wishlist_items for select using (customer_id = auth.uid());
create policy "wishlist modify own" on wishlist_items for all
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- Orders/order_items/payments: a signed-in customer can read their own.
create policy "customers select own orders" on orders for select using (user_id = auth.uid());
create policy "customers select own order items" on order_items for select using (
  exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);
create policy "customers select own payments" on payments for select using (
  exists (select 1 from orders o where o.id = payments.order_id and o.user_id = auth.uid())
);

-- Admins (customers.is_admin = true) can read and update all orders, for the
-- admin dashboard. This is layered on top of, not instead of, the layout
-- guard in app/admin/layout.tsx.
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

-- Bespoke requests: public insert-only form, no public read.
create policy "anyone can submit a bespoke request" on bespoke_requests for insert with check (true);
create policy "customers select own bespoke requests" on bespoke_requests for select using (
  customer_id = auth.uid()
);
