/**
 * Seeds the Supabase database from the existing mock data in lib/data/*.
 * Re-runnable: every insert upserts on the table's unique key (slug/sku),
 * so running it again just updates rows in place instead of duplicating.
 *
 * Usage: npm run seed
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// dotenv's default import only loads a file literally named ".env" — Next.js
// has its own built-in ".env.local" loading that dev/build rely on, but this
// standalone script runs outside Next's runtime, so it has to load explicitly.
loadEnv({ path: ".env.local" });
import { products as mockProducts } from "../lib/data/products";
import { categories as mockCategories } from "../lib/data/categories";
import { collections as mockCollections } from "../lib/data/collections";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local first."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Mock prices are major units (dollars); the DB stores integer minor units.
const toMinorUnits = (majorUnits: number) => Math.round(majorUnits * 100);

async function seedCategories() {
  const rows = mockCategories.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description,
    cloudinary_public_id: category.image.publicId,
    is_active: true,
  }));
  const { data, error } = await supabase.from("categories").upsert(rows, { onConflict: "slug" }).select("id, slug");
  if (error) throw new Error(`categories: ${error.message}`);
  return new Map(data.map((row) => [row.slug, row.id as string]));
}

async function seedCollections() {
  const rows = mockCollections.map((collection) => ({
    slug: collection.slug,
    name: collection.name,
    season: collection.season,
    description: collection.description,
    cloudinary_public_id: collection.image.publicId,
    is_active: true,
  }));
  const { data, error } = await supabase.from("collections").upsert(rows, { onConflict: "slug" }).select("id, slug");
  if (error) throw new Error(`collections: ${error.message}`);
  return new Map(data.map((row) => [row.slug, row.id as string]));
}

// Mirrors pruneRemovedProducts below — any collection no longer in
// lib/data/collections.ts (including one that was renamed to a new slug)
// is removed. product_collections has ON DELETE CASCADE on collection_id,
// so its links go with it.
async function pruneRemovedCollections() {
  const currentSlugs = new Set(mockCollections.map((collection) => collection.slug));
  const { data, error } = await supabase.from("collections").select("id, slug");
  if (error) throw new Error(`prune collections (read): ${error.message}`);

  const staleSlugs = data.filter((row) => !currentSlugs.has(row.slug)).map((row) => row.slug);
  if (staleSlugs.length === 0) return;

  const { error: deleteError } = await supabase.from("collections").delete().in("slug", staleSlugs);
  if (deleteError) throw new Error(`prune collections (delete): ${deleteError.message}`);
  console.log(`Removed ${staleSlugs.length} collection(s) no longer in lib/data/collections.ts: ${staleSlugs.join(", ")}`);
}

async function seedProducts(categoryIdBySlug: Map<string, string>) {
  const rows = mockProducts.map((product) => ({
    slug: product.slug,
    name: product.name,
    description: product.description,
    short_description: product.shortDescription,
    details: product.details,
    care: product.care,
    price: toMinorUnits(product.price),
    compare_at_price: product.compareAtPrice ? toMinorUnits(product.compareAtPrice) : null,
    currency: product.currency,
    category_id: categoryIdBySlug.get(product.categorySlug) ?? null,
    is_active: true,
    is_featured: false,
    is_new: Boolean(product.isNew),
    is_bespoke_eligible: Boolean(product.isBespokeEligible),
    availability: product.availability,
    backdrop_color: product.backdropColor ?? null,
  }));
  const { data, error } = await supabase.from("products").upsert(rows, { onConflict: "slug" }).select("id, slug");
  if (error) throw new Error(`products: ${error.message}`);
  return new Map(data.map((row) => [row.slug, row.id as string]));
}

// Seeding is authoritative: any product in the DB that's no longer in
// lib/data/products.ts is removed. Cascades to its images/variants/
// collection links; order_items keep their historical snapshot regardless
// (product_id there is ON DELETE SET NULL, not the source of truth).
async function pruneRemovedProducts() {
  const currentSlugs = new Set(mockProducts.map((product) => product.slug));
  const { data, error } = await supabase.from("products").select("id, slug");
  if (error) throw new Error(`prune products (read): ${error.message}`);

  const staleSlugs = data.filter((row) => !currentSlugs.has(row.slug)).map((row) => row.slug);
  if (staleSlugs.length === 0) return;

  const { error: deleteError } = await supabase.from("products").delete().in("slug", staleSlugs);
  if (deleteError) throw new Error(`prune products (delete): ${deleteError.message}`);
  console.log(`Removed ${staleSlugs.length} product(s) no longer in lib/data/products.ts: ${staleSlugs.join(", ")}`);
}

async function seedProductImages(productIdBySlug: Map<string, string>) {
  for (const product of mockProducts) {
    const productId = productIdBySlug.get(product.slug);
    if (!productId) continue;

    // Images have no natural unique key, so replace-all per product keeps
    // this idempotent instead of accumulating duplicate rows on re-run.
    const { error: deleteError } = await supabase.from("product_images").delete().eq("product_id", productId);
    if (deleteError) throw new Error(`product_images delete (${product.slug}): ${deleteError.message}`);

    const rows = product.images.map((image, position) => ({
      product_id: productId,
      cloudinary_public_id: image.publicId,
      alt: image.alt,
      position,
    }));
    if (rows.length === 0) continue;
    const { error } = await supabase.from("product_images").insert(rows);
    if (error) throw new Error(`product_images insert (${product.slug}): ${error.message}`);
  }
}

async function seedProductVariants(productIdBySlug: Map<string, string>) {
  const DEFAULT_IN_STOCK_QUANTITY = 25;
  for (const product of mockProducts) {
    const productId = productIdBySlug.get(product.slug);
    if (!productId) continue;

    const rows = product.variants.map((variant) => {
      const color = product.colors.find((c) => c.name === variant.color);
      return {
        product_id: productId,
        size: variant.size,
        color_name: variant.color,
        color_hex: color?.hex ?? "#000000",
        sku: variant.sku,
        stock_quantity: variant.inStock ? DEFAULT_IN_STOCK_QUANTITY : 0,
      };
    });

    // Upsert on the natural (product_id, size, color_name) key — NOT
    // delete-and-reinsert. A fresh insert always gets a new random `id`
    // (see 0001_initial_schema.sql), and any customer's cart/order refers to
    // a variant by that id (see lib/cart/validate.ts). Deleting and
    // reinserting on every seed run — even when nothing about the variant
    // actually changed — silently orphans every cart that already has an
    // item in it, which is exactly what broke checkout on staging. Upserting
    // in place keeps the id stable across reseeds; `sku`/`stock_quantity`/
    // `color_hex` still update normally when the source data changes.
    if (rows.length > 0) {
      const { error } = await supabase
        .from("product_variants")
        .upsert(rows, { onConflict: "product_id,size,color_name" });
      if (error) throw new Error(`product_variants upsert (${product.slug}): ${error.message}`);
    }

    // Still prune combos that no longer exist for this product (e.g. a
    // dropped color) — upsert alone never deletes, so those would otherwise
    // linger as orderable-but-invisible rows.
    const currentKeys = new Set(rows.map((r) => `${r.size}::${r.color_name}`));
    const { data: existingRows, error: fetchError } = await supabase
      .from("product_variants")
      .select("id, size, color_name")
      .eq("product_id", productId);
    if (fetchError) throw new Error(`product_variants fetch (${product.slug}): ${fetchError.message}`);

    const staleIds = (existingRows ?? [])
      .filter((row) => !currentKeys.has(`${row.size}::${row.color_name}`))
      .map((row) => row.id);
    if (staleIds.length > 0) {
      const { error: pruneError } = await supabase.from("product_variants").delete().in("id", staleIds);
      if (pruneError) throw new Error(`product_variants prune (${product.slug}): ${pruneError.message}`);
    }
  }
}

async function seedProductCollections(
  productIdBySlug: Map<string, string>,
  collectionIdBySlug: Map<string, string>
) {
  const rows: Array<{ product_id: string; collection_id: string }> = [];
  for (const product of mockProducts) {
    const productId = productIdBySlug.get(product.slug);
    if (!productId) continue;
    for (const collectionSlug of product.collectionSlugs) {
      const collectionId = collectionIdBySlug.get(collectionSlug);
      if (collectionId) rows.push({ product_id: productId, collection_id: collectionId });
    }
  }
  if (rows.length === 0) return;
  const { error } = await supabase
    .from("product_collections")
    .upsert(rows, { onConflict: "product_id,collection_id" });
  if (error) throw new Error(`product_collections: ${error.message}`);
}

async function main() {
  console.log("Seeding categories...");
  const categoryIdBySlug = await seedCategories();

  console.log("Seeding collections...");
  const collectionIdBySlug = await seedCollections();

  console.log("Removing collections no longer in lib/data/collections.ts...");
  await pruneRemovedCollections();

  console.log("Seeding products...");
  const productIdBySlug = await seedProducts(categoryIdBySlug);

  console.log("Removing products no longer in lib/data/products.ts...");
  await pruneRemovedProducts();

  console.log("Seeding product images...");
  await seedProductImages(productIdBySlug);

  console.log("Seeding product variants...");
  await seedProductVariants(productIdBySlug);

  console.log("Linking products to collections...");
  await seedProductCollections(productIdBySlug, collectionIdBySlug);

  console.log(
    `Done: ${categoryIdBySlug.size} categories, ${collectionIdBySlug.size} collections, ${productIdBySlug.size} products seeded.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
