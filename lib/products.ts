import { createPublicClient } from "@/lib/supabase/public";
import { getColorFamily, getFamilyHex } from "@/lib/color-families";
import type { Category, Collection, CloudinaryImage, CloudinaryVideo, Product, ProductColor, ProductVariant } from "@/lib/types";

/**
 * Product service layer, backed by Supabase Postgres. UI code should only
 * ever import from here (never from lib/data/* directly, and never query
 * Supabase for catalog data outside this file) — that keeps the data source
 * swap contained to this one module. Function names/signatures match the
 * original mock-data version exactly so no component call sites changed.
 */

// "color" groups the grid by photography backdrop (see backdropColor on
// Product) so matching backdrops land in the same row — it's the default
// view (see FilterBar's activeSort fallback), not something layered on top
// of "featured". Picking "featured" (or any other option) explicitly is a
// real, fully ungrouped sort in catalog order, same as it always was.
export type SortOption = "color" | "featured" | "price-asc" | "price-desc" | "newest";

export type ProductFilters = {
  category?: string;
  collection?: string;
  size?: string;
  color?: string;
  sort?: SortOption;
  query?: string;
  newOnly?: boolean;
};

// categories uses !inner so .eq("categories.slug", ...) filters actually
// exclude non-matching products (a plain embed only filters the nested
// object, not the parent row, per PostgREST's embedded-resource semantics).
const PRODUCT_SELECT = `
  id, slug, name, description, short_description, price, compare_at_price,
  currency, details, care, is_new, is_bespoke_eligible, availability, backdrop_color,
  categories!inner ( slug ),
  product_images ( cloudinary_public_id, alt, position ),
  product_videos ( cloudinary_public_id, position ),
  product_variants ( id, size, color_name, color_hex, sku, stock_quantity ),
  product_collections ( collections ( slug ) )
`;

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  currency: "NGN";
  details: string[];
  care: string[];
  is_new: boolean;
  is_bespoke_eligible: boolean;
  availability: Product["availability"];
  backdrop_color: string | null;
  categories: { slug: string } | null;
  product_images: { cloudinary_public_id: string; alt: string; position: number }[];
  product_videos: { cloudinary_public_id: string; position: number }[];
  product_variants: {
    id: string;
    size: string;
    color_name: string;
    color_hex: string;
    sku: string;
    stock_quantity: number;
  }[];
  product_collections: { collections: { slug: string } | null }[];
};

const toMajorUnits = (minorUnits: number) => minorUnits / 100;

function mapProductRow(row: ProductRow): Product {
  const images: CloudinaryImage[] = [...row.product_images]
    .sort((a, b) => a.position - b.position)
    .map((image) => ({ publicId: image.cloudinary_public_id, alt: image.alt }));

  const videos: CloudinaryVideo[] = [...row.product_videos]
    .sort((a, b) => a.position - b.position)
    .map((video) => ({ publicId: video.cloudinary_public_id }));

  const variants: ProductVariant[] = row.product_variants.map((variant) => ({
    id: variant.id,
    size: variant.size,
    color: variant.color_name,
    sku: variant.sku,
    inStock: variant.stock_quantity > 0,
  }));

  const sizes = Array.from(new Set(row.product_variants.map((v) => v.size)));
  const colors: ProductColor[] = Array.from(
    new Map(row.product_variants.map((v) => [v.color_name, { name: v.color_name, hex: v.color_hex }])).values()
  );

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: toMajorUnits(row.price),
    compareAtPrice: row.compare_at_price != null ? toMajorUnits(row.compare_at_price) : undefined,
    currency: row.currency,
    categorySlug: row.categories?.slug ?? "",
    collectionSlugs: row.product_collections.flatMap((pc) => (pc.collections ? [pc.collections.slug] : [])),
    backdropColor: row.backdrop_color ?? undefined,
    images,
    videos,
    shortDescription: row.short_description,
    description: row.description,
    details: row.details,
    care: row.care,
    sizes,
    colors,
    variants,
    availability: row.availability,
    isNew: row.is_new,
    isBespokeEligible: row.is_bespoke_eligible,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("is_active", true);
  if (error) throw new Error(`getAllProducts: ${error.message}`);
  return (data as unknown as ProductRow[]).map(mapProductRow);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error(`getProductBySlug: ${error.message}`);
  return data ? mapProductRow(data as unknown as ProductRow) : undefined;
}

export async function getBespokeProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_bespoke_eligible", true);
  if (error) throw new Error(`getBespokeProducts: ${error.message}`);
  return (data as unknown as ProductRow[]).map(mapProductRow);
}

export async function getNewArrivals(limit?: number): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("is_active", true).eq("is_new", true);
  if (typeof limit === "number") query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(`getNewArrivals: ${error.message}`);
  return (data as unknown as ProductRow[]).map(mapProductRow);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(limit);
  if (error) throw new Error(`getFeaturedProducts: ${error.message}`);
  const rows = (data as unknown as ProductRow[]).map(mapProductRow);
  if (rows.length > 0) return rows;

  // No products are marked featured yet (fresh seed) — fall back to the
  // first `limit` active products so the homepage isn't empty.
  const { data: fallbackData, error: fallbackError } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .limit(limit);
  if (fallbackError) throw new Error(`getFeaturedProducts fallback: ${fallbackError.message}`);
  return (fallbackData as unknown as ProductRow[]).map(mapProductRow);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("categories.slug", product.categorySlug)
    .neq("id", product.id)
    .limit(limit);
  if (error) throw new Error(`getRelatedProducts: ${error.message}`);
  return (data as unknown as ProductRow[]).map(mapProductRow);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const normalized = query.trim();
  if (!normalized) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .or(`name.ilike.%${normalized}%,short_description.ilike.%${normalized}%`);
  if (error) throw new Error(`searchProducts: ${error.message}`);
  return (data as unknown as ProductRow[]).map(mapProductRow);
}

