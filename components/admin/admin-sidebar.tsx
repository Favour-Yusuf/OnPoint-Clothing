"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/bespoke", label: "Bespoke" },
  { href: "/admin/payments", label: "Payments" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminSidebar({
  adminName,
  adminEmail,
  onNavigate,
}: {
  adminName: string | null;
  adminEmail: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between px-6 py-8">
      <nav className="flex flex-col gap-1 font-sans text-sm">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className={`border-l-2 px-3 py-2 transition-colors ${
              isActive(pathname, item.href)
                ? "border-burgundy bg-foreground/6 text-foreground"
                : "border-transparent text-foreground/55 hover:border-burgundy/40 hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <div className="my-4 border-t border-foreground/10" />

        <Link
          href="/admin/settings"
          onClick={onNavigate}
          aria-current={isActive(pathname, "/admin/settings") ? "page" : undefined}
          className={`border-l-2 px-3 py-2 transition-colors ${
            isActive(pathname, "/admin/settings")
              ? "border-burgundy bg-foreground/6 text-foreground"
              : "border-transparent text-foreground/55 hover:border-burgundy/40 hover:text-foreground"
          }`}
        >
          Settings
        </Link>
      </nav>

      <div className="border-t border-foreground/10 pt-5">
        <p className="truncate px-3 font-sans text-sm text-foreground/80">{adminName || adminEmail}</p>
        <p className="truncate px-3 font-sans text-xs text-foreground/40">{adminEmail}</p>
        <form action={signOut} className="mt-3">
          <button type="submit" className="px-3 py-1.5 font-sans text-xs text-foreground/50 hover:text-foreground">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
