import { createClient } from "@/lib/supabase/server";
import { getCustomerCountForRange } from "@/lib/customers";
import { getNewBespokeCountForAdmin } from "@/lib/bespoke";
import { getFailedPaymentsCount } from "@/lib/payments";
import type { DateRangeKey } from "@/lib/types";

export function resolveDateRange(range: DateRangeKey): { from: Date; to: Date; bucket: "day" | "week" | "month" } {
  const to = new Date();
  const from = new Date(to);

  switch (range) {
    case "today":
      from.setHours(0, 0, 0, 0);
      return { from, to, bucket: "day" };
    case "7d":
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      return { from, to, bucket: "day" };
    case "30d":
      from.setDate(from.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      return { from, to, bucket: "day" };
    case "90d":
      from.setDate(from.getDate() - 89);
      from.setHours(0, 0, 0, 0);
      return { from, to, bucket: "week" };
    case "12mo":
      from.setMonth(from.getMonth() - 11);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      return { from, to, bucket: "month" };
  }
}

export const DATE_RANGE_LABELS: Record<DateRangeKey, string> = {
  today: "Today",
  "7d": "7 Days",
  "30d": "30 Days",
  "90d": "90 Days",
  "12mo": "12 Months",
};

export type DashboardMetrics = {
  revenue: number; // minor units
  ordersCount: number;
  averageOrderValue: number; // minor units
  customersCount: number;
};

export type AttentionSummary = {
  pendingOrders: number;
  failedPayments: number;
  newBespokeRequests: number;
};

export type RevenuePoint = { label: string; revenue: number; orders: number };

async function fetchOrdersInRange(fromIso: string, toIso: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("total, payment_status, created_at")
    .gte("created_at", fromIso)
    .lte("created_at", toIso);
  if (error) throw new Error(`fetchOrdersInRange: ${error.message}`);
  return data;
}

export async function getDashboardMetrics(range: DateRangeKey): Promise<DashboardMetrics> {
  const { from, to } = resolveDateRange(range);
  const fromIso = from.toISOString();
  const toIso = to.toISOString();

  const [orders, customersCount] = await Promise.all([
    fetchOrdersInRange(fromIso, toIso),
    getCustomerCountForRange(fromIso, toIso),
  ]);

  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = paidOrders.length > 0 ? Math.round(revenue / paidOrders.length) : 0;

  return { revenue, ordersCount: orders.length, averageOrderValue, customersCount };
}

export async function getAttentionSummary(): Promise<AttentionSummary> {
  const supabase = await createClient();
  const [{ count: pendingOrders }, failedPayments, newBespokeRequests] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    getFailedPaymentsCount(),
    getNewBespokeCountForAdmin(),
  ]);

  return { pendingOrders: pendingOrders ?? 0, failedPayments, newBespokeRequests };
}

function bucketLabel(date: Date, bucket: "day" | "week" | "month"): string {
  if (bucket === "month") return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  if (bucket === "week") return `Wk of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function bucketKey(date: Date, bucket: "day" | "week" | "month"): string {
  if (bucket === "month") return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
  if (bucket === "week") {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return weekStart.toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

export async function getRevenueSeries(range: DateRangeKey): Promise<RevenuePoint[]> {
  const { from, to, bucket } = resolveDateRange(range);
  const orders = await fetchOrdersInRange(from.toISOString(), to.toISOString());

  const buckets = new Map<string, RevenuePoint>();
  for (const order of orders) {
    const createdAt = new Date(order.created_at);
    const key = bucketKey(createdAt, bucket);
    const existing = buckets.get(key) ?? { label: bucketLabel(createdAt, bucket), revenue: 0, orders: 0 };
    if (order.payment_status === "paid") existing.revenue += order.total;
    existing.orders += 1;
    buckets.set(key, existing);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, point]) => point);
}
