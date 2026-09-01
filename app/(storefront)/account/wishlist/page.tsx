import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { createClient } from "@/lib/supabase/server";
import { getWishlistProducts } from "@/lib/wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account");

  const products = await getWishlistProducts();

  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-16">
        <h1 className="font-display text-3xl font-light text-foreground">Wishlist</h1>

        {products.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Your wishlist is empty"
              description="Tap the heart on any product to save it here."
              action={<Button href="/shop">Shop OnPoint</Button>}
            />
          </div>
        ) : (
          <div className="mt-10">
            <ProductGrid products={products} tone="on-dark" columns={4} />
          </div>
        )}
      </Container>
    </div>
  );
}
