import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { AdminCustomerSummary } from "@/lib/types";

export function CustomersTable({ customers }: { customers: AdminCustomerSummary[] }) {
  if (customers.length === 0) {
    return <p className="py-10 text-center font-sans text-sm text-foreground/50">No customers found.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <table className="hidden w-full min-w-[720px] border-collapse font-sans text-sm sm:table">
        <thead>
          <tr className="border-b border-foreground/10 text-left text-xs font-light tracking-[0.15em] text-foreground/45 uppercase">
            <th className="py-3 pr-4 font-medium">Customer</th>
            <th className="py-3 pr-4 font-medium">Type</th>
            <th className="py-3 pr-4 font-medium">Orders</th>
            <th className="py-3 pr-4 font-medium">Total Spent</th>
            <th className="py-3 pr-4 font-medium">Last Order</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.key} className="border-b border-foreground/5 hover:bg-foreground/[0.03]">
              <td className="py-3 pr-4">
                <Link
                  href={`/admin/customers/${encodeURIComponent(customer.key)}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {customer.name}
                </Link>
                <p className="text-xs text-foreground/45">{customer.email}</p>
              </td>
              <td className="py-3 pr-4 text-foreground/60">
                {customer.type === "registered" ? "Registered" : "Guest"}
              </td>
              <td className="py-3 pr-4 font-light tracking-wide text-foreground/70 tabular-nums">{customer.orderCount}</td>
              <td className="py-3 pr-4 font-light tracking-wide text-foreground tabular-nums">{formatPrice(customer.totalSpent / 100)}</td>
              <td className="py-3 pr-4 text-foreground/50">{new Date(customer.lastOrderAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="flex flex-col divide-y divide-foreground/10 border-t border-foreground/10 sm:hidden">
        {customers.map((customer) => (
          <Link
            key={customer.key}
            href={`/admin/customers/${encodeURIComponent(customer.key)}`}
            className="flex flex-col gap-2 py-4 font-sans text-sm active:bg-foreground/[0.03]"
          >
            <div className="flex items-center justify-between">
              <span className="text-foreground">{customer.name}</span>
              <span className="font-light tracking-wide text-foreground tabular-nums">{formatPrice(customer.totalSpent / 100)}</span>
            </div>
            <p className="text-xs text-foreground/45">{customer.email}</p>
            <div className="flex items-center justify-between text-xs text-foreground/50">
              <span>{customer.type === "registered" ? "Registered" : "Guest"} &middot; {customer.orderCount} orders</span>
              <span>{new Date(customer.lastOrderAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
