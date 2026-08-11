# Coming Soon Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default Create Next App landing page with a premium, editorial "Coming Soon" page for OnPoint Clothing.

**Architecture:** Three layers, built bottom-up: (1) design tokens and fonts (colors, serif font, motion keyframes) added to `app/globals.css` and `app/layout.tsx`, (2) the page markup itself in `app/page.tsx` consuming those tokens, (3) a verification pass (lint, type check, production build, manual responsive/accessibility/motion QA). No test framework exists in this project and none is being added — verification is lint/typecheck/build plus manual browser QA, per the spec's Verification Plan.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (CSS-based `@theme inline` tokens), `next/font/google`. No new npm dependencies.

## Global Constraints

- No new npm dependencies and no new UI library (spec: Technical Approach).
- No email capture / notify form — page is purely editorial (spec: Content, Out of Scope).
- Background is always near-black (`#0a0a0a`); do not vary by `prefers-color-scheme` (spec: Palette) — this fixed-dark design replaces the old light/dark toggle in `globals.css`.
- Burgundy (`~#6d0f1f`) is decorative/accent only — never used for body text (spec: Palette).
- Headline copy is exactly: "The House Is Being Reimagined." (spec: Content).
- Supporting copy is exactly: "Our new collection and online store are currently being crafted. We'll be back soon." (spec: Content).
- Footer copy is exactly: "© 2026 OnPoint Clothing" and "Coming Soon" (spec: Content).
- Serif font is Cormorant Garamond via `next/font/google`; sans stays the existing Geist Sans — no other new fonts (spec: Typography).
- All motion must be pure CSS, slow/understated, and fully disabled under `prefers-reduced-motion: reduce` (spec: Motion).
- Decorative elements (glow, grain, accent rule) must be `aria-hidden="true"` (spec: Accessibility).
- Composition must stay intentional (not just stacked) at 375px, 768px, 1440px, and large desktop widths (spec: Layout).

---

### Task 1: Design foundation — color tokens, serif font, motion primitives

**Files:**
- Modify: `app/globals.css` (full replacement of content)
- Modify: `app/layout.tsx` (full replacement of content)

**Interfaces:**
- Produces (consumed by Task 2):
  - Tailwind color utilities: `bg-background`, `text-foreground` (existing, now fixed-dark values), `bg-burgundy` / `text-burgundy` / `border-burgundy` (new), usable with opacity modifiers e.g. `bg-burgundy/20`.
  - Tailwind font utility: `font-serif` (new; maps to Cormorant Garamond), alongside existing `font-sans` / `font-mono`.
  - CSS utility classes: `.animate-fade-in-up`, `.animate-reveal-line`, `.animation-delay-200`, `.animation-delay-500`, `.animation-delay-800`, `.animation-delay-1100`, `.bg-noise` — all defined in `app/globals.css`, all no-ops under `prefers-reduced-motion: reduce` (the two `.animate-*` classes render in their final state — opaque, untransformed — when reduced motion is requested).
  - `metadata.title` = `"OnPoint Clothing — Coming Soon"`, `metadata.description` = `"Our new collection and online store are currently being crafted. We'll be back soon."`, set in `app/layout.tsx`.

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --background: #0a0a0a;
  --foreground: #f2f0ee;
  --color-burgundy: #6d0f1f;
  --color-burgundy-glow: #7a1526;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-burgundy: var(--color-burgundy);
  --color-burgundy-glow: var(--color-burgundy-glow);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-serif: var(--font-serif);
}

body {
  background: var(--background);
  color: var(--foreground);
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes reveal-line {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fade-in-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-reveal-line {
  transform-origin: left;
  opacity: 0;
  animation: reveal-line 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-800 {
  animation-delay: 0.8s;
}

.animation-delay-1100 {
  animation-delay: 1.1s;
}

.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-reveal-line {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

This removes the old `prefers-color-scheme: dark` override block (the page is
intentionally always-dark, per the Global Constraints) and the old
`font-family: Arial, Helvetica, sans-serif;` body rule (page content sets its
own font utilities directly).

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "OnPoint Clothing — Coming Soon",
  description:
    "Our new collection and online store are currently being crafted. We'll be back soon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify it builds and type-checks**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run lint`
Expected: `No ESLint warnings or errors` (the existing `app/page.tsx` will still
reference the old CNA markup at this point — that's fine, it will still pass
lint; it gets replaced in Task 2).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "Add burgundy/black design tokens, serif font, and motion primitives"
```

---

### Task 2: Build the Coming Soon page

**Files:**
- Modify: `app/page.tsx` (full replacement of content)

**Interfaces:**
- Consumes (from Task 1): `bg-background`, `text-foreground`, `bg-burgundy`,
  `font-serif`, `font-sans`, `.animate-fade-in-up`, `.animate-reveal-line`,
  `.animation-delay-{200,500,800,1100}`, `.bg-noise`.
- Produces: default export `Home()` rendering the full Coming Soon page —
  no other module depends on this component.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
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
        <p className="font-sans text-xs font-medium tracking-[0.35em] text-foreground/70 uppercase">
          OnPoint Clothing
        </p>
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
```

- [ ] **Step 2: Verify it builds and type-checks**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

Run: `npm run lint`
Expected: `No ESLint warnings or errors`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Build editorial Coming Soon page for OnPoint Clothing"
```

---

### Task 3: Verification — build, responsive, motion, and accessibility QA

**Files:** none (verification only).

**Interfaces:** none — this task consumes the finished page from Tasks 1–2
and produces no code.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build completes successfully with no type or lint errors.

- [ ] **Step 2: Start the dev server and open it in a browser**

Run: `npm run dev`
Open `http://localhost:3000` in a browser.

- [ ] **Step 3: Check composition at each required breakpoint**

Using browser dev tools device toolbar, check the page at 375px, 768px,
1440px, and 1920px widths. At each width, confirm:
- The wordmark, headline, supporting copy, and footer are all visible
  without unwanted overlap or clipping.
- The composition is not simply center-stacked at every size — footer
  splits left/right from `sm:` (640px) up, header/main text align left
  from `sm:` up.
- The burgundy accent line and background glow are visible but subtle.

- [ ] **Step 4: Check reduced-motion behavior**

In Chrome DevTools: Rendering tab → "Emulate CSS media feature
prefers-reduced-motion" → "reduce". Reload the page.
Expected: wordmark, accent line, headline, paragraph, and footer are all
visible immediately at full opacity with no fade/slide-in and no delay.

- [ ] **Step 5: Check contrast and semantics**

- Confirm off-white body/headline text against the near-black background
  is easily readable (no burgundy-on-black text anywhere).
- Confirm the DOM uses `header` / `main` with one `h1` / `footer`, and that
  the glow, grain, and accent-line divs all carry `aria-hidden="true"`.

- [ ] **Step 6: Stop the dev server**

Stop the `npm run dev` process (Ctrl+C in its terminal, or kill the
background task).

No commit for this task — it's verification-only. If any check fails, fix
the issue in the relevant file from Task 1 or Task 2 and re-run the
affected steps above before considering the plan complete.
