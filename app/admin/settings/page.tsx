import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: customer } = await supabase
    .from("customers")
    .select("full_name, email")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-[600px] px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-serif text-2xl font-light text-foreground">Settings</h1>

      <section className="mt-8 border border-foreground/10 p-6">
        <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">
          Admin Account
        </h2>
        <div className="mt-4 font-sans text-sm text-foreground/70">
          <p className="text-foreground">{customer?.full_name || "—"}</p>
          <p>{customer?.email ?? user?.email}</p>
        </div>
        <form action={signOut} className="mt-6">
          <Button type="submit" variant="outline" size="md">
            Sign Out
          </Button>
        </form>
      </section>
    </div>
  );
}
