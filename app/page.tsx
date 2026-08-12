import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-background px-6 py-10 sm:px-12 sm:py-14 lg:px-20 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-burgundy/20 blur-[140px] sm:h-[40rem] sm:w-[40rem]"
      />
      <div
        aria-hidden="true"
        className="bg-noise pointer-events-none absolute inset-0 opacity-[0.05]"
      />

      <header className="animate-fade-in-up relative z-10 text-center sm:text-left">
        <Image
          src="/onpointTradeMarkWhite.png"
          alt="OnPoint Clothing"
          width={2025}
          height={873}
          priority
          className="inline-block h-8 w-auto sm:h-9"
        />
      </header>

      <main className="animate-fade-in-up animation-delay-500 relative z-10 flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center sm:items-start sm:text-left">
        <div
          aria-hidden="true"
          className="animate-reveal-line animation-delay-800 h-px w-16 bg-burgundy sm:w-24"
        />
        <h1 className="max-w-3xl font-serif text-4xl leading-tight font-light text-foreground sm:text-6xl lg:text-7xl">
          The House Is Being Reimagined.
        </h1>
        <p className="max-w-md font-sans text-base leading-relaxed text-foreground/60 sm:text-lg">
          Our new collection and online store are currently being crafted.
          We&apos;ll be back soon.
        </p>
      </main>

      <footer className="animate-fade-in-up animation-delay-1100 relative z-10 flex flex-col items-center gap-2 border-t border-foreground/10 pt-6 text-center font-sans text-xs tracking-[0.2em] text-foreground/50 uppercase sm:flex-row sm:items-baseline sm:justify-between sm:text-left">
        <p>&copy; 2026 OnPoint Clothing</p>
        <p>Coming Soon</p>
      </footer>
    </div>
  );
}
