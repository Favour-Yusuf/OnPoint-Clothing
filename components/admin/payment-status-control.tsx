"use client";

import { useActionState, useRef, useState } from "react";
import { updateOrderPaymentStatus, type AdminActionState } from "@/lib/actions/admin";
import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_OPTIONS } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import type { PaymentStatus } from "@/lib/types";

const initialState: AdminActionState = { status: "idle" };

export function PaymentStatusControl({ orderId, currentStatus }: { orderId: string; currentStatus: PaymentStatus }) {
  const [state, formAction, pending] = useActionState(updateOrderPaymentStatus, initialState);
  const [selected, setSelected] = useState<PaymentStatus>(currentStatus);
  const formRef = useRef<HTMLFormElement>(null);

  // Any change into or out of "paid" is money-affecting and hard to walk
  // back cleanly (e.g. it's what tells you to start fulfilling), so it gets
  // the same confirm step as cancelling an order.
  const isSensitive = selected !== currentStatus && (selected === "paid" || currentStatus === "paid");

  return (
    <div className="flex flex-col items-start gap-2">
      <form ref={formRef} action={formAction} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="orderId" value={orderId} />
        <select
          name="paymentStatus"
          value={selected}
          onChange={(e) => setSelected(e.target.value as PaymentStatus)}
          className="border border-foreground/20 bg-transparent px-3 py-2 font-sans text-sm text-foreground focus:border-foreground/50 focus-visible:outline-none"
        >
          {PAYMENT_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status} className="bg-background">
              {PAYMENT_STATUS_LABEL[status]}
            </option>
          ))}
        </select>

        {isSensitive ? (
          <ConfirmDialog
            title={selected === "paid" ? "Mark this order as paid?" : "Change payment status?"}
            description={
              selected === "paid"
                ? "Only confirm this once you've verified the payment yourself, e.g. checked the bank account for a matching transfer, or confirmed the receipt sent on WhatsApp. This is what tells the team to start fulfilling the order."
                : "This changes the order away from paid. Only do this if the payment genuinely failed or was refunded."
            }
            confirmLabel="Update Payment Status"
            pending={pending}
            onConfirm={() => formRef.current?.requestSubmit()}
            trigger={
              <Button type="button" variant="outline" size="md">
                Update Payment
              </Button>
            }
          />
        ) : (
          <Button type="submit" size="md" disabled={pending || selected === currentStatus}>
            {pending ? "Updating…" : "Update Payment"}
          </Button>
        )}
      </form>
      {state.status === "error" ? <p className="font-sans text-xs text-burgundy-light">{state.message}</p> : null}
    </div>
  );
}
