"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type CurrentAccount = { isSignedIn: boolean; isAdmin: boolean };

const SIGNED_OUT: CurrentAccount = { isSignedIn: false, isAdmin: false };

/**
 * Client-side auth state for header/nav UI only (which menu items to show) —
 * never a security boundary. Real authorization for /admin is enforced
 * server-side in app/admin/layout.tsx regardless of what this returns.
 *
 * Deliberately client-side: the storefront root layout must stay free of
 * cookies()/headers() so pages like the homepage and product pages ([slug])
 * keep statically generating. Checking auth here instead (via the browser
 * client, using the local session — no network round trip) avoids opting
 * the entire route tree into per-request dynamic rendering.
 */
export function useCurrentAccount(): CurrentAccount {
  const [account, setAccount] = useState<CurrentAccount>(SIGNED_OUT);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      if (!session?.user) {
        setAccount(SIGNED_OUT);
        return;
      }
      const { data: customer } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!active) return;
      setAccount({ isSignedIn: true, isAdmin: Boolean(customer?.is_admin) });
    }

    load();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return account;
}
