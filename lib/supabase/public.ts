import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Anon-key client with no cookie/session handling. Product/category/
// collection catalog data is public (RLS grants anon select on active
// rows) and never depends on who's signed in, so this is what
// lib/products.ts uses — critically, it works in contexts with no request
// available at all, like generateStaticParams at build time, where the
// cookie-based client in lib/supabase/server.ts would throw.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
