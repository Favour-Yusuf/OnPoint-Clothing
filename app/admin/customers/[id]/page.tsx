import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { getCustomerSummaryForAdmin } from "@/lib/customers";
import { getOrdersForCustomerAdmin } from "@/lib/orders";
import { OrdersTable } from "@/components/admin/orders-table";

export const metadata: Metadata = {
  title: "Customer Detail",
};

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerSummaryForAdmin(decodeURIComponent(id));
  if (!customer) notFound();

  const orders = await getOrdersForCustomerAdmin({ userId: customer.userId, email: customer.email });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/customers" className="font-sans text-xs text-foreground/50 hover:text-foreground">
        &larr; All Customers
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">{customer.name}</h1>
          <p className="mt-2 font-sans text-sm text-foreground/60">{customer.email}</p>
          {customer.phone ? <p className="font-sans text-sm text-foreground/60">{customer.phone}</p> : null}
          <p className="mt-2 font-sans text-xs text-foreground/45">
            {customer.type === "registered" ? "Registered customer" : "Guest checkout"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 border border-foreground/10 p-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.18em] text-foreground/45 uppercase">
            Total Orders
          </p>
          <p className="mt-2 font-serif text-2xl font-light text-foreground tabular-nums">{customer.orderCount}</p>
        </div>
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.18em] text-foreground/45 uppercase">
            Total Spent
          </p>
          <p className="mt-2 font-serif text-2xl font-light text-foreground tabular-nums">
            {formatPrice(customer.totalSpent / 100)}
          </p>
        </div>
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.18em] text-foreground/45 uppercase">
            Last Order
          </p>
          <p className="mt-2 font-serif text-2xl font-light text-foreground">
            {new Date(customer.lastOrderAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">
          Order History
        </h2>
        <div className="mt-4">
          <OrdersTable orders={orders} />
        </div>
      </section>
    </div>
  );
}
