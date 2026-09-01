"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { useWishlist } from "@/lib/wishlist-context";
import { useCurrentAccount } from "@/lib/use-current-account";
import { HeartIcon } from "@/components/ui/icons";

export function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const { isSignedIn } = useCurrentAccount();
  const { isWishlisted, toggle } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const active = isWishlisted(productId);

  function handleClick() {
    if (!isSignedIn) {
      router.push(`/account?next=${encodeURIComponent(pathname)}`);
      return;
    }
    startTransition(() => toggle(productId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex items-center justify-center transition-colors disabled:opacity-60 ${
        active ? "text-burgundy-light" : "text-foreground"
      } ${className}`}
    >
      <HeartIcon className="h-[18px] w-[18px]" fill={active ? "currentColor" : "none"} stroke="currentColor" />
    </button>
  );
}
