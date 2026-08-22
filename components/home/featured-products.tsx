import { getFeaturedProducts } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);

  return (
    <section className="bg-foreground py-24 text-background sm:py-32">
      <Container>
        <SectionHeading
          tone="on-light"
          eyebrow="Just In"
          title="Featured Pieces."
          description="A curated selection. This is not the whole catalog, just what's worth your attention right now."
          action={
            <Button href="/shop" variant="outline" tone="on-light">
              View All
            </Button>
          }
        />

        <div className="mt-14">
          <ProductGrid products={products} tone="on-light" />
        </div>
      </Container>
    </section>
  );
}
