import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction, PaystackError } from "@/lib/paystack";

/**
 * The single place that turns a Paystack reference into a confirmed paid
 * order. Called from two independent entry points that may arrive in
 * either order — the inline popup's success callback (via
 * /api/paystack/verify) and the Paystack webhook — so this must be safe to
 * call twice (or concurrently) for the same reference.
 *
 * Idempotency is enforced with a single conditional UPDATE
 * (`WHERE status <> 'paid'`) rather than a read-then-write check: Postgres
 * row locking makes that one statement atomic, so whichever caller's UPDATE
 * actually matches a row is the sole "winner" that performs the paid
 * transition and its side effects (order status, stock decrement). The
 * loser — arriving a moment earlier or later — sees zero rows affected and
 * simply reports success without redoing anything.
 */

export type ConfirmPaymentResult = {
  ok: boolean;
  paid: boolean;
  message: string;
};

export async function confirmPaystackPayment(reference: string): Promise<ConfirmPaymentResult> {
  const admin = createAdminClient();

  const { data: payment, error: lookupError } = await admin
    .from("payments")
    .select("id, order_id, amount, currency, status")
    .eq("reference", reference)
    .maybeSingle();

  if (lookupError || !payment) {
    return { ok: false, paid: false, message: "We couldn't find that payment." };
  }

  if (payment.status === "paid") {
    return { ok: true, paid: true, message: "Payment already confirmed." };
  }

  let verified;
  try {
    verified = await verifyTransaction(reference);
  } catch (error) {
    const message = error instanceof PaystackError ? error.message : "Could not verify payment with Paystack.";
    return { ok: false, paid: false, message };
  }

  if (verified.status !== "success") {
    await admin
      .from("payments")
      .update({ status: "failed", metadata: { verification: verified } })
      .eq("id", payment.id)
      .neq("status", "paid");
    return { ok: false, paid: false, message: "This payment was not successful." };
  }

  if (verified.currency !== payment.currency || verified.amount !== payment.amount) {
    await admin
      .from("payments")
      .update({ status: "failed", metadata: { verification: verified, mismatch: true } })
      .eq("id", payment.id)
      .neq("status", "paid");
    return { ok: false, paid: false, message: "We couldn't verify this payment's amount." };
  }

  const { data: claimed, error: claimError } = await admin
    .from("payments")
    .update({
      status: "paid",
      paid_at: verified.paidAt ?? new Date().toISOString(),
      metadata: { verification: verified },
    })
    .eq("id", payment.id)
    .neq("status", "paid")
    .select("order_id")
    .maybeSingle();

  if (claimError) {
    return { ok: false, paid: false, message: "Could not record this payment. Please contact support." };
  }

  if (!claimed) {
    // Another call (webhook or verify) already completed this exact
    // transition between our lookup and this update — already handled.
    return { ok: true, paid: true, message: "Payment already confirmed." };
  }

  await admin.from("orders").update({ payment_status: "paid", status: "processing" }).eq("id", claimed.order_id);

  const { data: orderItems } = await admin
    .from("order_items")
    .select("variant_id, quantity")
    .eq("order_id", claimed.order_id);

  if (orderItems) {
    for (const item of orderItems) {
      if (!item.variant_id) continue;
      const { error: stockError } = await admin.rpc("decrement_variant_stock", {
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
      });
      if (stockError) {
        // The customer has already paid — don't fail this over a stock
        // accounting error. Flag it for manual review instead.
        console.error(
          `confirmPaystackPayment: stock decrement failed for order ${claimed.order_id}, variant ${item.variant_id}: ${stockError.message}`
        );
      }
    }
  }

  return { ok: true, paid: true, message: "Payment confirmed." };
}
