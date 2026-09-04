import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { ProductGrid } from "@/components/product/product-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getCloudinaryUrl, getPrimaryImage, isPlaceholder } from "@/lib/cloudinary/image";
import type { Product } from "@/lib/types";

const AVAILABILITY_SCHEMA: Record<Product["availability"], string> = {
  "in-stock": "https://schema.org/InStock",
  "low-stock": "https://schema.org/LimitedAvailability",
  "made-to-order": "https://schema.org/PreOrder",
  "sold-out": "https://schema.org/OutOfStock",
};

function buildProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.filter((image) => !isPlaceholder(image.publicId)).map((image) => getCloudinaryUrl(image.publicId, 1200)),
    offers: {
      "@type": "Offer",
      url: `https://www.justonpointng.com/product/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: AVAILABILITY_SCHEMA[product.availability],
    },
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { metadataBase: new URL("https://www.justonpointng.com"), title: "Product Not Found" };

  const primaryImage = getPrimaryImage(product.images);
  const ogImage = isPlaceholder(primaryImage.publicId) ? undefined : getCloudinaryUrl(primaryImage.publicId, 1200);

  return {
    metadataBase: new URL("https://www.justonpointng.com"),
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <div className="bg-background pt-16 lg:pt-20">
      <JsonLd data={buildProductSchema(product)} />
      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} videos={product.videos} />
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductDetails product={product} />
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <Container className="border-t border-foreground/10 py-16 sm:py-20">
          <SectionHeading eyebrow="You May Also Like" title="Complete the Look." />
          <div className="mt-12">
            <ProductGrid products={related} tone="on-dark" columns={4} />
          </div>
        </Container>
      ) : null}
    </div>
  );
}
