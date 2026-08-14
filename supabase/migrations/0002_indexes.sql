-- Indexes for the query patterns used by lib/products.ts, checkout, and
-- order lookups (order number, customer email, Paystack reference, status).

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
