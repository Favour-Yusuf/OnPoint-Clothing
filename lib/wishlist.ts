import { createClient } from "@/lib/supabase/server";
import { getProductsByIds } from "@/lib/products";
import type { Product } from "@/lib/types";

/**
 * Wishlist read layer. Mirrors the lib/orders.ts pattern: components/pages
 * only ever read wishlist state through here, never query wishlist_items
 * directly.
 */

export async function getWishlistProductIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.from("wishlist_items").select("product_id").eq("customer_id", user.id);
  if (error) throw new Error(`getWishlistProductIds: ${error.message}`);
  return data.map((row) => row.product_id);
}

export async function getWishlistProducts(): Promise<Product[]> {
  const ids = await getWishlistProductIds();
  return getProductsByIds(ids);
}
