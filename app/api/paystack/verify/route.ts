import { NextResponse } from "next/server";
import { confirmPaystackPayment } from "@/lib/paystack-confirm";

// Called by the checkout page immediately after the Paystack inline
// popup's callback fires. This is a convenience/fast-path for the
// customer's UI — it is NOT the sole source of truth for "paid" (the
// webhook independently confirms the same transaction server-to-server).
// Both call the same idempotent confirmPaystackPayment, so it doesn't
// matter which one runs first.
export async function POST(request: Request) {
  let body: { reference?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, paid: false, message: "Invalid request." }, { status: 400 });
  }

  const reference = typeof body.reference === "string" ? body.reference.trim() : "";
  // Our own reference format — cheap guard against pointless Paystack API
  // calls for garbage input before it ever reaches confirmPaystackPayment.
  if (!reference || !reference.startsWith("onpt_")) {
    return NextResponse.json({ ok: false, paid: false, message: "Missing or invalid reference." }, { status: 400 });
  }

  const result = await confirmPaystackPayment(reference);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
