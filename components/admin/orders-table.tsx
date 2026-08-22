import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badge";
import { ClickableRow } from "@/components/admin/clickable-row";
import type { Order } from "@/lib/types";

const IDENTITY_LINK_CLASS =
  "font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-burgundy-light hover:decoration-burgundy-light";

export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="py-10 text-center font-sans text-sm text-foreground/50">No orders found.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <table className="hidden w-full min-w-[760px] border-collapse font-sans text-sm sm:table">
        <thead>
          <tr className="border-b border-foreground/10 text-left text-xs font-light tracking-[0.15em] text-foreground/45 uppercase">
            <th className="py-3 pr-4 font-medium">Order</th>
            <th className="py-3 pr-4 font-medium">Customer</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Total</th>
            <th className="py-3 pr-4 font-medium">Payment</th>
            <th className="py-3 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <ClickableRow key={order.id} href={`/admin/orders/${order.id}`}>
              <td className="py-3 pr-4">
                <Link href={`/admin/orders/${order.id}`} className={IDENTITY_LINK_CLASS}>
                  {order.orderNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-foreground/70">{order.customerName}</td>
              <td className="py-3 pr-4 text-foreground/50">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="py-3 pr-4 font-light tracking-wide text-foreground tabular-nums">{formatPrice(order.total / 100)}</td>
              <td className="py-3 pr-4">
                <PaymentStatusBadge status={order.paymentStatus} />
              </td>
              <td className="py-3 pr-4">
                <OrderStatusBadge status={order.status} />
              </td>
            </ClickableRow>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="flex flex-col divide-y divide-foreground/10 border-t border-foreground/10 sm:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="flex flex-col gap-2 py-4 font-sans text-sm active:bg-foreground/[0.03]"
          >
            <div className="flex items-center justify-between">
              <span className="text-foreground">{order.orderNumber}</span>
              <span className="font-light tracking-wide text-foreground tabular-nums">{formatPrice(order.total / 100)}</span>
            </div>
            <div className="flex items-center justify-between text-foreground/60">
              <span>{order.customerName}</span>
              <span className="text-xs text-foreground/45">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <PaymentStatusBadge status={order.paymentStatus} />
              <OrderStatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
