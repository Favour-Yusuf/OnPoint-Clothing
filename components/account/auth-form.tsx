"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthState = { status: "idle" };

export function AuthForm({ next }: { next?: string } = {}) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);

  const state = mode === "sign-in" ? signInState : signUpState;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div className="flex gap-6 border-b border-foreground/10 font-sans text-xs font-medium tracking-[0.2em] uppercase">
        {(["sign-in", "sign-up"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
            className={`-mb-px border-b py-3 transition-colors ${
              mode === tab ? "border-foreground text-foreground" : "border-transparent text-foreground/40"
            }`}
          >
            {tab === "sign-in" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      {mode === "sign-in" ? (
        <form action={signInAction} className="flex flex-col gap-4">
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <Field label="Email" name="email" type="email" autoComplete="email" />
          <Field label="Password" name="password" type="password" autoComplete="current-password" />
          {state.status === "error" ? <p className="font-sans text-sm text-burgundy-light">{state.message}</p> : null}
          <Button type="submit" disabled={signInPending} className="mt-2 w-full">
            {signInPending ? "Signing In…" : "Sign In"}
          </Button>
        </form>
      ) : (
        <form action={signUpAction} className="flex flex-col gap-4">
          <Field label="Full Name" name="fullName" autoComplete="name" />
          <Field label="Email" name="email" type="email" autoComplete="email" />
          <Field label="Password" name="password" type="password" autoComplete="new-password" />
          {state.status === "error" ? <p className="font-sans text-sm text-burgundy-light">{state.message}</p> : null}
          <Button type="submit" disabled={signUpPending} className="mt-2 w-full">
            {signUpPending ? "Creating Account…" : "Create Account"}
          </Button>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs text-foreground/50">{label}</span>
      <input
        type={type}
        name={name}
        required
        autoComplete={autoComplete}
        className="border border-foreground/20 bg-transparent px-3 py-2.5 font-sans text-sm text-foreground focus:border-foreground/50 focus-visible:outline-none"
      />
    </label>
  );
}
