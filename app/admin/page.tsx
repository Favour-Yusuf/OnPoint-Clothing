import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getDashboardMetrics, getAttentionSummary, getRevenueSeries } from "@/lib/dashboard";
import { getOrdersForAdmin } from "@/lib/orders";
import { MetricCard } from "@/components/admin/metric-card";
import { DateRangeTabs } from "@/components/admin/date-range-tabs";
import { AttentionPanel } from "@/components/admin/attention-panel";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrdersTable } from "@/components/admin/orders-table";
import type { DateRangeKey } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

const VALID_RANGES: DateRangeKey[] = ["today", "7d", "30d", "90d", "12mo"];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange } = await searchParams;
  const range: DateRangeKey = VALID_RANGES.includes(rawRange as DateRangeKey) ? (rawRange as DateRangeKey) : "30d";

  const [metrics, attention, series, { orders: recentOrders }] = await Promise.all([
    getDashboardMetrics(range),
    getAttentionSummary(),
    getRevenueSeries(range),
    getOrdersForAdmin({ pageSize: 5 }),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-light text-foreground">Dashboard</h1>
        <DateRangeTabs active={range} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 border border-foreground/10 p-6 sm:grid-cols-4">
        <MetricCard label="Revenue" value={formatPrice(metrics.revenue / 100)} />
        <MetricCard label="Orders" value={String(metrics.ordersCount)} />
        <MetricCard label="Avg. Order Value" value={formatPrice(metrics.averageOrderValue / 100)} />
        <MetricCard label="Customers" value={String(metrics.customersCount)} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">Revenue</h2>
          <div className="mt-4 border border-foreground/10 p-6">
            <RevenueChart data={series} />
          </div>
        </section>

        <AttentionPanel summary={attention} />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="font-sans text-xs text-foreground/60 hover:text-foreground">
            View all orders
          </Link>
        </div>
        <div className="mt-4">
          <OrdersTable orders={recentOrders} />
        </div>
      </section>
    </div>
  );
}
