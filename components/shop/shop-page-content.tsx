import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterBar } from "@/components/shop/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import type { Product } from "@/lib/types";

export function ShopPageContent({
  eyebrow,
  title,
  description,
  products,
  availableSizes,
  availableColors,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  availableSizes: string[];
  availableColors: string[];
}) {
  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-12 sm:py-16">
        <p className="font-sans text-xs font-medium tracking-[0.35em] text-burgundy uppercase">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/60">{description}</p>
      </Container>

      <Container>
        <FilterBar availableSizes={availableSizes} availableColors={availableColors} resultCount={products.length} />

        <div className="py-12">
          {products.length === 0 ? (
            <EmptyState
              title="No pieces match your filters"
              description="Try clearing a filter or exploring a different category."
            />
          ) : (
            <ProductGrid products={products} tone="on-dark" />
          )}
        </div>
      </Container>
    </div>
  );
}
