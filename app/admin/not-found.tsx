import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-serif text-2xl font-light text-foreground">Not Found</h1>
      <p className="font-sans text-sm text-foreground/55">
        That record doesn&rsquo;t exist, or may have been removed.
      </p>
      <Link href="/admin" className="font-sans text-xs text-foreground/70 underline-offset-4 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
