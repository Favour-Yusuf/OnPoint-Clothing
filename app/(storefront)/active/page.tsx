import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { ProductGrid } from "@/components/product/product-grid";
import { editorialImages } from "@/lib/data/editorial";
import { getCollectionProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "OnPoint Active",
  description: "OnPoint Active. Performance activewear for movement, training, and everyday wear.",
};

export default async function ActivePage() {
  // OnPoint Active products live under the "women" category (they're
  // genuinely women's activewear) and are additionally tagged with the
  // "onpoint-active" collection so this page can pull them independently of
  // category — see the comment in lib/data/categories.ts.
  const products = await getCollectionProducts("onpoint-active");

  return (
    <div className="bg-foreground">
      <section className="relative flex h-[70vh] min-h-[480px] w-full items-end overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0">
          <MediaImage image={editorialImages.activeHero} priority sizes="100vw" position="50% 10%" />
          <div className="absolute inset-0 bg-linear-to-t from-burgundy-deep via-background/50 to-background/10" />
        </div>
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-0 hidden w-1.5 bg-burgundy lg:block" />
        <Container className="relative z-10 pb-16 sm:pb-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-burgundy-light" aria-hidden="true" />
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">OnPoint Active</p>
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[1.05] font-light text-foreground sm:text-7xl">
            Built <em className="text-burgundy-light italic">to move.</em>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/65 sm:text-lg">
            Performance activewear from OnPoint. Sculpting fits, breathable stretch fabric, and the same attention
            to detail as the rest of the house.
          </p>
        </Container>
      </section>

      <section className="bg-foreground py-20 sm:py-28">
        <Container>
          <SectionHeading
            tone="on-light"
            eyebrow="OnPoint Active"
            title="Performance, Elevated."
            description="Rompers, sets, and sculpting fits built for training, studio sessions, and everyday wear."
          />
          <div className="mt-14">
            <ProductGrid products={products} tone="on-light" columns={4} />
          </div>
        </Container>
      </section>
    </div>
  );
}
