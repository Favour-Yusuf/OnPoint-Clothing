import type { Metadata } from "next";
import Link from "next/link";
import { getAllCollections } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curated collections from OnPoint Clothing.",
};

// Rendered on-demand rather than statically: the catalog has no
// revalidation hook, so a statically-prerendered listing would never
// reflect a later change without a full redeploy.
export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-12 sm:py-16">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
          <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">Collections</p>
        </div>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">
          Curated, Not <span className="text-burgundy-light italic">Cluttered.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone">
          Each collection is a point of view. A small, considered edit rather than the entire catalog.
        </p>
      </Container>

      <Container className="flex flex-col gap-4 pb-20 sm:gap-5">
        {collections.map((collection, index) => (
          <Reveal key={collection.slug} delayMs={index * 80}>
            <Link
              href={`/collections/${collection.slug}`}
              className="group relative flex aspect-4/5 w-full items-end overflow-hidden bg-foreground/5 sm:aspect-16/9 lg:aspect-21/9"
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                {/* The mobile 4:5 crop centers fine; the wider sm/lg crops are
                    short enough that a centered portrait photo loses the
                    model's face off the top, so bias upward from sm only. */}
                <MediaImage
                  image={collection.image}
                  sizes="100vw"
                  priority={index === 0}
                  className="object-center sm:object-[50%_15%]"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-burgundy-deep/80 via-background/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              <div className="relative z-10 flex w-full items-end justify-between gap-6 p-6 sm:p-10">
                <div>
                  <p className="font-sans text-xs font-light tracking-[0.3em] text-burgundy uppercase">{collection.season}</p>
                  <h2 className="mt-2 font-sans text-3xl font-semibold text-foreground sm:text-4xl">{collection.name}</h2>
                  <p className="mt-2 line-clamp-2 max-w-md text-sm text-foreground/60">{collection.description}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-foreground/30 text-foreground transition-colors group-hover:border-burgundy group-hover:bg-burgundy">
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </Container>
    </div>
  );
}
