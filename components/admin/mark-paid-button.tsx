"use client";

import { useActionState, useRef } from "react";
import { updateOrderPaymentStatus, type AdminActionState } from "@/lib/actions/admin";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

const initialState: AdminActionState = { status: "idle" };

/**
 * One-click "mark paid" for a pending payment, used inline in the payments
 * list so confirming a bank transfer doesn't require opening the order
 * detail page first. Same underlying action/effect as the full Payment
 * Status control on the order page — this is just a shortcut to it.
 */
export function MarkPaidButton({ orderId }: { orderId: string }) {
  const [state, formAction, pending] = useActionState(updateOrderPaymentStatus, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="paymentStatus" value="paid" />
      <ConfirmDialog
        title="Mark this payment as paid?"
        description="Only confirm once you've verified it yourself — checked the bank account for the transfer, or the receipt sent on WhatsApp. This is what tells the team to start fulfilling the order."
        confirmLabel="Mark as Paid"
        pending={pending}
        onConfirm={() => formRef.current?.requestSubmit()}
        trigger={
          <button
            type="button"
            disabled={pending}
            className="border border-burgundy px-3 py-1.5 font-sans text-xs whitespace-nowrap text-burgundy-light transition-colors hover:bg-burgundy hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            {pending ? "Marking…" : "Mark Paid"}
          </button>
        }
      />
      {state.status === "error" ? <p className="mt-1 font-sans text-xs text-burgundy-light">{state.message}</p> : null}
    </form>
  );
}
