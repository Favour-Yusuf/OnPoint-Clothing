# OnPoint Expression Page Redesign — Design Spec

**Date:** 2026-09-01
**Status:** Approved

## Purpose

The client dislikes the current `/expression` page's arrangement and structure.
The new direction: much more expressive/experiential, image-forward, "premium,"
with far less copy — an experience, not a recap article. Runway becomes the
clear centerpiece (the client added ~157 new photos to the Cloudinary
"OnPoint Expression" folder specifically wanting "more runway, as many as
possible"), while Behind the Scenes shrinks to almost nothing.

## Scope

**In scope:** `app/(storefront)/expression/page.tsx`, every component under
`components/expression/`, and `lib/data/onpoint-expression.ts`.

**Out of scope:** the homepage's `ExpressionTeaser` component and its
`onPointExpression.homepageTeaser` image — not mentioned in the brief, left
untouched. The `/expression` nav link and route are unchanged.

## Photo Survey

A background survey reviewed all 157 new Cloudinary candidates and classified
them by event moment and quality (hero / solid / skip), matching them against
the house alt-text style. The survey report itself lived in an ephemeral
scratch directory — the durable output is the curated public-ID lists below,
which are what actually end up in the data file. Headline numbers: 33
runway-worthy shots surfaced (15 hero, 18 solid), 39 host, 25 performance, 15
red carpet, and only 2 behind-the-scenes shots judged worth keeping at all.

The user reviewed the 15 hero-quality runway candidates directly (real photos,
via the brainstorming visual companion) and selected 11 for the biggest
treatment.

## Structural Approach: "Chapters, Distilled"

Approved over two alternatives (a fully continuous unlabeled reel, and a
slow-paced editorial-spread layout) because it keeps the page's real narrative
— arrival → runway → host → performance → close — while still hitting "less
words, more images." Two rules apply everywhere:

1. **Text rule:** every chapter drops to a single short title (no eyebrow
   label, no description paragraph). The Hero keeps its title + one tagline
   line but loses its explanatory paragraph. The closing CTA keeps its
   paragraph since it's a call to action, not narration. The current
   `ExpressionIntro` section (pure text, no image) is deleted outright — it's
   the one section that is 100% the thing this redesign is removing.
2. **Breathers:** two new full-bleed, text-free images mark the transitions
   into and out of Runway, so the pacing shifts before Runway even starts
   rather than cutting straight from one heading into the next.

## Final Page Order & Content

1. **Hero** — unchanged component, copy trimmed (see below). Image unchanged
   (`ON_POINT_EXPRESSION_-106`).
2. ~~Intro~~ — deleted.
3. **Arrival** (renamed display title; data key stays `redCarpet`) — cut from
   9 images to 5: keep the existing full-bleed opener (`-72`), replace
   everything else with the survey's 4 hero-quality red-carpet shots: `-206`,
   `-193`, `-216`, `-90`.
4. **Breather 1** — `ON_POINT_EXPRESSION_-50` (landscape, security line before
   the step-and-repeat), no text. Pulled out of the red-carpet pool
   specifically to serve this transition rather than sitting in Arrival's own
   grid.
5. **Runway** — the centerpiece, 46 total images sourced from the runway
   bucket, restructured as:
   - **Opener:** `Web_9` (unchanged, full-bleed, as today).
   - **Hero band** (15 images, large-scale asymmetric grid, bigger tiles than
     the wall below): the other 4 existing cinematic shots — `Web_13`,
     `Web_14`, `Web_15`, `Web_16` — plus the 11 user-selected hero shots:
     `-376`, `-443`, `-307`, `-236`, `-475`, `-237`, `-470`, `-377`, `-481`,
     `-464`, `-445`.
   - **Wall** (29 images, dense 3–4 column grid, smaller tiles — a
     "contact-sheet" feel): the 3 hero-quality shots not picked as heroes
     (`-351`, `-235`, `-433`), all 18 solid-quality survey shots (`-439`,
     `-442`, `-480`, `-296`, `-332`, `-317`, `-320`, `-324`, `-352`, `-363`,
     `-358`, `-362`, `-375`, `-437`, `-472`, `J11A7557`, `J11A7554`, `-239`),
     and the 8 existing "look" shots (`J11A7578`, `J11A7566`, `J11A7496`,
     `J11A7502`, `J11A7570`, `J11A7562`, `J11A7552`, `J11A7508`).
6. **Breather 2** — `ON_POINT_EXPRESSION_-240` (landscape; hosts walking the
   runway, cape caught mid-motion), no text. Doubles as a narrative bridge
   into Host, since it's literally the hosts on the runway. Counted as the
   46th runway-sourced image even though it renders as a breather, not inside
   the Runway chapter itself.
7. **Host** — full replacement of the old 8-image set with all 13
   hero-quality survey shots: `-259`, `-260`, `-264`, `-263`, `-266`, `-428`,
   `-225`, `-230`, `-243`, `-245`, `-255`, `-444`, `-250`.
8. **Performance** — full replacement of the current 4-image set (itself a
   recent trim) with all 9 hero-quality survey shots: `-291`, `-299`, `-304`,
   `-487`, `-404`, `-396`, `-395`, `-274`, `-277`.
9. **Epilogue** (replaces the standalone "Behind the Scenes" section and the
   old `ExpressionLegacy` section with one combined closing chapter) — the 2
   exceptional backstage shots (`-421`, `-92`) alongside the existing legacy
   marquee image (`-105`). Legacy's copy is trimmed from two paragraphs down
   to its single opening line, "Not a departure. A continuation."
10. **Shop CTA** — unchanged.

`ExpressionBehindTheScenes` is deleted as a component; its 2 surviving images
move into the new `ExpressionEpilogue` component, which replaces
`ExpressionLegacy`.

## Component Changes

- `app/(storefront)/expression/page.tsx` — updated section order; drops
  `ExpressionIntro` and `ExpressionBehindTheScenes`/`ExpressionLegacy`
  imports in favor of `ExpressionBreather` (used twice) and
  `ExpressionEpilogue`.
- `components/expression/expression-hero.tsx` — remove the explanatory
  paragraph; keep title + tagline.
- `components/expression/expression-red-carpet.tsx` — trim to the 5-image set
  above. Internal layout simplifies accordingly (fewer grid rows).
- `components/expression/expression-breather.tsx` — **new**. A minimal
  full-bleed `Reveal` + `MediaImage`, no heading, no button, takes a single
  `ExpressionImage`. No lightbox (nothing to click into from a section with no
  other images).
- `components/expression/expression-runway.tsx` — rewritten for the three-tier
  opener/hero-band/wall structure described above, replacing the current
  two-tier `cinematic`/`looks` split.
- `components/expression/expression-host.tsx` / `expression-performance.tsx`
  — same components, new image sets, chapter title only (no eyebrow/
  description passed to `SectionHeading`).
- `components/expression/expression-behind-the-scenes.tsx` — **deleted**.
- `components/expression/expression-legacy.tsx` — **deleted**, replaced by
  `components/expression/expression-epilogue.tsx` (**new**): legacy image +
  trimmed one-line copy, plus a small 2-image cluster for the surviving
  backstage shots.
- `components/expression/expression-intro.tsx` — **deleted**.
- Chapter titles (Arrival/Runway/Host/Performance) stop passing `eyebrow`/
  `description` to the existing `SectionHeading` component — it already
  renders cleanly with just a `title`, so no changes to `SectionHeading`
  itself are needed.

## Data Model Changes (`lib/data/onpoint-expression.ts`)

- `runway` changes shape from `{ cinematic, looks }` to `{ opener, hero, wall
  }` (`opener` is a single `ExpressionImage`, `hero`/`wall` are arrays) to
  match the new three-tier structure.
- `redCarpet` array trimmed to the 5 IDs listed above.
- `host` and `performance` arrays fully replaced with the new hero-quality ID
  lists above.
- `behindTheScenes` array removed; its 2 surviving entries move under a new
  `epilogue: { backstage: [...], legacy: {...} }` shape (folding the existing
  top-level `legacy` field in).
- `hero` and `homepageTeaser` fields unchanged.
- A new top-level `breathers` field (or two inline entries referenced directly
  by the page) holds the two transition images (`-50`, `-240`); exact shape is
  an implementation detail, not load-bearing for this spec.
- Every new entry gets house-style alt text and an `orientation`, both already
  drafted from the survey/selection data above.

## Testing / Verification

No automated tests exist for this page today (it's static marketing content).
Verification is visual: run the dev server, load `/expression`, and check
each chapter renders with the right image count, the two breathers appear
with no text, the lightbox still opens/navigates correctly within each
chapter's own image set, and nothing regresses on mobile widths (the runway
wall's column count in particular needs a mobile-friendly fallback).
