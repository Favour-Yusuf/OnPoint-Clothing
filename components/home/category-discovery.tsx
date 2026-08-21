import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getAllCategories } from "@/lib/products";
import { editorialImages } from "@/lib/data/editorial";
import type { CloudinaryImage } from "@/lib/types";

type Tile = {
  name: string;
  href: string;
  image: CloudinaryImage;
};

export async function CategoryDiscovery() {
  const categories = await getAllCategories();

  const tiles: Tile[] = [
    ...categories.map((category) => ({
      name: category.name,
      href: `/shop/${category.slug}`,
      image: category.image,
    })),
    { name: "New Arrivals", href: "/shop/new-arrivals", image: editorialImages.categoryTiles.newArrivals },
    { name: "Collections", href: "/collections", image: editorialImages.categoryTiles.collections },
    { name: "Bespoke", href: "/bespoke", image: editorialImages.categoryTiles.bespoke },
  ];

  return (
    <section className="bg-foreground py-24 text-background sm:py-32">
      <Container>
        <SectionHeading
          tone="on-light"
          eyebrow="Explore"
          title="Enter the House."
          description="Each category holds its own point of view. From tailoring to the finishing details."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {tiles.map((tile, index) => (
            <Reveal key={tile.href} delayMs={index * 80}>
              <Link
                href={tile.href}
                className="group relative block aspect-4/5 w-full overflow-hidden bg-background ring-0 ring-inset ring-burgundy transition-shadow duration-300 hover:ring-2 sm:aspect-4/3"
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                  <MediaImage image={tile.image} sizes="(min-width: 1024px) 33vw, 50vw" />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-burgundy-deep/85 via-background/15 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 sm:p-6">
                  <span className="font-sans text-xl font-semibold text-foreground sm:text-2xl">{tile.name}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground/30 text-foreground transition-colors group-hover:border-burgundy-light group-hover:bg-burgundy-light">
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
