"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-light text-foreground">We couldn&rsquo;t load this page</h1>
      <p className="font-sans text-sm text-foreground/55">
        Something went wrong on our end. Try again, and if it keeps happening, let the development team know.
      </p>
      <Button type="button" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
