"use client";

import { useActionState, useRef, useState } from "react";
import { updateOrderStatus, type AdminActionState } from "@/lib/actions/admin";
import { ORDER_STATUS_LABEL, ORDER_STATUS_OPTIONS } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/lib/types";

const initialState: AdminActionState = { status: "idle" };

export function OrderStatusControl({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [state, formAction, pending] = useActionState(updateOrderStatus, initialState);
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);
  const formRef = useRef<HTMLFormElement>(null);

  const isCancelling = selected === "cancelled" && currentStatus !== "cancelled";

  return (
    <div className="flex flex-col items-end gap-2">
      <form ref={formRef} action={formAction} className="flex items-center gap-3">
        <input type="hidden" name="orderId" value={orderId} />
        <select
          name="status"
          value={selected}
          onChange={(e) => setSelected(e.target.value as OrderStatus)}
          className="border border-foreground/20 bg-transparent px-3 py-2 font-sans text-sm text-foreground focus:border-foreground/50 focus-visible:outline-none"
        >
          {ORDER_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status} className="bg-background">
              {ORDER_STATUS_LABEL[status]}
            </option>
          ))}
        </select>

        {isCancelling ? (
          <ConfirmDialog
            title="Cancel this order?"
            description="This marks the order as cancelled. Only do this when the order genuinely won't be fulfilled. This cannot be undone from here."
            confirmLabel="Cancel Order"
            pending={pending}
            onConfirm={() => formRef.current?.requestSubmit()}
            trigger={
              <Button type="button" variant="outline" size="md">
                Update Status
              </Button>
            }
          />
        ) : (
          <Button type="submit" size="md" disabled={pending || selected === currentStatus}>
            {pending ? "Updating…" : "Update Status"}
          </Button>
        )}
      </form>
      {state.status === "error" ? <p className="font-sans text-xs text-burgundy-light">{state.message}</p> : null}
    </div>
  );
}
