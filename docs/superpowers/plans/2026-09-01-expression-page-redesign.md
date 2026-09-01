# OnPoint Expression Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/expression` into an image-forward, minimal-text "experience" page, with Runway as the dominant chapter (46 images) and Behind the Scenes reduced to two images folded into a new closing Epilogue chapter.

**Architecture:** No new libraries or infrastructure — this is a content and layout rewrite of existing React Server/Client Components under `components/expression/`, driven by a restructured `lib/data/onpoint-expression.ts`. Every gallery section keeps the established pattern: a typed image array/object in the data file, rendered via the shared `MediaImage`, `Reveal`, and `ExpressionLightbox` components.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS. No test runner is configured for this codebase's UI — verification is `npx tsc --noEmit` (catches data/prop-shape mistakes immediately) plus manual visual checks against the running dev server, matching the spec's own Testing/Verification section.

**Spec:** `docs/superpowers/specs/2026-09-01-expression-page-redesign-design.md`

## Global Constraints

- Every chapter title is a single short string, no eyebrow, no description — pass only `title` to `SectionHeading` (Hero and the closing Shop CTA are the two exceptions and are out of scope for this change).
- Every image object in `lib/data/onpoint-expression.ts` is typed `ExpressionImage` (`CloudinaryImage & { orientation: "landscape" | "portrait" }`) with real alt text in the house style (a factual one-sentence description of what's visible).
- No automated test suite exists for this page. Each task's "test" step is `npx tsc --noEmit` (must exit 0) plus a `curl -s -o /dev/null -w "%{http_code}"` check against `http://localhost:3000/expression` (must print `200`) with the dev server already running (`npm run dev`, started once, left running across tasks).
- Never leave `app/(storefront)/expression/page.tsx` importing a component or data field that doesn't exist — every task must leave the app building.

---

## File Structure

| File | Change |
|---|---|
| `lib/data/onpoint-expression.ts` | Restructure `runway` (`{cinematic, looks}` → `{opener, hero, wall}`), trim `redCarpet` to 5 entries, add `breathers`, replace `host` (13 entries) and `performance` (9 entries), add `epilogue` (`{backstage, legacy}`), remove `behindTheScenes` and top-level `legacy` |
| `components/expression/expression-hero.tsx` | Modify — drop the explanatory paragraph |
| `components/expression/expression-red-carpet.tsx` | Modify — 5-image layout, title-only heading |
| `components/expression/expression-breather.tsx` | **Create** — minimal full-bleed, no-text image section |
| `components/expression/expression-runway.tsx` | Modify — opener/hero-band/wall three-tier layout |
| `components/expression/expression-host.tsx` | Modify — 13-image set, title-only heading |
| `components/expression/expression-performance.tsx` | Modify — 9-image set, title-only heading, comment tweak |
| `components/expression/expression-epilogue.tsx` | **Create** — legacy image/copy + 2 backstage shots |
| `components/expression/expression-intro.tsx` | **Delete** |
| `components/expression/expression-behind-the-scenes.tsx` | **Delete** |
| `components/expression/expression-legacy.tsx` | **Delete** |
| `app/(storefront)/expression/page.tsx` | Modify — final section order and imports |

---

### Task 1: Trim the Hero's copy

**Files:**
- Modify: `components/expression/expression-hero.tsx`

**Interfaces:** none (no other file consumes this component's internals).

- [ ] **Step 1: Remove the explanatory paragraph**

In `components/expression/expression-hero.tsx`, find:

```tsx
        <p className="max-w-lg font-display text-2xl leading-tight font-light text-burgundy-light sm:text-3xl">
          Where fashion finds its voice.
        </p>

        <p className="max-w-md text-base leading-relaxed text-foreground/70 sm:text-lg">
          A night staged in full color. The house steps off the rack and onto a runway of its own making.
        </p>
      </div>
```

Replace with:

```tsx
        <p className="max-w-lg font-display text-2xl leading-tight font-light text-burgundy-light sm:text-3xl">
          Where fashion finds its voice.
        </p>
      </div>
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

With the dev server running (`npm run dev` in a separate terminal if not already running), run:
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/expression`
Expected: `200`

- [ ] **Step 3: Commit**

```bash
git add components/expression/expression-hero.tsx
git commit -m "Trim Expression hero copy to title + tagline"
```

---

### Task 2: Restructure the Runway data and rewrite the Runway component

This is the centerpiece chapter: 46 total runway-sourced images (1 opener, 15 in a large "hero band," 29 in a dense "wall," and 1 more used later as a breather in Task 3).

**Files:**
- Modify: `lib/data/onpoint-expression.ts`
- Modify: `components/expression/expression-runway.tsx`

**Interfaces:**
- Produces: `onPointExpression.runway: { opener: ExpressionImage; hero: ExpressionImage[]; wall: ExpressionImage[] }` — consumed only by `ExpressionRunway`.

- [ ] **Step 1: Replace the `runway` field in the data file**

In `lib/data/onpoint-expression.ts`, find the entire `runway: { cinematic: [...], looks: [...] }` block (from `runway: {` through the matching `},` before `host: [`) and replace it with:

```ts
  runway: {
    opener: {
      publicId: "Web_9",
      alt: "A model in an angular geometric-print wrap walking the runway, GLITZ Fashion Week signage behind",
      orientation: "landscape",
    } satisfies ExpressionImage,

    hero: [
      {
        publicId: "Web_13",
        alt: "A model in a dark beaded caftan and fur hat walking the runway past a seated audience",
        orientation: "landscape",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-376",
        alt: "A model in a black cropped top and pencil skirt walking through stage fog past an \"ACTIVE ONPOINT\" screen, confident stride",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-443",
        alt: "A man in a dark trench-style robe and wide-brimmed hat walking alone down the runway path, moody amber lighting",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-307",
        alt: "A man in a red embroidered kaftan and cap walking alone down the runway path through smoke",
        orientation: "portrait",
      },
      {
        publicId: "Web_14",
        alt: "The hosts walking the runway together in matching black regalia",
        orientation: "landscape",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-236",
        alt: "The hosts walking the runway together in matching dark regalia, big screen behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-475",
        alt: "A black-and-white shot of a plus-size model in a jacquard tunic standing inside an illuminated runway frame",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-237",
        alt: "The hosts walking the runway in red-trimmed regalia, TRACE screen behind",
        orientation: "portrait",
      },
      {
        publicId: "Web_15",
        alt: "A model in a full-face helmet and dark robe walking alone through fog and light",
        orientation: "landscape",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-470",
        alt: "A model in a white plunging embellished blazer and matching shorts, voluminous hair, striking pose on the runway",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-377",
        alt: "A black-and-white shot of a model in a fitted romper with twin space-buns, mid-stride on the runway",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-481",
        alt: "A model in a dark textured mini set and dramatic feathered hat, side profile inside an illuminated mirrored runway frame",
        orientation: "portrait",
      },
      {
        publicId: "Web_16",
        alt: "A helmeted model walking toward the camera, screens reading ACE ONPOINT behind",
        orientation: "landscape",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-464",
        alt: "A plus-size model in a sage jacquard kaftan on the runway, a model in black-and-gold following behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-445",
        alt: "A black-and-white close shot of a model in a wide-brimmed hat, sunglasses, and netted gloves on the runway",
        orientation: "portrait",
      },
    ] satisfies ExpressionImage[],

    wall: [
      {
        publicId: "ON_POINT_EXPRESSION_-351",
        alt: "A model in a fur-trimmed black-and-white graphic-print caftan walking past a sculptural silver chair prop",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-235",
        alt: "A black-and-white shot of the hosts walking the runway toward camera, disco ball prop in the foreground",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-433",
        alt: "The hosts walking the runway past a \"Just Onpoint\" script screen amid festive lighting",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-439",
        alt: "A man in an embroidered ivory agbada and sunglasses on the runway, red slides, ON POINT EXPRESSION signage behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-442",
        alt: "A man in a black kaftan and velvet cap with layered red beads, smiling as he walks the runway",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-480",
        alt: "A model in a black fringed crop top and shorts walking past the Hennessy-branded illuminated runway installation",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-296",
        alt: "Two men in ceremonial red and black velvet robes walking the runway together",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-332",
        alt: "Two models on the runway past a mirrored installation, one in a dark bejeweled robe walking, one standing still in green",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-317",
        alt: "A model in a dark embellished kaftan and cap posed still inside an illuminated mirrored runway box, crowd reflected behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-320",
        alt: "A model in a black velvet embroidered kaftan and red cap standing in profile inside an illuminated runway box",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-324",
        alt: "A model in a white tie-dye ruffled tunic and dark wide-leg trousers walking between illuminated runway panels",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-352",
        alt: "A man in a rust agbada walking barefoot down the runway path, disco ball prop in the foreground",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-363",
        alt: "A model in a mustard sleeveless dress walking through an illuminated glass runway installation, seated guests visible behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-358",
        alt: "A man in a rust kaftan and cap standing still inside an illuminated runway box, crew and photographers visible at the edges",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-362",
        alt: "A man in a blue-and-white graphic plaid top and cornrows walking the runway past the Expression entrance signage",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-375",
        alt: "A black-and-white long shot of a model in a white crop set walking through heavy stage fog past a repeating mural",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-437",
        alt: "A man in a dark brown agbada, cap, and sunglasses walking the runway past red stage lighting",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-472",
        alt: "A black-and-white side-profile shot of a model in a jacquard cape walking the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7557",
        alt: "A model's back view in white Onpoint-branded activewear crop top and biker shorts, hair in braided buns",
        orientation: "portrait",
      },
      {
        publicId: "J11A7554",
        alt: "A model in a black top and dark maxi skirt walking off the runway into stage fog, jacket in hand",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-239",
        alt: "A black-and-white candid shot of the hosts walking and conversing along the runway",
        orientation: "landscape",
      },
      {
        publicId: "J11A7578",
        alt: "Two models crossing paths on the runway, one in a white cutout bodysuit, one in a matching cream crop set",
        orientation: "portrait",
      },
      {
        publicId: "J11A7566",
        alt: "A model in a white cutout bodysuit, back to the camera, carrying a white helmet",
        orientation: "portrait",
      },
      {
        publicId: "J11A7496",
        alt: "A model in a fur-trimmed ivory jacquard vest and beaded cap on the runway, side profile",
        orientation: "portrait",
      },
      {
        publicId: "J11A7502",
        alt: "A model in a fur-trimmed ivory jacquard vest and beaded cap, close portrait",
        orientation: "portrait",
      },
      {
        publicId: "J11A7570",
        alt: "A model in a chartreuse wrap top on the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7562",
        alt: "A model in a cream cutout crop top and matching trousers on the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7552",
        alt: "A model in a black draped, sheer-layered look walking through a fog-lit doorway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7508",
        alt: "A model in a dark beaded caftan and velvet hat on the runway",
        orientation: "portrait",
      },
    ] satisfies ExpressionImage[],
  },
```

- [ ] **Step 2: Verify the data file still compiles**

Run: `npx tsc --noEmit`
Expected: fails, because `expression-runway.tsx` still references the old `cinematic`/`looks` shape — this confirms the old component is now correctly out of sync (proceed to Step 3 to fix it).

- [ ] **Step 3: Rewrite `expression-runway.tsx`**

Replace the entire contents of `components/expression/expression-runway.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";
import type { ExpressionImage } from "@/lib/data/onpoint-expression";

export function ExpressionRunway() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { opener, hero, wall } = onPointExpression.runway;
  const images: ExpressionImage[] = [opener, ...hero, ...wall];

  function open(image: ExpressionImage) {
    setOpenIndex(images.indexOf(image));
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading title="Runway" />
      </Container>

      <Reveal className="relative mt-14 aspect-16/9 w-full">
        <button type="button" onClick={() => open(opener)} aria-label={`Open image: ${opener.alt}`} className="absolute inset-0 block">
          <MediaImage image={opener} sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
        </button>
      </Reveal>

      {/* Hero band: the standout shots at large scale. Landscape entries span
          both columns so the four wide cinematic frames break up the mostly
          portrait grid instead of clustering together. */}
      <Container className="mt-4 sm:mt-5">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {hero.map((image) => (
            <Reveal
              key={image.publicId}
              className={`relative w-full ${
                image.orientation === "landscape" ? "col-span-2 aspect-16/9" : "aspect-4/5"
              }`}
            >
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage
                    image={image}
                    sizes={
                      image.orientation === "landscape"
                        ? "(min-width: 1024px) 92vw, 100vw"
                        : "(min-width: 1024px) 23vw, 46vw"
                    }
                  />
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Wall: the dense "contact sheet" of every remaining runway shot. */}
        <div className="mt-16 grid grid-cols-2 gap-3 sm:mt-24 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {wall.map((image) => (
            <Reveal
              key={image.publicId}
              className={`relative w-full ${
                image.orientation === "landscape" ? "col-span-2 aspect-16/9 sm:col-span-3 lg:col-span-2" : "aspect-4/5"
              }`}
            >
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden bg-foreground/5">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 32vw, 46vw" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      {openIndex !== null ? (
        <ExpressionLightbox images={images} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      ) : null}
    </section>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: exits 0.

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/expression`
Expected: `200`

Open `http://localhost:3000/expression` in a browser and confirm: the Runway chapter now shows one opener image, a 15-image hero band (with 4 wide landscape frames breaking up the grid), and a large dense wall below it. Click a few images to confirm the lightbox opens and next/previous navigation moves across all 46 images without erroring.

- [ ] **Step 5: Commit**

```bash
git add lib/data/onpoint-expression.ts components/expression/expression-runway.tsx
git commit -m "Rebuild Runway as a 46-image opener/hero-band/wall section"
```

---

### Task 3: Trim Arrival (Red Carpet) to 5 images and add the two breather images

**Files:**
- Modify: `lib/data/onpoint-expression.ts`
- Modify: `components/expression/expression-red-carpet.tsx`

**Interfaces:**
- Produces: `onPointExpression.redCarpet: ExpressionImage[]` (5 entries) — consumed only by `ExpressionRedCarpet`.
- Produces: `onPointExpression.breathers: { intoRunway: ExpressionImage; intoHost: ExpressionImage }` — consumed by `ExpressionBreather` usages added to `page.tsx` in Task 8.

- [ ] **Step 1: Replace the `redCarpet` array and add `breathers`**

In `lib/data/onpoint-expression.ts`, replace the entire `redCarpet: [...]` array (from `redCarpet: [` through its closing `],`) with:

```ts
  redCarpet: [
    {
      publicId: "ON_POINT_EXPRESSION_-72",
      alt: "The red carpet arrivals path, lined with step-and-repeat banners and palm fronds",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-206",
      alt: "A close portrait of a guest in an ornate gold Egyptian-style collar necklace and beige suit, holding a red cup",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-193",
      alt: "A guest in a burgundy-and-green striped kaftan posing dramatically beside the illuminated ON POINT EXPRESSION marquee letters",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-216",
      alt: "A guest in a black plunging halter jumpsuit checking her phone on a lounge cushion, holding a Hennessy cup",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-90",
      alt: "A guest's back view showing the vivid print of her tie-dye kaftan, in conversation with another guest",
      orientation: "portrait",
    },
  ] satisfies ExpressionImage[],
```

Then, directly after the `redCarpet` array's closing `],` (still before the `runway:` field), add:

```ts
  breathers: {
    intoRunway: {
      publicId: "ON_POINT_EXPRESSION_-50",
      alt: "OnPoint Expression's security detail lined up in suits and sunglasses before the step-and-repeat wall",
      orientation: "landscape",
    },
    intoHost: {
      publicId: "ON_POINT_EXPRESSION_-240",
      alt: "The hosts walking the runway, the female host's cape caught mid-motion",
      orientation: "landscape",
    },
  } satisfies { intoRunway: ExpressionImage; intoHost: ExpressionImage },

```

- [ ] **Step 2: Rewrite `expression-red-carpet.tsx`**

Replace the entire contents of `components/expression/expression-red-carpet.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";

export function ExpressionRedCarpet() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = onPointExpression.redCarpet;
  const [wide, ...rest] = images;

  function open(image: (typeof images)[number]) {
    setOpenIndex(images.indexOf(image));
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading title="Arrival" />
      </Container>

      <Reveal className="relative mt-14 aspect-3/2 w-full sm:aspect-21/9">
        <button type="button" onClick={() => open(wide)} aria-label={`Open image: ${wide.alt}`} className="absolute inset-0 block">
          <MediaImage image={wide} sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
        </button>
      </Reveal>

      <Container className="mt-16 sm:mt-24">
        <div className="grid grid-cols-2 items-end gap-4 sm:gap-6 lg:grid-cols-4">
          {rest.map((image, i) => (
            <Reveal key={image.publicId} delayMs={i * 90} className={`relative aspect-4/5 w-full ${i === 1 ? "lg:-mt-12" : ""}`}>
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 1024px) 23vw, 46vw" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      {openIndex !== null ? (
        <ExpressionLightbox images={images} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      ) : null}
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: exits 0. (`breathers` is unused until Task 8 — an unused exported object is not a type error.)

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/expression`
Expected: `200`

Confirm in the browser that Arrival now shows one full-bleed opener plus 4 portrait shots.

- [ ] **Step 4: Commit**

```bash
git add lib/data/onpoint-expression.ts components/expression/expression-red-carpet.tsx
git commit -m "Trim Arrival to 5 images and add the two breather images"
```

---

### Task 4: Create the `ExpressionBreather` component

**Files:**
- Create: `components/expression/expression-breather.tsx`

**Interfaces:**
- Consumes: `ExpressionImage` (from `lib/data/onpoint-expression.ts`), `MediaImage` (from `components/ui/media-image`), `Reveal` (from `components/ui/reveal`).
- Produces: `ExpressionBreather({ image }: { image: ExpressionImage })` — a default-exportless named component, consumed by `page.tsx` in Task 8.

- [ ] **Step 1: Write the component**

Create `components/expression/expression-breather.tsx`:

```tsx
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import type { ExpressionImage } from "@/lib/data/onpoint-expression";

/**
 * A full-bleed, text-free image used only as a pacing beat between chapters —
 * no heading, no lightbox, nothing to interact with. It exists purely to let
 * the page breathe before the next named chapter starts.
 */
export function ExpressionBreather({ image }: { image: ExpressionImage }) {
  return (
    <Reveal className="relative aspect-3/2 w-full sm:aspect-21/9">
      <MediaImage image={image} sizes="100vw" />
    </Reveal>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exits 0. (Not yet imported anywhere — an unused-but-valid module is not a type error.)

- [ ] **Step 3: Commit**

```bash
git add components/expression/expression-breather.tsx
git commit -m "Add ExpressionBreather, a text-free full-bleed transition image"
```

---

### Task 5: Replace the Host image set

**Files:**
- Modify: `lib/data/onpoint-expression.ts`
- Modify: `components/expression/expression-host.tsx`

**Interfaces:**
- Produces: `onPointExpression.host: ExpressionImage[]` (13 entries) — consumed only by `ExpressionHost`.

- [ ] **Step 1: Replace the `host` array**

In `lib/data/onpoint-expression.ts`, replace the entire `host: [...]` array with:

```ts
  host: [
    {
      publicId: "ON_POINT_EXPRESSION_-259",
      alt: "The hosts sharing the stage beside a disco ball prop, a red-dress campaign image glowing on the screen behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-260",
      alt: "The hosts mid-address together in front of an ACTIVE ONPOINT screen",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-264",
      alt: "A close portrait of the male host mid-gesture, gold beetle brooch and beaded necklaces visible",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-263",
      alt: "A close profile portrait of the female host, statement earring catching the light",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-266",
      alt: "The hosts face to face mid-exchange, warm smile, dramatic backlighting",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-428",
      alt: "A black-and-white full-length shot of the female host walking with a microphone past a sculptural white installation",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-225",
      alt: "The hosts sharing a warm laugh together, full body, in front of an orange stage curtain",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-230",
      alt: "The hosts full body with arms open mid-gesture, colorful seated crowd and disco ball prop behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-243",
      alt: "The hosts sharing a joyful high-five moment, disco ball prop in the foreground",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-245",
      alt: "A black-and-white shot of the hosts fist-bumping mid-address",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-255",
      alt: "A black-and-white close portrait of the male host, fist raised, \"Just Onpoint\" script glowing behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-444",
      alt: "The female host mid-dance move, playful energy, \"Just Onpoint\" screen behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-250",
      alt: "A black-and-white shot of the hosts both addressing the crowd side by side",
      orientation: "portrait",
    },
  ] satisfies ExpressionImage[],
```

- [ ] **Step 2: Drop the eyebrow/description from the Host heading**

In `components/expression/expression-host.tsx`, find:

```tsx
        <SectionHeading
          tone="on-light"
          eyebrow="The Host"
          title="The voice that holds the room."
          description="Every transition, every beat of the night, carried by two people who never let the energy drop."
        />
```

Replace with:

```tsx
        <SectionHeading title="Host" />
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: exits 0.

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/expression`
Expected: `200`

Confirm in the browser: the Host chapter shows a title-only heading and 13 images (1 primary + 12 in the grid below).

- [ ] **Step 4: Commit**

```bash
git add lib/data/onpoint-expression.ts components/expression/expression-host.tsx
git commit -m "Replace Host image set with 13 hero-quality shots, title-only heading"
```

---

### Task 6: Replace the Performance image set

**Files:**
- Modify: `lib/data/onpoint-expression.ts`
- Modify: `components/expression/expression-performance.tsx`

**Interfaces:**
- Produces: `onPointExpression.performance: ExpressionImage[]` (9 entries) — consumed only by `ExpressionPerformance`.

- [ ] **Step 1: Replace the `performance` array**

In `lib/data/onpoint-expression.ts`, replace the entire `performance: [...]` array with:

```ts
  performance: [
    {
      publicId: "ON_POINT_EXPRESSION_-291",
      alt: "The performer presenting the jeweled crown toward camera, a CROWN title screen glowing behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-299",
      alt: "A man in a black velvet cape performing a crowning gesture on another, the pale performer looking on",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-304",
      alt: "A man in a red cap and black cape raising a curved horn triumphantly overhead amid smoke",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-487",
      alt: "Three men in dark ceremonial robes on stage, one raising a fist triumphantly",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-404",
      alt: "A performer with platinum hair and a shiny graphic bomber jacket singing into a microphone onstage",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-396",
      alt: "A black-and-white shot of two performers trading vocals face to face on the runway stage",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-395",
      alt: "A performer in a leather jacket and skirt singing on the illuminated stage, colorful seated audience behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-274",
      alt: "A performer in a cream jacket gesturing dramatically with a newspaper prop, campaign graphic glowing on the screen behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-277",
      alt: "A black-and-white shot of the performer reading a newspaper prop with a comic flourish onstage",
      orientation: "portrait",
    },
  ] satisfies ExpressionImage[],
```

- [ ] **Step 2: Drop the eyebrow/description and update the tiling comment**

In `components/expression/expression-performance.tsx`, find:

```tsx
// Every source photo is a portrait crop, so size variation here comes from
// deliberate grid spans (with object-cover accepting the crop) rather than
// from each image's native aspect ratio — one anchor image plus two smaller
// beats and a closing wide band, instead of a uniform grid.
const SPANS = [
```

Replace with:

```tsx
// Every source photo is (mostly) a portrait crop, so size variation here
// comes from deliberate grid spans rather than each image's native aspect
// ratio. The 4-tile unit (anchor, small, small, wide) repeats via
// `index % SPANS.length` to tile however many images the section holds.
const SPANS = [
```

Then find:

```tsx
        <SectionHeading
          eyebrow="Performance"
          title="The stage, at full volume."
          description="Sound and spectacle, staged like the rest of the night with the same attention as the clothes."
        />
```

Replace with:

```tsx
        <SectionHeading title="Performance" />
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: exits 0.

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/expression`
Expected: `200`

Confirm in the browser: the Performance chapter shows a title-only heading and 9 images tiling in the anchor/small/small/wide pattern (the last image starts a fresh partial group — that's expected and fine).

- [ ] **Step 4: Commit**

```bash
git add lib/data/onpoint-expression.ts components/expression/expression-performance.tsx
git commit -m "Replace Performance image set with 9 hero-quality shots, title-only heading"
```

---

### Task 7: Create the Epilogue chapter and its data

This task is additive only — it does not yet remove `behindTheScenes`, `legacy`, `ExpressionBehindTheScenes`, or `ExpressionLegacy`, and `ExpressionEpilogue` is not yet imported by `page.tsx`. That happens in Task 8, so the app keeps building at every step.

**Files:**
- Modify: `lib/data/onpoint-expression.ts`
- Create: `components/expression/expression-epilogue.tsx`

**Interfaces:**
- Produces: `onPointExpression.epilogue: { backstage: ExpressionImage[]; legacy: CloudinaryImage }` — consumed only by `ExpressionEpilogue`.
- Produces: `ExpressionEpilogue()` — a named component, consumed by `page.tsx` in Task 8.

- [ ] **Step 1: Add the `epilogue` field**

In `lib/data/onpoint-expression.ts`, directly after the `behindTheScenes` array's closing `],` (still before the top-level `legacy:` field), add:

```ts
  epilogue: {
    backstage: [
      {
        publicId: "ON_POINT_EXPRESSION_-421",
        alt: "A black-and-white close embrace between two guests, one laughing broadly in sunglasses",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-92",
        alt: "A warm backstage embrace between two guests, a stylist working in the background",
        orientation: "landscape",
      },
    ] satisfies ExpressionImage[],
    legacy: {
      publicId: "ON_POINT_EXPRESSION_-105",
      alt: "The OnPoint Expression marquee glowing at dusk",
    } satisfies CloudinaryImage,
  },

```

- [ ] **Step 2: Write `ExpressionEpilogue`**

Create `components/expression/expression-epilogue.tsx`:

```tsx
import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { onPointExpression } from "@/lib/data/onpoint-expression";

/**
 * The closing chapter: the legacy marquee image with a single trimmed line
 * of copy, followed by the two backstage shots the photo survey judged
 * worth keeping. Deliberately non-interactive (no lightbox) — this is a
 * quiet closing beat, not another gallery to click through.
 */
export function ExpressionEpilogue() {
  const { legacy, backstage } = onPointExpression.epilogue;

  return (
    <section className="relative overflow-hidden bg-burgundy-deep">
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
        <div className="relative order-1 aspect-4/5 w-full lg:aspect-auto lg:min-h-[560px]">
          <MediaImage image={legacy} sizes="(min-width: 1024px) 50vw, 100vw" />
          <div className="absolute inset-0 bg-linear-to-l from-burgundy-deep/40 to-transparent" />
        </div>

        <Reveal className="relative order-2 flex flex-col justify-center gap-6 px-6 py-20 sm:px-10 lg:py-0 lg:pr-16 lg:pl-16 xl:pr-20">
          <span className="h-px w-16 bg-burgundy-light" aria-hidden="true" />
          <h2 className="max-w-md font-display text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">
            Not a departure. A continuation.
          </h2>
        </Reveal>
      </div>

      <Container className="relative py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {backstage.map((image) => (
            <Reveal
              key={image.publicId}
              className={`relative w-full overflow-hidden ${image.orientation === "landscape" ? "aspect-3/2" : "aspect-4/5"}`}
            >
              <MediaImage image={image} sizes="(min-width: 640px) 50vw, 100vw" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: exits 0.

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/expression`
Expected: `200` (page is unchanged visually — `ExpressionEpilogue` isn't wired in yet).

- [ ] **Step 4: Commit**

```bash
git add lib/data/onpoint-expression.ts components/expression/expression-epilogue.tsx
git commit -m "Add ExpressionEpilogue component and its data (not yet wired into the page)"
```

---

### Task 8: Wire the final page order and delete retired files

**Files:**
- Modify: `app/(storefront)/expression/page.tsx`
- Modify: `lib/data/onpoint-expression.ts`
- Delete: `components/expression/expression-intro.tsx`
- Delete: `components/expression/expression-behind-the-scenes.tsx`
- Delete: `components/expression/expression-legacy.tsx`

**Interfaces:** none produced — this is the final assembly task.

- [ ] **Step 1: Rewrite `page.tsx`**

Replace the entire contents of `app/(storefront)/expression/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ExpressionHero } from "@/components/expression/expression-hero";
import { ExpressionRedCarpet } from "@/components/expression/expression-red-carpet";
import { ExpressionBreather } from "@/components/expression/expression-breather";
import { ExpressionRunway } from "@/components/expression/expression-runway";
import { ExpressionHost } from "@/components/expression/expression-host";
import { ExpressionPerformance } from "@/components/expression/expression-performance";
import { ExpressionEpilogue } from "@/components/expression/expression-epilogue";
import { onPointExpression } from "@/lib/data/onpoint-expression";

export const metadata: Metadata = {
  title: "OnPoint Expression",
  description: "Where fashion finds its voice — inside OnPoint Clothing's flagship fashion event.",
};

export default function ExpressionPage() {
  return (
    <div className="bg-background">
      <ExpressionHero />
      <ExpressionRedCarpet />
      <ExpressionBreather image={onPointExpression.breathers.intoRunway} />
      <ExpressionRunway />
      <ExpressionBreather image={onPointExpression.breathers.intoHost} />
      <ExpressionHost />
      <ExpressionPerformance />
      <ExpressionEpilogue />

      <section className="relative overflow-hidden border-t border-burgundy/25 bg-background py-28 sm:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-160 w-160 -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy/20 blur-[160px]"
        />
        <Container className="relative z-10 flex flex-col items-center gap-8 text-center">
          <span className="h-px w-12 bg-burgundy" aria-hidden="true" />
          <h2 className="font-display text-4xl leading-[1.05] font-light text-foreground sm:text-6xl">
            Discover <em className="text-burgundy-light italic">the collection.</em>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-foreground/65">
            Expression is the stage. The clothes are always waiting on the other side of it.
          </p>
          <Button href="/shop" size="lg">
            Shop OnPoint
          </Button>
        </Container>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Remove the now-redundant `behindTheScenes` and `legacy` fields**

In `lib/data/onpoint-expression.ts`, delete the entire `behindTheScenes: [...]` array (now superseded by `epilogue.backstage`) and the entire top-level `legacy: {...}` field (now superseded by `epilogue.legacy`) — everything the two exceptional backstage shots and the marquee image needed already lives under `epilogue` from Task 7.

- [ ] **Step 3: Delete the retired component files**

```bash
git rm components/expression/expression-intro.tsx
git rm components/expression/expression-behind-the-scenes.tsx
git rm components/expression/expression-legacy.tsx
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: exits 0 — this is the step that would catch a leftover reference to any deleted file or field.

Run: `npm run lint`
Expected: exits 0 (or only pre-existing warnings unrelated to this change).

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/expression`
Expected: `200`

Open `http://localhost:3000/expression` and walk the whole page top to bottom, confirming the order: Hero → Arrival → breather (no text) → Runway (opener, hero band, wall) → breather (no text) → Host → Performance → Epilogue (legacy image/copy + 2 backstage shots) → Shop CTA. Confirm no chapter shows an eyebrow label or description paragraph except the Shop CTA.

- [ ] **Step 5: Commit**

```bash
git add app/\(storefront\)/expression/page.tsx lib/data/onpoint-expression.ts
git commit -m "Wire final Expression page order; retire Intro, Behind the Scenes, and Legacy"
```

---

### Task 9: Full visual QA pass

**Files:** none (verification only).

- [ ] **Step 1: Type-check and lint one more time**

Run: `npx tsc --noEmit`
Expected: exits 0.

Run: `npm run lint`
Expected: exits 0 (or only pre-existing warnings).

- [ ] **Step 2: Production build sanity check**

Run: `npm run build`
Expected: build succeeds (this also catches any Next.js-specific issue `tsc --noEmit` alone wouldn't, e.g. an `<img>` misconfiguration).

- [ ] **Step 3: Manual walkthrough at desktop width**

With the dev server running, open `http://localhost:3000/expression` at a desktop viewport width (e.g. 1440px) and confirm:
- Every chapter title is a single line, no eyebrow, no description (Hero and the closing Shop CTA excepted).
- The two breather images render full-bleed with no text anywhere on them.
- Runway visibly dominates the page — its combined hero band + wall is far taller/denser than any other chapter.
- The lightbox opens from a click in every chapter that has one (Arrival, Runway, Host, Performance) and next/previous navigation stays within that chapter's own images. The Epilogue's 2 images are not clickable (by design).

- [ ] **Step 4: Manual walkthrough at mobile width**

Resize to a mobile viewport width (e.g. 390px) and re-check the same page. Confirm no image grid overflows horizontally, the Runway wall's 2-column mobile layout is legible (not so dense that individual images become illegibly small), and the breather images still read as full-bleed.

- [ ] **Step 5: Final commit (if any polish fixes were needed)**

If Steps 3–4 surfaced a real issue, fix it, re-run Steps 1–2, then:

```bash
git add -A
git commit -m "Polish Expression page redesign after visual QA"
```

If no issues were found, no commit is needed for this task.
