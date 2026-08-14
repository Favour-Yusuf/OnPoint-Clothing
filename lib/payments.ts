import { createClient } from "@/lib/supabase/server";
import type { AdminPayment, PaymentStatus } from "@/lib/types";

const PAYMENT_SELECT = `
  id, order_id, provider, reference, amount, currency, status, paid_at, created_at,
  orders ( order_number, customer_name, customer_email )
`;

type PaymentRow = {
  id: string;
  order_id: string;
  provider: string;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
  orders: { order_number: string; customer_name: string; customer_email: string } | null;
};

function mapPaymentRow(row: PaymentRow): AdminPayment {
  return {
    id: row.id,
    orderId: row.order_id,
    orderNumber: row.orders?.order_number ?? "",
    customerName: row.orders?.customer_name ?? "",
    customerEmail: row.orders?.customer_email ?? "",
    provider: row.provider,
    reference: row.reference,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

export type AdminPaymentFilters = {
  search?: string;
  status?: PaymentStatus | "all";
  page?: number;
  pageSize?: number;
};

export async function getPaymentsForAdmin(
  filters: AdminPaymentFilters = {}
): Promise<{ payments: AdminPayment[]; total: number }> {
  const { search, status, page = 1, pageSize = 20 } = filters;
  const supabase = await createClient();

  // orders!inner so a search/filter on the joined order actually excludes
  // non-matching parent rows (see lib/products.ts for why plain embeds
  // don't filter parent rows the same way).
  let query = supabase
    .from("payments")
    .select(PAYMENT_SELECT.replace("orders (", "orders!inner ("), { count: "exact" })
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (search?.trim()) {
    const term = search.trim().replace(/[%,]/g, "");
    query = query.or(
      `reference.ilike.%${term}%,orders.order_number.ilike.%${term}%,orders.customer_name.ilike.%${term}%,orders.customer_email.ilike.%${term}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) throw new Error(`getPaymentsForAdmin: ${error.message}`);

  return { payments: (data as unknown as PaymentRow[]).map(mapPaymentRow), total: count ?? 0 };
}

export async function getPaymentByOrderId(orderId: string): Promise<AdminPayment | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("payments").select(PAYMENT_SELECT).eq("order_id", orderId).maybeSingle();
  if (error) throw new Error(`getPaymentByOrderId: ${error.message}`);
  return data ? mapPaymentRow(data as unknown as PaymentRow) : undefined;
}

export async function getFailedPaymentsCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("status", "failed");
  if (error) throw new Error(`getFailedPaymentsCount: ${error.message}`);
  return count ?? 0;
}
