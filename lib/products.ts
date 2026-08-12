import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { collections } from "@/lib/data/collections";
import type { Product } from "@/lib/types";

/**
 * Product service layer. UI code should only ever import from here (or
 * lib/categories.ts / lib/collections.ts if added), never from lib/data/*
 * directly — that keeps a future database or CMS swap contained to this
 * file. Functions are async on purpose, even though the current
 * implementation is a synchronous in-memory read, so call sites already
 * look the way they will once this is backed by a real data source.
 */

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export type ProductFilters = {
  category?: string;
  collection?: string;
  size?: string;
  color?: string;
  sort?: SortOption;
  query?: string;
  newOnly?: boolean;
};

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getNewArrivals(limit?: number): Promise<Product[]> {
  const results = products.filter((product) => product.isNew);
  return typeof limit === "number" ? results.slice(0, limit) : results;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const sameCategory = products.filter(
    (candidate) => candidate.id !== product.id && candidate.categorySlug === product.categorySlug
  );
  return sameCategory.slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return products.filter((product) => {
    const haystack = `${product.name} ${product.shortDescription} ${product.categorySlug}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export async function filterProducts(filters: ProductFilters): Promise<Product[]> {
  let results = [...products];

  if (filters.newOnly) {
    results = results.filter((product) => product.isNew);
  }
  if (filters.category) {
    results = results.filter((product) => product.categorySlug === filters.category);
  }
  if (filters.collection) {
    results = results.filter((product) => product.collectionSlugs.includes(filters.collection!));
  }
  if (filters.size) {
    results = results.filter((product) => product.sizes.includes(filters.size!));
  }
  if (filters.color) {
    results = results.filter((product) =>
      product.colors.some((color) => color.name.toLowerCase() === filters.color!.toLowerCase())
    );
  }
  if (filters.query) {
    const normalized = filters.query.trim().toLowerCase();
    results = results.filter((product) => product.name.toLowerCase().includes(normalized));
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
    default:
      break;
  }

  return results;
}

export function getAvailableSizes(productList: Product[]): string[] {
  const sizes = new Set<string>();
  for (const product of productList) {
    for (const size of product.sizes) sizes.add(size);
  }
  return Array.from(sizes);
}

export function getAvailableColors(productList: Product[]): string[] {
  const colors = new Set<string>();
  for (const product of productList) {
    for (const color of product.colors) colors.add(color.name);
  }
  return Array.from(colors);
}

export async function getAllCategories() {
  return categories;
}

export async function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export async function getAllCollections() {
  return collections;
}

export async function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export async function getCollectionProducts(slug: string): Promise<Product[]> {
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return [];
  return products.filter((product) => collection.productSlugs.includes(product.slug));
}
