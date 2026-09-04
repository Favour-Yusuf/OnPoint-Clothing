import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { filterProducts, getAvailableColors, getAvailableSizes, getCategory, type SortOption } from "@/lib/products";
import { ShopPageContent } from "@/components/shop/shop-page-content";
import { getCloudinaryUrl, isPlaceholder } from "@/lib/cloudinary/image";

const VALID_CATEGORIES = ["men", "women", "accessories", "new-arrivals"] as const;

const COPY: Record<string, { title: string; description: string }> = {
  men: { title: "Men", description: "Considered tailoring for everyday and occasion." },
  women: { title: "Women", description: "Tailoring and eveningwear built on precise construction." },
  accessories: { title: "Accessories", description: "The finishing details: leather, silk, and metal." },
  "new-arrivals": { title: "New Arrivals", description: "The latest additions to the collection." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const copy = COPY[category];
  const categoryData = await getCategory(category);
  const ogImage =
    categoryData && !isPlaceholder(categoryData.image.publicId) ? getCloudinaryUrl(categoryData.image.publicId, 1200) : undefined;

  return {
    metadataBase: new URL("https://www.justonpointng.com"),
    title: copy?.title ?? "Shop",
    description: copy?.description,
    openGraph: {
      title: copy?.title ?? "Shop",
      description: copy?.description,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: copy?.title ?? "Shop",
      description: copy?.description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ShopCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ size?: string; color?: string; sort?: string }>;
}) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    notFound();
  }

  const query = await searchParams;
  const isNewArrivals = category === "new-arrivals";

  const scopedProducts = await filterProducts({
    category: isNewArrivals ? undefined : category,
    newOnly: isNewArrivals || undefined,
  });

  const products = await filterProducts({
    category: isNewArrivals ? undefined : category,
    newOnly: isNewArrivals || undefined,
    size: query.size,
    color: query.color,
    // No ?sort= yet — default to the backdrop-color grouped view, matching
    // FilterBar's own default so the dropdown never shows "By Color"
    // selected while the grid is actually rendering ungrouped.
    sort: (query.sort as SortOption | undefined) ?? "color",
  });

  const categoryMeta = isNewArrivals ? undefined : await getCategory(category);
  const copy = COPY[category];

  return (
    <ShopPageContent
      eyebrow="Shop"
      title={categoryMeta?.name ?? copy.title}
      description={categoryMeta?.description ?? copy.description}
      products={products}
      availableSizes={getAvailableSizes(scopedProducts)}
      availableColors={getAvailableColors(scopedProducts)}
    />
  );
}
