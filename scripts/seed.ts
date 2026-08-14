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
    image_url: category.image.url,
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
    image_url: collection.image.url,
    is_active: true,
  }));
  const { data, error } = await supabase.from("collections").upsert(rows, { onConflict: "slug" }).select("id, slug");
  if (error) throw new Error(`collections: ${error.message}`);
  return new Map(data.map((row) => [row.slug, row.id as string]));
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
  }));
  const { data, error } = await supabase.from("products").upsert(rows, { onConflict: "slug" }).select("id, slug");
  if (error) throw new Error(`products: ${error.message}`);
  return new Map(data.map((row) => [row.slug, row.id as string]));
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
      url: image.url,
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
    if (rows.length === 0) continue;
    const { error } = await supabase.from("product_variants").upsert(rows, { onConflict: "sku" });
    if (error) throw new Error(`product_variants (${product.slug}): ${error.message}`);
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

  console.log("Seeding products...");
  const productIdBySlug = await seedProducts(categoryIdBySlug);

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
