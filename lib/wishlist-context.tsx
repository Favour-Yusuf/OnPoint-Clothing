"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { toggleWishlist } from "@/lib/actions/wishlist";

type WishlistContextValue = {
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      if (!session?.user) {
        setIds(new Set());
        return;
      }
      const { data } = await supabase.from("wishlist_items").select("product_id").eq("customer_id", session.user.id);
      if (!active) return;
      setIds(new Set((data ?? []).map((row) => row.product_id)));
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

  const isWishlisted = useCallback((productId: string) => ids.has(productId), [ids]);

  const toggle = useCallback(async (productId: string) => {
    // Optimistic flip, reverted if the server action throws (e.g. session expired mid-request).
    let wasWishlisted = false;
    setIds((prev) => {
      wasWishlisted = prev.has(productId);
      const next = new Set(prev);
      if (wasWishlisted) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      await toggleWishlist(productId);
    } catch {
      setIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  }, []);

  const value = useMemo(() => ({ isWishlisted, toggle }), [isWishlisted, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
