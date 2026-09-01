-- Product gallery videos. Mirrors product_images exactly (same shape, same
-- "no natural unique key, replace-all per product on reseed" convention in
-- scripts/seed.ts) — a separate table rather than a type column on
-- product_images because video/image delivery URLs and player treatment
-- differ enough to want distinct read paths, not a polymorphic row.
create table product_videos (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  cloudinary_public_id text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table product_videos enable row level security;
create policy "product_videos are publicly readable" on product_videos for select using (true);
