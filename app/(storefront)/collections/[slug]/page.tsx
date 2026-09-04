import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, getCollectionProducts, getAvailableSizes, getAvailableColors } from "@/lib/products";
import { ShopPageContent } from "@/components/shop/shop-page-content";
import { filterProducts, type SortOption } from "@/lib/products";
import { getCloudinaryUrl, isPlaceholder } from "@/lib/cloudinary/image";

// The catalog has no revalidation hook, so this can't be fully static — but
// force-dynamic re-hit Supabase on every single request. A 5-minute ISR
// window gets the same "never far from stale" guarantee at a fraction of
// the database load, serving cached HTML in between revalidations.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { metadataBase: new URL("https://www.justonpointng.com"), title: "Collection Not Found" };

  const ogImage = isPlaceholder(collection.image.publicId) ? undefined : getCloudinaryUrl(collection.image.publicId, 1200);

  return {
    metadataBase: new URL("https://www.justonpointng.com"),
    title: collection.name,
    description: collection.description,
    openGraph: {
      title: collection.name,
      description: collection.description,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: collection.name,
      description: collection.description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function CollectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ size?: string; color?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  const query = await searchParams;
  const scopedProducts = await getCollectionProducts(slug);
  const products = await filterProducts({
    collection: slug,
    size: query.size,
    color: query.color,
    sort: query.sort as SortOption | undefined,
  });

  return (
    <ShopPageContent
      eyebrow={collection.season}
      title={collection.name}
      description={collection.description}
      products={products}
      availableSizes={getAvailableSizes(scopedProducts)}
      availableColors={getAvailableColors(scopedProducts)}
    />
  );
}
