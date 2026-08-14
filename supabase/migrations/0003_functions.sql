-- updated_at trigger, order number generator, and the atomic stock-decrement
-- RPC that prevents overselling under concurrent checkout.

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

create or replace function generate_order_number()
returns text as $$
begin
  return 'ONPT-' || upper(to_hex(extract(epoch from clock_timestamp())::bigint)) ||
    upper(substr(md5(random()::text), 1, 4));
end;
$$ language plpgsql;

alter table orders alter column order_number set default generate_order_number();

-- Locks the variant row (FOR UPDATE), checks stock, decrements atomically.
-- Concurrent callers serialize on the row lock, so stock can never go
-- negative regardless of how many checkouts race for the same SKU.
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
