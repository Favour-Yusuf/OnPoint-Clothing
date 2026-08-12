import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { ProductGrid } from "@/components/product/product-grid";

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
  if (!product) return { title: "Product Not Found" };
  return { title: product.name, description: product.shortDescription };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} />
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
