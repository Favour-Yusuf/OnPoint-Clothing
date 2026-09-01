"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Toggles a product's wishlist membership for the signed-in user. Returns the new state. */
export async function toggleWishlist(productId: string): Promise<{ wishlisted: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("customer_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase.from("wishlist_items").delete().eq("customer_id", user.id).eq("product_id", productId);
    revalidatePath("/account/wishlist");
    return { wishlisted: false };
  }

  await supabase.from("wishlist_items").insert({ customer_id: user.id, product_id: productId });
  revalidatePath("/account/wishlist");
  return { wishlisted: true };
}
