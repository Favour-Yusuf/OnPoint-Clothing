import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { PaymentStatusBadge } from "@/components/admin/status-badge";
import type { AdminPayment } from "@/lib/types";

export function PaymentsTable({ payments }: { payments: AdminPayment[] }) {
  if (payments.length === 0) {
    return <p className="py-10 text-center font-sans text-sm text-foreground/50">No payments found.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <table className="hidden w-full min-w-[760px] border-collapse font-sans text-sm sm:table">
        <thead>
          <tr className="border-b border-foreground/10 text-left text-xs font-light tracking-[0.15em] text-foreground/45 uppercase">
            <th className="py-3 pr-4 font-medium">Reference</th>
            <th className="py-3 pr-4 font-medium">Order</th>
            <th className="py-3 pr-4 font-medium">Customer</th>
            <th className="py-3 pr-4 font-medium">Amount</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-foreground/5 hover:bg-foreground/[0.03]">
              <td className="py-3 pr-4 font-mono text-xs text-foreground/70">{payment.reference}</td>
              <td className="py-3 pr-4">
                <Link
                  href={`/admin/orders/${payment.orderId}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {payment.orderNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-foreground/70">{payment.customerName}</td>
              <td className="py-3 pr-4 font-light tracking-wide text-foreground tabular-nums">{formatPrice(payment.amount / 100)}</td>
              <td className="py-3 pr-4 text-foreground/50">{new Date(payment.createdAt).toLocaleDateString()}</td>
              <td className="py-3 pr-4">
                <PaymentStatusBadge status={payment.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="flex flex-col divide-y divide-foreground/10 border-t border-foreground/10 sm:hidden">
        {payments.map((payment) => (
          <Link
            key={payment.id}
            href={`/admin/orders/${payment.orderId}`}
            className="flex flex-col gap-2 py-4 font-sans text-sm active:bg-foreground/[0.03]"
          >
            <div className="flex items-center justify-between">
              <span className="text-foreground">{payment.orderNumber}</span>
              <span className="font-light tracking-wide text-foreground tabular-nums">{formatPrice(payment.amount / 100)}</span>
            </div>
            <p className="font-mono text-xs text-foreground/45">{payment.reference}</p>
            <div className="flex items-center justify-between text-xs text-foreground/50">
              <span>{payment.customerName}</span>
              <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
            </div>
            <PaymentStatusBadge status={payment.status} />
          </Link>
        ))}
      </div>
    </>
  );
}
