import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Montserrat, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { redirect } from "next/navigation";
import "../globals.css";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.justonpointng.com"),
  title: { default: "Admin", template: "%s | OnPoint Admin" },
  // Private operations tool — never indexed.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account?next=/admin");

  const { data: customer } = await supabase
    .from("customers")
    .select("is_admin, full_name, email")
    .eq("id", user.id)
    .maybeSingle();
  // Already signed in but not an admin — send them to their own account
  // rather than back through a login form they don't need.
  if (!customer?.is_admin) redirect("/account");

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="h-full bg-background text-foreground">
        <AdminShell adminName={customer.full_name} adminEmail={customer.email ?? user.email ?? ""}>
          {children}
        </AdminShell>
      </body>
    </html>
  );
}
