import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { MenuIcon } from "@/components/ui/icons";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-foreground/10 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="text-foreground/70 hover:text-foreground lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-3">
          <Logo className="h-5 w-auto" />
          <span className="hidden font-sans text-xs font-light tracking-[0.2em] text-foreground/45 uppercase sm:inline">
            Admin
          </span>
        </Link>
      </div>

      <Link
        href="/"
        className="font-sans text-xs text-foreground/50 underline-offset-4 hover:text-foreground hover:underline"
      >
        View Store
      </Link>
    </header>
  );
}
