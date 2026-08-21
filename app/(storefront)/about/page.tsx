import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Recognition } from "@/components/home/recognition";
import { ContactMethods } from "@/components/about/contact-methods";
import { editorialImages } from "@/lib/data/editorial";

export const metadata: Metadata = {
  title: "About",
  description:
    "OnPoint Clothing Nig — a multiple award-winning fashion house founded by Enoyi Abba George, redefining luxury for the 21st century.",
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="relative flex h-[60vh] min-h-[420px] w-full items-end overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0">
          {/* Wide, short section against a tall portrait photo — center-cropping
              loses the subject off the top of frame, so bias the crop upward. */}
          <MediaImage image={editorialImages.aboutHero} priority sizes="100vw" position="50% 15%" />
          <div className="absolute inset-0 bg-linear-to-t from-burgundy-deep via-background/50 to-background/10" />
        </div>
        <Container className="relative z-10 pb-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-burgundy-light" aria-hidden="true" />
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">The House</p>
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] font-light text-foreground sm:text-6xl">
            Multiple award-winning. <em className="text-burgundy-light italic">Undeniably OnPoint.</em>
          </h1>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy uppercase">Our Story</p>
            <h2 className="font-display text-3xl leading-tight font-light text-foreground sm:text-4xl">
              A house built on recognition.
            </h2>
            <p className="text-lg leading-relaxed text-foreground/65">
              OnPoint Clothing Nig is reinventing a classic approach to fashion with a modern edge. Founded by{" "}
              <span className="text-foreground">Enoyi Abba George</span>, the brand has redefined luxury for the
              21st century, reinforcing its position as one of Nigeria&rsquo;s most desirable fashion houses.
            </p>
            <p className="text-base leading-relaxed text-stone">
              A multiple award-winning fashion company, a top celebrity clothier, and a genuine game changer.
            </p>
          </Reveal>
        </Container>
      </section>

      <Recognition />

      <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy uppercase">Get in Touch</p>
            <h2 className="font-display text-3xl leading-tight font-light text-foreground sm:text-4xl">
              We&rsquo;d love to hear from you.
            </h2>
            <p className="text-base leading-relaxed text-foreground/55">
              For enquiries, bespoke consultations, or press — reach us directly.
            </p>
          </Reveal>
          <div className="mt-12">
            <ContactMethods />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl leading-tight font-light text-foreground sm:text-4xl">
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
