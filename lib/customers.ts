import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { AdminCustomerSummary } from "@/lib/types";

/**
 * Reads admin_customer_summary (migration 0006) — a view, not RLS-protected,
 * so this always uses the service-role admin client. Callers must only be
 * reached from routes/actions that have already verified is_admin (see
 * app/admin/layout.tsx).
 */

type SummaryRow = {
  customer_key: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  order_count: number;
  total_spent: number;
  last_order_at: string;
};

function mapSummaryRow(row: SummaryRow): AdminCustomerSummary {
  return {
    key: row.user_id ?? `guest:${encodeURIComponent(row.customer_email.toLowerCase())}`,
    userId: row.user_id,
    name: row.customer_name,
    email: row.customer_email,
    phone: row.customer_phone,
    orderCount: row.order_count,
    totalSpent: row.total_spent,
    lastOrderAt: row.last_order_at,
    type: row.user_id ? "registered" : "guest",
  };
}

export type AdminCustomerFilters = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function getCustomersForAdmin(
  filters: AdminCustomerFilters = {}
): Promise<{ customers: AdminCustomerSummary[]; total: number }> {
  const { search, page = 1, pageSize = 20 } = filters;
  const supabase = createAdminClient();

  let query = supabase
    .from("admin_customer_summary")
    .select("*", { count: "exact" })
    .order("last_order_at", { ascending: false });

  if (search?.trim()) {
    const term = search.trim().replace(/[%,]/g, "");
    query = query.or(`customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) throw new Error(`getCustomersForAdmin: ${error.message}`);

  return { customers: (data as SummaryRow[]).map(mapSummaryRow), total: count ?? 0 };
}

// customerKey is either a user_id (uuid) or `guest:<url-encoded-email>` —
// see AdminCustomerSummary.key.
export async function getCustomerSummaryForAdmin(customerKey: string): Promise<AdminCustomerSummary | undefined> {
  const supabase = createAdminClient();
  let query = supabase.from("admin_customer_summary").select("*");

  if (customerKey.startsWith("guest:")) {
    const email = decodeURIComponent(customerKey.slice("guest:".length));
    query = query.is("user_id", null).eq("customer_email", email);
  } else {
    query = query.eq("user_id", customerKey);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`getCustomerSummaryForAdmin: ${error.message}`);
  return data ? mapSummaryRow(data as SummaryRow) : undefined;
}

export async function getCustomerCountForRange(fromIso: string, toIso: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("customer_email")
    .gte("created_at", fromIso)
    .lte("created_at", toIso);
  if (error) throw new Error(`getCustomerCountForRange: ${error.message}`);
  return new Set(data.map((row) => row.customer_email.toLowerCase())).size;
}
