import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, getCollectionProducts, getAllCollections, getAvailableSizes, getAvailableColors } from "@/lib/products";
import { ShopPageContent } from "@/components/shop/shop-page-content";
import { filterProducts, type SortOption } from "@/lib/products";

export async function generateStaticParams() {
  const collections = await getAllCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: "Collection Not Found" };
  return { title: collection.name, description: collection.description };
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
