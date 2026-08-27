import type { Metadata } from "next";
import { filterProducts, getAvailableColors, getAvailableSizes, getAllProducts, type SortOption } from "@/lib/products";
import { ShopPageContent } from "@/components/shop/shop-page-content";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full OnPoint Clothing collection — tailoring, knitwear, and accessories.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; size?: string; color?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const allProducts = await getAllProducts();

  const products = await filterProducts({
    category: params.category,
    size: params.size,
    color: params.color,
    sort: (params.sort as SortOption | undefined) ?? "color",
  });

  return (
    <ShopPageContent
      eyebrow="Shop"
      title="The Full Collection"
      description="Ready-to-wear tailoring, knitwear, and accessories — built to the same standard as everything else we make."
      products={products}
      availableSizes={getAvailableSizes(allProducts)}
      availableColors={getAvailableColors(allProducts)}
    />
  );
}
