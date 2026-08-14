import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types";

/**
 * Re-checks every cart line item against the database immediately before
 * checkout. Never trusts `item.price` (or anything else) from the client —
 * this is the only place that decides what a line item actually costs and
 * whether it can be fulfilled.
 */

export type CartValidationIssue =
  | { key: string; type: "unavailable" }
  | { key: string; type: "price_changed"; newPrice: number }
  | { key: string; type: "insufficient_stock"; available: number };

export type ValidatedCartItem = {
  key: string;
  productId: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
  unitPrice: number; // minor units
};

export type CartValidationResult = {
  valid: boolean;
  issues: CartValidationIssue[];
  items: ValidatedCartItem[];
};

type VariantLookupRow = {
  id: string;
  size: string;
  color_name: string;
  sku: string;
  stock_quantity: number;
  price_override: number | null;
  products: {
    id: string;
    name: string;
    price: number;
    is_active: boolean;
    availability: string;
  } | null;
};

export async function validateCartItems(cartItems: CartItem[]): Promise<CartValidationResult> {
  if (cartItems.length === 0) return { valid: false, issues: [], items: [] };

  const supabase = await createClient();
  const variantIds = cartItems.map((item) => item.key.split(":")[1]).filter(Boolean);

  const { data, error } = await supabase
    .from("product_variants")
    .select("id, size, color_name, sku, stock_quantity, price_override, products!inner ( id, name, price, is_active, availability )")
    .in("id", variantIds);
  if (error) throw new Error(`validateCartItems: ${error.message}`);

  const variantById = new Map((data as unknown as VariantLookupRow[]).map((row) => [row.id, row]));

  const issues: CartValidationIssue[] = [];
  const items: ValidatedCartItem[] = [];

  for (const cartItem of cartItems) {
    const variantId = cartItem.key.split(":")[1];
    const variant = variantId ? variantById.get(variantId) : undefined;

    if (!variant || !variant.products || !variant.products.is_active || variant.products.availability === "sold-out") {
      issues.push({ key: cartItem.key, type: "unavailable" });
      continue;
    }

    if (variant.stock_quantity < cartItem.quantity) {
      issues.push({ key: cartItem.key, type: "insufficient_stock", available: variant.stock_quantity });
      continue;
    }

    const currentUnitPrice = variant.price_override ?? variant.products.price;
    // cartItem.price is in major units (client display); compare in minor units.
    const clientUnitPriceMinor = Math.round(cartItem.price * 100);
    if (clientUnitPriceMinor !== currentUnitPrice) {
      issues.push({ key: cartItem.key, type: "price_changed", newPrice: currentUnitPrice / 100 });
    }

    items.push({
      key: cartItem.key,
      productId: variant.products.id,
      variantId: variant.id,
      productName: variant.products.name,
      size: variant.size,
      color: variant.color_name,
      sku: variant.sku,
      quantity: cartItem.quantity,
      unitPrice: currentUnitPrice,
    });
  }

  return { valid: issues.length === 0, issues, items };
}
