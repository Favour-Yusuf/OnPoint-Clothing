import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  { number: "01", title: "Consultation", description: "A conversation about what you need — occasion, fabric, and fit." },
  { number: "02", title: "Design", description: "Cloth, cut, and detail are finalized together before anything is made." },
  { number: "03", title: "Fit", description: "A fitting to confirm proportions before construction is completed." },
  { number: "04", title: "Craft", description: "Your garment is built by hand to the specification agreed upon." },
  { number: "05", title: "Delivery", description: "A final fitting, finishing touches, and delivery of the finished piece." },
] as const;

export function BespokeProcess() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden bg-foreground/10 sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map((step, index) => (
        <Reveal key={step.number} delayMs={index * 90} className="bg-background p-8 transition-colors duration-300 hover:bg-burgundy-deep/40">
          <p className="font-display text-3xl font-light text-burgundy">{step.number}</p>
          <h3 className="mt-4 font-sans text-sm font-light tracking-[0.1em] text-foreground uppercase">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/55">{step.description}</p>
        </Reveal>
      ))}
    </div>
  );
}
