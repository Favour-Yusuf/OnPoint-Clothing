import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForCurrentUser } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Order History",
};

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account");

  const orders = await getOrdersForCurrentUser();

  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-16">
        <h1 className="font-display text-3xl font-light text-foreground">Order History</h1>

        {orders.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No orders yet"
              description="Your past orders will appear here."
              action={<Button href="/shop">Shop OnPoint</Button>}
            />
          </div>
        ) : (
          <div className="mt-8 flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-sans text-sm">
                  <p className="text-foreground">{order.orderNumber}</p>
                  <p className="mt-1 text-foreground/50">
                    {new Date(order.createdAt).toLocaleDateString()} &middot; {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="flex items-center gap-6 font-sans text-sm">
                  <span className="text-foreground/70 capitalize">{order.status.replace(/_/g, " ")}</span>
                  <span className="text-foreground/70 capitalize">Payment: {order.paymentStatus}</span>
                  <span className="font-light tracking-wide text-foreground tabular-nums">{formatPrice(order.total / 100)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