export async function filterProducts(filters: ProductFilters): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("is_active", true);

  if (filters.newOnly) query = query.eq("is_new", true);
  if (filters.category) query = query.eq("categories.slug", filters.category);
  if (filters.query) query = query.ilike("name", `%${filters.query.trim()}%`);

  const { data, error } = await query;
  if (error) throw new Error(`filterProducts: ${error.message}`);
  let results = (data as unknown as ProductRow[]).map(mapProductRow);

  // Collection/size/color filters need the mapped shape (collectionSlugs,
  // sizes, colors are derived client-side from joined rows), so they're
  // applied in-memory after the DB round-trip rather than pushed into SQL.
  if (filters.collection) {
    results = results.filter((product) => product.collectionSlugs.includes(filters.collection!));
  }
  if (filters.size) {
    results = results.filter((product) => product.sizes.includes(filters.size!));
  }
  if (filters.color) {
    // filters.color holds a family name (e.g. "Red"), not a specific shade
    // (e.g. "Wine") — see lib/color-families.ts.
    results = results.filter((product) =>
      product.colors.some((color) => getColorFamily(color.name).toLowerCase() === filters.color!.toLowerCase())
    );
  }

  switch (filters.sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      results.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "color":
      results = groupByBackdropColor(results);
      break;
    case "featured":
    default:
      // Unchanged catalog order — this is the real "Featured" sort, kept
      // deliberately separate from "color" grouping (see SortOption above).
      break;
  }

  return results;
}

/**
 * Buckets products by backdropColor, preserving each product's relative
 * order within its bucket, then concatenates buckets in the order their
 * first member appears — so same-backdrop products land in contiguous grid
 * rows without needing an arbitrary priority order between colors.
 */
function groupByBackdropColor(products: Product[]): Product[] {
  const buckets = new Map<string, Product[]>();
  for (const product of products) {
    const key = product.backdropColor ?? "unassigned";
    const bucket = buckets.get(key);
    if (bucket) bucket.push(product);
    else buckets.set(key, [product]);
  }
  return Array.from(buckets.values()).flat();
}

export function getAvailableSizes(productList: Product[]): string[] {
  const sizes = new Set<string>();
  for (const product of productList) {
    for (const size of product.sizes) sizes.add(size);
  }
  return Array.from(sizes);
}

export type ColorFamily = { name: string; hex: string };

/**
 * One entry per color *family* (see lib/color-families.ts), not per exact
 * shade — several distinct "Custom"/"Wine"/"Burgundy"-type names collapse
 * into a single representative swatch so the filter list stays a handful of
 * visually distinct dots instead of two dozen near-identical ones.
 */
export function getAvailableColors(productList: Product[]): ColorFamily[] {
  const families = new Set<string>();
  for (const product of productList) {
    for (const color of product.colors) families.add(getColorFamily(color.name));
  }
  return Array.from(families).map((name) => ({ name, hex: getFamilyHex(name) }));
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, description, cloudinary_public_id")
    .eq("is_active", true);
  if (error) throw new Error(`getAllCategories: ${error.message}`);
  return data.map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    image: { publicId: row.cloudinary_public_id ?? "placeholder:no-image", alt: row.name },
  }));
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const categories = await getAllCategories();
  return categories.find((category) => category.slug === slug);
}

type CollectionRow = {
  slug: string;
  name: string;
  season: string | null;
  description: string | null;
  cloudinary_public_id: string | null;
  product_collections: { products: { slug: string } | null }[];
};

export async function getAllCollections(): Promise<Collection[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("collections")
    .select("slug, name, season, description, cloudinary_public_id, product_collections ( products ( slug ) )")
    .eq("is_active", true);
  if (error) throw new Error(`getAllCollections: ${error.message}`);
  return (data as unknown as CollectionRow[]).map((row) => ({
    slug: row.slug,
    name: row.name,
    season: row.season ?? "",
    description: row.description ?? "",
    image: { publicId: row.cloudinary_public_id ?? "placeholder:no-image", alt: row.name },
    productSlugs: row.product_collections.flatMap((pc) => (pc.products ? [pc.products.slug] : [])),
  }));
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("collections")
    .select("slug, name, season, description, cloudinary_public_id, product_collections ( products ( slug ) )")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error(`getCollection: ${error.message}`);
  if (!data) return undefined;
  const row = data as unknown as CollectionRow;
  return {
    slug: row.slug,
    name: row.name,
    season: row.season ?? "",
    description: row.description ?? "",
    image: { publicId: row.cloudinary_public_id ?? "placeholder:no-image", alt: row.name },
    productSlugs: row.product_collections.flatMap((pc) => (pc.products ? [pc.products.slug] : [])),
  };
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).in("id", ids).eq("is_active", true);
  if (error) throw new Error(`getProductsByIds: ${error.message}`);
  return (data as unknown as ProductRow[]).map(mapProductRow);
}

export async function getCollectionProducts(slug: string): Promise<Product[]> {
  const collection = await getCollection(slug);
  if (!collection) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).in("slug", collection.productSlugs).eq("is_active", true);
  if (error) throw new Error(`getCollectionProducts: ${error.message}`);
  return (data as unknown as ProductRow[]).map(mapProductRow);
}
