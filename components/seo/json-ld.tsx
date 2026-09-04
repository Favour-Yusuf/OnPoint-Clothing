/**
 * Renders a schema.org object as a JSON-LD <script> tag. The caller builds
 * the object (see call sites for Organization/Product shapes) — this is
 * pure rendering, no schema logic of its own.
 */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
