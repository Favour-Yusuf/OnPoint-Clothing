"use client";

import { useActionState, useState } from "react";
import { addAddress, type AddressState } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";

const initialState: AddressState = { status: "idle" };

export function AddressForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(addAddress, initialState);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-dashed border-foreground/25 px-4 py-3 text-left font-sans text-sm text-foreground/60 transition-colors hover:border-foreground/45 hover:text-foreground"
      >
        + Add a new address
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 border border-foreground/10 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Label (optional)" name="label" className="sm:col-span-2" />
        <Field label="Full Name" name="fullName" className="sm:col-span-2" />
        <Field label="Address" name="address1" className="sm:col-span-2" />
        <Field label="Apt, Suite, etc. (optional)" name="address2" className="sm:col-span-2" />
        <Field label="City" name="city" />
        <Field label="State / Province" name="state" />
        <Field label="Postal Code" name="postalCode" />
        <Field label="Country" name="country" />
        <Field label="Phone (optional)" name="phone" type="tel" />
      </div>
      {state.status === "error" ? <p className="font-sans text-sm text-burgundy-light">{state.message}</p> : null}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} size="md">
          {pending ? "Saving…" : "Save Address"}
        </Button>
        <Button type="button" variant="outline" size="md" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", className = "" }: { label: string; name: string; type?: string; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-sans text-xs text-foreground/50">{label}</span>
      <input
        type={type}
        name={name}
        className="border border-foreground/20 bg-transparent px-3 py-2.5 font-sans text-sm text-foreground focus:border-foreground/50 focus-visible:outline-none"
      />
    </label>
  );
}
