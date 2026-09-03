import { getProductsBySlugs } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

// Hand-picked for the homepage — order here is the display order.
const SHOP_THE_LOOK_SLUGS = ["black-senator-kaftan", "aura-monolith-vslit-set", "aura-white-kaftan", "royal-crown-fila"];

export async function FeaturedProducts() {
  const products = await getProductsBySlugs(SHOP_THE_LOOK_SLUGS);

  return (
    <section className="bg-foreground py-24 text-background sm:py-32">
      <Container>
        <SectionHeading
          tone="on-light"
          eyebrow="Just In"
          title="Shop the Look."
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
