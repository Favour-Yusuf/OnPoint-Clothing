import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";

export function ProductGrid({
  products,
  tone = "on-light",
  columns = 4,
}: {
  products: Product[];
  tone?: "on-light" | "on-dark";
  columns?: 3 | 4;
}) {
  const colClass = columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 ${colClass}`}>
      {products.map((product, index) => (
        <Reveal key={product.id} delayMs={(index % columns) * 60}>
          <ProductCard product={product} tone={tone} columns={columns} />
        </Reveal>
      ))}
    </div>
  );
}
