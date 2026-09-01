import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAbandonedCheckoutEmail } from "@/lib/notifications/abandoned-checkout";

const ONE_HOUR_MS = 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// SUSPENDED: the Vercel Cron trigger for this route was removed from
// vercel.json's `crons` array, so this handler is no longer invoked on a
// schedule. To re-enable, restore
// { "path": "/api/cron/abandoned-checkouts", "schedule": "0 * * * *" } to
// vercel.json's `crons` array and redeploy.
//
// Finds orders whose checkout was submitted (payment_status still
// 'pending', a real Paystack attempt exists) but never completed, and
// sends each a one-time reminder email. Protected by CRON_SECRET so it
// can't be triggered by anyone else — Vercel sends this automatically as
// an Authorization header when the project env var is set.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = Date.now();
  const oneHourAgo = new Date(now - ONE_HOUR_MS).toISOString();
  const sevenDaysAgo = new Date(now - SEVEN_DAYS_MS).toISOString();

  const { data: orders, error } = await admin
    .from("orders")
    .select("id, order_number, customer_name, customer_email, total")
    .eq("payment_status", "pending")
    .not("paystack_reference", "is", null)
    .is("abandoned_email_sent_at", null)
    .gte("created_at", sevenDaysAgo)
    .lte("created_at", oneHourAgo);

  if (error) {
    console.error("abandoned-checkouts cron: query failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  let sent = 0;
  let failed = 0;

  for (const order of orders ?? []) {
    try {
      const { data: items, error: itemsError } = await admin
        .from("order_items")
        .select("product_name, size, color, quantity, total_price")
        .eq("order_id", order.id);
      if (itemsError) throw new Error(itemsError.message);

      const ok = await sendAbandonedCheckoutEmail({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        total: order.total,
        items: (items ?? []).map((item) => ({
          productName: item.product_name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          totalPrice: item.total_price,
        })),
        checkoutUrl: `${siteUrl}/checkout`,
      });
      if (!ok) throw new Error("email send returned false");

      await admin.from("orders").update({ abandoned_email_sent_at: new Date().toISOString() }).eq("id", order.id);
      sent++;
    } catch (err) {
      console.error(`abandoned-checkouts cron: failed for order ${order.id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
