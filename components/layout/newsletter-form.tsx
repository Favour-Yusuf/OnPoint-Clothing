"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/actions/newsletter";
import { ArrowRightIcon } from "@/components/ui/icons";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  if (state.status === "success") {
    return <p className="font-sans text-sm text-foreground/70">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex items-end gap-3 border-b border-foreground/25 pb-2 focus-within:border-foreground/60">
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          aria-label="Email address"
          className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe"
          className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground/70 transition-colors hover:text-foreground disabled:opacity-40"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
      {state.status === "error" ? <p className="font-sans text-xs text-burgundy-light">{state.message}</p> : null}
    </form>
  );
}
