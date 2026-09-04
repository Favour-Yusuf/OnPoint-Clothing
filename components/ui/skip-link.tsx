/**
 * Invisible until keyboard-focused, then jumps straight to `#main-content`
 * — lets keyboard/screen-reader users bypass the header nav (and, on the
 * homepage, a full autoplaying hero) instead of tabbing through it on every
 * single page.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-burgundy focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-foreground focus-visible:outline-none"
    >
      Skip to content
    </a>
  );
}
