-- A manual, per-product visibility override: true hides a product from
-- every cross-category listing (the full "/shop" catalog, "/shop/new-arrivals",
-- and the homepage "Shop the Look" panel) while leaving it fully visible on
-- its own category page (e.g. "/shop/accessories"). Not written by the seed
-- script — like is_active/is_featured, this is toggled directly in the
-- database, e.g. for an accessory that's in stock but doesn't have model
-- photography yet.
alter table products add column hide_from_general_shop boolean not null default false;
