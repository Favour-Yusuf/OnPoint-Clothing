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
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
          <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">{eyebrow}</p>
        </div>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone">{description}</p>
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
