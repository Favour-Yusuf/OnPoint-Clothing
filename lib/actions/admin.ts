"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BespokeStatus, OrderStatus } from "@/lib/types";

const VALID_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "ready_for_delivery",
  "shipped",
  "delivered",
  "cancelled",
];

const VALID_BESPOKE_STATUSES: BespokeStatus[] = [
  "new",
  "contacted",
  "consultation",
  "in_progress",
  "completed",
  "cancelled",
];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: customer } = await supabase.from("customers").select("is_admin").eq("id", user.id).maybeSingle();
  if (!customer?.is_admin) return null;

  return supabase;
}

export type AdminActionState = {
  status: "idle" | "error";
  message?: string;
};

export async function updateOrderStatus(_prevState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { status: "error", message: "Not authorized." };

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!orderId || !VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
    return { status: "error", message: "Invalid status." };
  }

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { status: "error", message: "Could not update the order. Please try again." };

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { status: "idle" };
}

export async function updateBespokeStatus(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { status: "error", message: "Not authorized." };

  const requestId = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!requestId || !VALID_BESPOKE_STATUSES.includes(status as BespokeStatus)) {
    return { status: "error", message: "Invalid status." };
  }

  const { error } = await supabase.from("bespoke_requests").update({ status }).eq("id", requestId);
  if (error) return { status: "error", message: "Could not update the request. Please try again." };

  revalidatePath(`/admin/bespoke/${requestId}`);
  revalidatePath("/admin/bespoke");
  revalidatePath("/admin");
  return { status: "idle" };
}
