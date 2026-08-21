import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { BespokeCollection } from "@/components/bespoke/bespoke-collection";
import { BespokeProcess } from "@/components/bespoke/bespoke-process";
import { BespokeForm } from "@/components/bespoke/bespoke-form";
import { editorialImages } from "@/lib/data/editorial";

export const metadata: Metadata = {
  title: "Bespoke",
  description: "OnPoint Clothing's bespoke service — garments built to your measure.",
};

export default function BespokePage() {
  return (
    <div className="bg-foreground">
      <section className="relative flex h-[70vh] min-h-[480px] w-full items-end overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0">
          {/* Wide, short section against a tall portrait photo — center-cropping
              loses the subject off the top of frame, so bias the crop upward. */}
          <MediaImage image={editorialImages.bespokeHero} priority sizes="100vw" position="50% 12%" />
          <div className="absolute inset-0 bg-linear-to-t from-burgundy-deep via-background/50 to-background/10" />
        </div>
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-0 hidden w-1.5 bg-burgundy lg:block" />
        <Container className="relative z-10 pb-16 sm:pb-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-burgundy-light" aria-hidden="true" />
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">The Bespoke Service</p>
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[1.05] font-light text-foreground sm:text-7xl">
            Made <em className="text-burgundy-light italic">for you.</em>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/65 sm:text-lg">
            Beyond ready-to-wear: a garment built to your measure, from first consultation to final fitting.
          </p>
        </Container>
      </section>

      <BespokeCollection />

      <section className="bg-paper-dim py-20 sm:py-28">
        <Container>
          <SectionHeading tone="on-light" eyebrow="How It Works" title="Five Steps, One Fit." align="center" />
          <div className="mt-14">
            <BespokeProcess />
          </div>
        </Container>
      </section>

      <section className="bg-foreground py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy uppercase">Start the Process</p>
            <h2 className="font-display text-3xl leading-tight font-light text-background sm:text-4xl">
              Start your bespoke journey.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-background/60">
              Have something in mind that isn&rsquo;t in the collection above? Tell us what you have in mind and our
              bespoke team will follow up to schedule a consultation.
            </p>
          </Reveal>
          <BespokeForm />
        </Container>
      </section>
    </div>
  );
}
