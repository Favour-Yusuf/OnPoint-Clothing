-- Photography backdrop color, distinct from any garment/swatch color already
-- on the product. Lets the shop grid group products so matching backdrops
-- (all-red, all-grey, etc.) land in the same row by default. Nullable/no
-- default: existing rows simply have no grouping until the seed script
-- backfills a value from lib/data/products.ts.
alter table products add column backdrop_color text;
