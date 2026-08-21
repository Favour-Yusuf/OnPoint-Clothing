"use client";

import { useActionState } from "react";
import { submitBespokeRequest, type BespokeFormState } from "@/lib/actions/bespoke";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChatIcon } from "@/components/ui/icons";
import { CONTACT } from "@/lib/contact";

const WHATSAPP_FOLLOWUP_HREF = `${CONTACT.whatsapp.href}?text=${encodeURIComponent(
  "Hi OnPoint, I just submitted a bespoke enquiry on the website and wanted to follow up."
)}`;

const initialState: BespokeFormState = { status: "idle" };

export function BespokeForm() {
  const [state, formAction, pending] = useActionState(submitBespokeRequest, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 border border-background/15 p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-burgundy">
          <CheckIcon className="h-5 w-5 text-burgundy" />
        </span>
        <p className="font-display text-2xl font-light text-background">Enquiry Sent</p>
        <p className="max-w-md text-sm leading-relaxed text-background/60">{state.message}</p>
        <a
          href={WHATSAPP_FOLLOWUP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 font-sans text-sm text-burgundy underline-offset-4 hover:underline"
        >
          <ChatIcon className="h-4 w-4" />
          Want a faster reply? Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Full Name" name="name" error={state.errors?.name} />
      <Field label="Email" name="email" type="email" error={state.errors?.email} />
      <Field label="Phone (optional)" name="phone" type="tel" />
      <Field label="Garment Type" name="garmentType" placeholder="e.g. Suit, Overcoat, Evening Dress" error={state.errors?.garmentType} />
      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="font-sans text-xs text-background/50">Tell us what you have in mind</span>
        <textarea
          name="notes"
          rows={5}
          className={`border bg-transparent px-3 py-2.5 font-sans text-sm text-background focus-visible:outline-none ${
            state.errors?.notes ? "border-burgundy" : "border-background/20 focus:border-background/50"
          }`}
        />
        {state.errors?.notes ? <span className="font-sans text-xs text-burgundy">{state.errors.notes}</span> : null}
      </label>

      {state.status === "error" ? <p className="font-sans text-sm text-burgundy sm:col-span-2">{state.message}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Start Your Bespoke Journey"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs text-background/50">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`border bg-transparent px-3 py-2.5 font-sans text-sm text-background placeholder:text-background/30 focus-visible:outline-none ${
          error ? "border-burgundy" : "border-background/20 focus:border-background/50"
        }`}
      />
      {error ? <span className="font-sans text-xs text-burgundy">{error}</span> : null}
    </label>
  );
}
