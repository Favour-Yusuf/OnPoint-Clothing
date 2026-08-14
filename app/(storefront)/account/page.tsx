import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForCurrentUser } from "@/lib/orders";
import { AuthForm } from "@/components/account/auth-form";
import { AccountView } from "@/components/account/account-view";
import type { Address } from "@/lib/types";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center bg-background pt-16 lg:pt-20">
        <Container className="flex flex-col items-center gap-6 py-24">
          {error === "verification_failed" ? (
            <p className="max-w-sm text-center font-sans text-sm text-burgundy-light">
              That verification link is invalid or has expired. If your email is already verified, just sign in
              below — otherwise request a new link from the sign-up form.
            </p>
          ) : null}
          <AuthForm next={next} />
        </Container>
      </div>
    );
  }

  const [{ data: customer }, { data: addressRows }, recentOrders] = await Promise.all([
    supabase.from("customers").select("full_name, email").eq("id", user.id).maybeSingle(),
    supabase
      .from("addresses")
      .select("id, label, full_name, address1, address2, city, state, postal_code, country, phone, is_default")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false }),
    getOrdersForCurrentUser(5),
  ]);

  const addresses: Address[] = (addressRows ?? []).map((row) => ({
    id: row.id,
    label: row.label,
    fullName: row.full_name,
    address1: row.address1,
    address2: row.address2,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    phone: row.phone,
    isDefault: row.is_default,
  }));

  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-16">
        <AccountView
          fullName={customer?.full_name ?? null}
          email={customer?.email ?? user.email ?? ""}
          addresses={addresses}
          recentOrders={recentOrders}
        />
      </Container>
    </div>
  );
}
