# Coming Soon Page — Design Spec

**Date:** 2026-08-11
**Status:** Approved

## Purpose

Replace the default Create Next App landing page with a temporary "Under
Construction / Coming Soon" page for OnPoint Clothing, a fashion ecommerce
brand whose full site is being rebuilt. This page will be shown on the
production domain in the interim. It must read as a premium, editorial
fashion-brand statement, not a generic SaaS placeholder.

## Content

- Wordmark (top): "OnPoint Clothing"
- Headline (center): "The House Is Being Reimagined."
- Supporting copy (below headline): "Our new collection and online store are
  currently being crafted. We'll be back soon."
- Footer (bottom): "© 2026 OnPoint Clothing" and "Coming Soon"
- No email capture / notify form — the page is purely editorial, no
  interactive elements beyond standard page chrome.

## Visual Design

### Palette

- Background: near-black (`#0a0a0a`)
- Primary text: off-white (`#f2f0ee`)
- Accent: deep burgundy (~`#6d0f1f`), used sparingly — a thin rule near the
  headline and a very restrained off-center radial glow in the background.
  Burgundy is not used for body text (contrast/legibility risk); it's a
  decorative/geometric accent only.

### Typography

- Headline/serif: **Cormorant Garamond** (Google Font via `next/font/google`),
  loaded as a new CSS variable alongside the existing Geist fonts in
  `app/layout.tsx`. Used for the `h1` headline and the top wordmark.
- Supporting/sans: existing **Geist Sans** (already configured in the
  project) — used for the supporting paragraph and footer text. No new sans
  font is introduced.

### Layout

Full-viewport (`min-h-dvh`), `flex flex-col justify-between`, generous
responsive padding (tighter on mobile, wider on desktop/large desktop).

- **Top:** small uppercase, letter-spaced "OnPoint Clothing" wordmark,
  serves as the brand mark since no logo asset exists in the project.
- **Center:** `h1` headline in Cormorant Garamond with responsive
  `clamp()`-based sizing, a thin burgundy horizontal rule near it as the
  geometric accent, and the supporting paragraph in Geist Sans below,
  muted off-white/gray, constrained to a readable max-width.
- **Bottom:** footer row with "© 2026 OnPoint Clothing" and "Coming Soon" —
  stacked/centered on mobile, split left/right at larger breakpoints, above
  a hairline top border (low-opacity white).

Composition must remain intentional (not simply stacked/centered blocks) at
375px, 768px, 1440px, and large desktop widths.

### Background treatment

Background stays black. Add:
- A very restrained, off-center burgundy radial glow (low opacity, large
  soft blur).
- A faint CSS-based grain/texture to avoid a flat look.

Both are decorative and marked `aria-hidden="true"`.

## Motion

Pure CSS, no JS/animation library:

- Staggered fade-in + slight upward drift on load, in order: wordmark →
  headline → paragraph → footer. Slow and understated (~1.2–1.6s total,
  eased), not a bouncy/playful feel.
- The burgundy rule gets a delayed, subtle reveal (e.g. width/opacity
  transition) after the headline appears.
- All motion wrapped so `@media (prefers-reduced-motion: reduce)` disables
  it — content appears immediately in its final state with no transform/
  opacity animation.

## Accessibility

- Semantic structure: `header`/wordmark, `main` with `h1` headline and
  supporting `p`, `footer` for the bottom row.
- Text contrast: off-white on near-black background comfortably passes
  WCAG AA for both headline and body text.
- Decorative elements (glow, grain, accent rule if purely ornamental) get
  `aria-hidden="true"`.
- No interactive elements are introduced, so no new keyboard-navigation
  surface; page remains keyboard-safe by default.
- Respects `prefers-reduced-motion` as described above.

## Technical Approach

- **`app/page.tsx`**: full rewrite as the Coming Soon page (currently just
  CNA boilerplate — safe to replace entirely, this is the only page in the
  app).
- **`app/layout.tsx`**: add `Cormorant_Garamond` from `next/font/google` as
  a new CSS variable (pattern matches existing `Geist`/`Geist_Mono` setup);
  update `metadata` (`title`, `description`) to reflect the brand and the
  coming-soon state instead of the CNA defaults.
- **`app/globals.css`**: add `--color-burgundy` (and any supporting shade)
  to `:root` and `@theme inline` following the existing
  `--color-background`/`--color-foreground` pattern so Tailwind utilities
  like `text-burgundy`/`bg-burgundy`/`border-burgundy` work; add the new
  `--font-serif` mapping; add the fade-in-up `@keyframes` and the
  `prefers-reduced-motion` override.
- No new npm dependencies. No new UI library. No changes to unrelated
  files (`public/*.svg` assets are left as-is, not referenced by the new
  page).

## Out of Scope

- Email capture / notify-me form.
- Social links.
- Any backend, API route, or data fetching.
- Removing/cleaning up the unused default CNA public assets (`next.svg`,
  `vercel.svg`, etc.) — not part of this task.

## Verification Plan

1. `npm run lint` — no new ESLint/TypeScript errors.
2. Manual responsive check via dev server at 375px, 768px, 1440px, and a
   large desktop width (e.g. 1920px).
3. Verify `prefers-reduced-motion: reduce` collapses animation to a static
   state (via browser dev tools emulation).
4. Verify text contrast and semantic structure visually/via markup review.
