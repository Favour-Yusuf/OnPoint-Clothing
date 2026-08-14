import { createClient } from "@/lib/supabase/server";
import type { BespokeRequestAdmin, BespokeStatus } from "@/lib/types";

type BespokeRow = {
  id: string;
  customer_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  garment_type: string;
  notes: string | null;
  status: BespokeStatus;
  created_at: string;
};

function mapBespokeRow(row: BespokeRow): BespokeRequestAdmin {
  return {
    id: row.id,
    customerId: row.customer_id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    garmentType: row.garment_type,
    notes: row.notes ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

export type AdminBespokeFilters = {
  search?: string;
  status?: BespokeStatus | "all";
  page?: number;
  pageSize?: number;
};

export async function getBespokeRequestsForAdmin(
  filters: AdminBespokeFilters = {}
): Promise<{ requests: BespokeRequestAdmin[]; total: number }> {
  const { search, status, page = 1, pageSize = 20 } = filters;
  const supabase = await createClient();

  let query = supabase
    .from("bespoke_requests")
    .select("id, customer_id, name, email, phone, garment_type, notes, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (search?.trim()) {
    const term = search.trim().replace(/[%,]/g, "");
    query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,garment_type.ilike.%${term}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) throw new Error(`getBespokeRequestsForAdmin: ${error.message}`);

  return { requests: (data as BespokeRow[]).map(mapBespokeRow), total: count ?? 0 };
}

export async function getBespokeRequestByIdForAdmin(id: string): Promise<BespokeRequestAdmin | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bespoke_requests")
    .select("id, customer_id, name, email, phone, garment_type, notes, status, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getBespokeRequestByIdForAdmin: ${error.message}`);
  return data ? mapBespokeRow(data as BespokeRow) : undefined;
}

export async function getNewBespokeCountForAdmin(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("bespoke_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error) throw new Error(`getNewBespokeCountForAdmin: ${error.message}`);
  return count ?? 0;
}
