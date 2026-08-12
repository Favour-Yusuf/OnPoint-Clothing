import { getAllCollections } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";

export async function FeaturedCollection() {
  const collections = await getAllCollections();
  const collection = collections[0];
  if (!collection) return null;

  return (
    <section className="relative flex h-[85vh] min-h-[560px] w-full items-end overflow-hidden bg-background">
      <div className="absolute inset-0">
        <MediaImage image={collection.image} sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
      </div>

      <Reveal className="relative z-10 flex w-full flex-col gap-6 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24 xl:px-20">
        <p className="font-sans text-xs font-medium tracking-[0.35em] text-burgundy uppercase">{collection.season}</p>
        <h2 className="max-w-xl font-serif text-4xl leading-[1.05] font-light text-foreground sm:text-5xl lg:text-6xl">
          {collection.name}
        </h2>
        <p className="max-w-md text-base leading-relaxed text-foreground/65 sm:text-lg">{collection.description}</p>
        <div>
          <Button href={`/collections/${collection.slug}`} variant="outline">
            View the Edit
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
