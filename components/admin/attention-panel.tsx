import Link from "next/link";
import type { AttentionSummary } from "@/lib/dashboard";

export function AttentionPanel({ summary }: { summary: AttentionSummary }) {
  const items = [
    summary.pendingOrders > 0
      ? {
          count: summary.pendingOrders,
          label: `new ${summary.pendingOrders === 1 ? "order" : "orders"} awaiting processing`,
          href: "/admin/orders?status=pending",
        }
      : null,
    summary.failedPayments > 0
      ? {
          count: summary.failedPayments,
          label: `failed ${summary.failedPayments === 1 ? "payment" : "payments"}`,
          href: "/admin/payments?status=failed",
        }
      : null,
    summary.newBespokeRequests > 0
      ? {
          count: summary.newBespokeRequests,
          label: `new bespoke ${summary.newBespokeRequests === 1 ? "request" : "requests"}`,
          href: "/admin/bespoke?status=new",
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="border border-foreground/10 p-6">
      <p className="font-sans text-xs font-light tracking-[0.18em] text-foreground/45 uppercase">Needs Attention</p>
      {items.length === 0 ? (
        <p className="mt-4 font-sans text-sm text-foreground/55">Everything is up to date.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="group flex items-baseline gap-2 font-sans text-sm text-foreground/80 hover:text-foreground"
              >
                <span className="text-burgundy-light tabular-nums">{item.count}</span>
                <span className="underline-offset-4 group-hover:underline">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
