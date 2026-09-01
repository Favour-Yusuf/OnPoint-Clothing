import { Logo } from "@/components/layout/logo";

/**
 * Full-viewport loading state shown by Next.js while a route segment's data
 * loads (see app/(storefront)/loading.tsx). Pure CSS animation — no JS
 * library — matching the site's existing motion approach; the mark breathes
 * (scale + opacity) rather than spins, since it's a tall stacked crest, not
 * a circular icon.
 */
export function LogoLoader() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-background">
      <Logo className="h-14 w-auto animate-logo-pulse" />
    </div>
  );
}
