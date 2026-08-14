import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Heritage } from "@/components/home/heritage";

export const metadata: Metadata = {
  title: "About",
  description: "Nineteen years of tailoring and considered design — the story of OnPoint Clothing.",
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="relative flex h-[60vh] min-h-[420px] w-full items-end overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0">
          <MediaImage image={{ url: "placeholder:about-hero-01", alt: "The OnPoint atelier" }} priority sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/25 to-background/10" />
        </div>
        <Container className="relative z-10 pb-16">
          <p className="font-sans text-xs font-medium tracking-[0.35em] text-burgundy uppercase">The House</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] font-light text-foreground sm:text-6xl">
            Nineteen years, one standard.
          </h1>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
            <p className="text-lg leading-relaxed text-foreground/65">
              OnPoint Clothing has spent nineteen years on the same premise: that clothing built with care outlasts
              clothing built for a season. Construction over trend. Fit over flourish.
            </p>
            <p className="text-base leading-relaxed text-foreground/50">
              The fuller story of the house — its founding, its people, and the milestones along the way — is being
              written for this new site. Check back soon.
            </p>
          </Reveal>
        </Container>
      </section>

      <Heritage />

      <section className="py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-serif text-3xl leading-tight font-light text-foreground sm:text-4xl">
            See the current collection.
          </h2>
          <div className="flex gap-4">
            <Button href="/shop">Shop OnPoint</Button>
            <Button href="/bespoke" variant="outline">
              Explore Bespoke
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
