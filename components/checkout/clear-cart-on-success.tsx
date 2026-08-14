"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";

// Split out from the (server) success page because clearing localStorage
// needs a Client Component. Only fires once the order is confirmed paid —
// never on the redirect back from Paystack alone.
export function ClearCartOnSuccess() {
  const { clear } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    clear();
  }, [clear]);

  return null;
}
