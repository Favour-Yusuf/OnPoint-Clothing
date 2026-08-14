import "server-only";

const PAYSTACK_BASE = "https://api.paystack.co";

export class PaystackError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "PaystackError";
  }
}

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

type VerifyResult = {
  status: "success" | "failed" | "abandoned";
  amount: number;
  currency: string;
  reference: string;
  paidAt: string | null;
};

export async function verifyTransaction(reference: string): Promise<VerifyResult> {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
    cache: "no-store",
  });

  const body = await response.json();
  if (!response.ok || !body.status) {
    throw new PaystackError(body.message ?? "Failed to verify Paystack transaction", response.status);
  }

  return {
    status: body.data.status,
    amount: body.data.amount,
    currency: body.data.currency,
    reference: body.data.reference,
    paidAt: body.data.paid_at,
  };
}
