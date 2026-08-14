"use client";

import { useActionState, useState } from "react";
import { updateBespokeStatus, type AdminActionState } from "@/lib/actions/admin";
import { BESPOKE_STATUS_LABEL, BESPOKE_STATUS_OPTIONS } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import type { BespokeStatus } from "@/lib/types";

const initialState: AdminActionState = { status: "idle" };

export function BespokeStatusControl({ requestId, currentStatus }: { requestId: string; currentStatus: BespokeStatus }) {
  const [state, formAction, pending] = useActionState(updateBespokeStatus, initialState);
  const [selected, setSelected] = useState<BespokeStatus>(currentStatus);

  return (
    <div className="flex flex-col items-end gap-2">
      <form action={formAction} className="flex items-center gap-3">
        <input type="hidden" name="requestId" value={requestId} />
        <select
          name="status"
          value={selected}
          onChange={(e) => setSelected(e.target.value as BespokeStatus)}
          className="border border-foreground/20 bg-transparent px-3 py-2 font-sans text-sm text-foreground focus:border-foreground/50 focus-visible:outline-none"
        >
          {BESPOKE_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status} className="bg-background">
              {BESPOKE_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <Button type="submit" size="md" disabled={pending || selected === currentStatus}>
          {pending ? "Updating…" : "Update Status"}
        </Button>
      </form>
      {state.status === "error" ? <p className="font-sans text-xs text-burgundy-light">{state.message}</p> : null}
    </div>
  );
}
