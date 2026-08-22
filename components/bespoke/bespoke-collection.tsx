import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { getBespokeProducts } from "@/lib/products";

// Renders nothing if there's nothing to show yet — an empty bespoke grid
// between the hero and the process section would read as broken, not
// "coming soon."
export async function BespokeCollection() {
  const products = await getBespokeProducts();
  if (products.length === 0) return null;

  return (
    <section className="bg-foreground py-20 sm:py-28">
      <Container>
        <SectionHeading
          tone="on-light"
          eyebrow="Already Bespoke"
          title="The Bespoke Collection."
          description="Made to measure pieces, built one at a time. Request your size and colorway directly."
        />
        <div className="mt-14">
          <ProductGrid products={products} tone="on-light" columns={3} />
        </div>
      </Container>
    </section>
  );
}
