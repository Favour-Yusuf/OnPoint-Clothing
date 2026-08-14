"use client";

import { useState, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { CloseIcon } from "@/components/ui/icons";

export function AdminShell({
  adminName,
  adminEmail,
  children,
}: {
  adminName: string | null;
  adminEmail: string;
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AdminHeader onMenuClick={() => setDrawerOpen(true)} />

      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-foreground/10 lg:block">
          <AdminSidebar adminName={adminName} adminEmail={adminEmail} />
        </aside>

        {drawerOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-background">
              <div className="flex justify-end p-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="text-foreground/60 hover:text-foreground"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <AdminSidebar adminName={adminName} adminEmail={adminEmail} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
