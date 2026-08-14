import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { BespokeProcess } from "@/components/bespoke/bespoke-process";
import { BespokeForm } from "@/components/bespoke/bespoke-form";

export const metadata: Metadata = {
  title: "Bespoke",
  description: "OnPoint Clothing's bespoke service — garments built to your measure.",
};

export default function BespokePage() {
  return (
    <div className="bg-background">
      <section className="relative flex h-[70vh] min-h-[480px] w-full items-end overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0">
          <MediaImage image={{ url: "placeholder:bespoke-hero-01", alt: "OnPoint Bespoke atelier" }} priority sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/25 to-background/10" />
        </div>
        <Container className="relative z-10 pb-16 sm:pb-20">
          <p className="font-sans text-xs font-medium tracking-[0.35em] text-burgundy uppercase">The Bespoke Service</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] font-light text-foreground sm:text-7xl">
            Made for you.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/65 sm:text-lg">
            Beyond ready-to-wear: a garment built to your measure, from first consultation to final fitting.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="How It Works" title="Five Steps, One Fit." align="center" />
          <div className="mt-14">
            <BespokeProcess />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            <p className="font-sans text-xs font-medium tracking-[0.35em] text-burgundy uppercase">Start the Process</p>
            <h2 className="font-serif text-3xl leading-tight font-light text-foreground sm:text-4xl">
              Start your bespoke journey.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-foreground/60">
              Tell us what you have in mind and our bespoke team will follow up to schedule a consultation.
            </p>
          </Reveal>
          <BespokeForm />
        </Container>
      </section>
    </div>
  );
}
