import { createHmac, timingSafeEqual } from "node:crypto";
import { confirmPaystackPayment } from "@/lib/paystack-confirm";

// Paystack sends events at-least-once and expects a 200 quickly. This is
// the server-to-server confirmation path — independent of, and possibly
// racing against, the inline popup's client-side verify call
// (/api/paystack/verify). Both converge on confirmPaystackPayment, which is
// safe to call twice for the same reference.
export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("paystack webhook: PAYSTACK_SECRET_KEY is not set");
    return new Response("Server misconfigured", { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expectedSignature = createHmac("sha512", secret).update(rawBody).digest("hex");

  const signatureValid =
    signature.length === expectedSignature.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!signatureValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  if (event.event !== "charge.success" || !event.data?.reference) {
    return new Response("Ignored", { status: 200 });
  }

  const result = await confirmPaystackPayment(event.data.reference);
  if (!result.ok) {
    console.error(`paystack webhook: ${event.data.reference} not confirmed — ${result.message}`);
  }

  // Always 200 once the event has been parsed and routed — a definitive
  // outcome (unknown reference, amount mismatch, failed transaction) won't
  // be fixed by Paystack retrying, so there's nothing to gain from a
  // non-2xx here beyond the signature/payload failures above.
  return new Response(result.ok ? "OK" : "Not confirmed", { status: 200 });
}
