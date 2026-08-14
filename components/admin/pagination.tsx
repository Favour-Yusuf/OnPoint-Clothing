import Link from "next/link";

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-6 flex items-center justify-between font-sans text-xs text-foreground/50">
      <p>
        {from}&ndash;{to} of {total}
      </p>
      <div className="flex items-center gap-4">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className="text-foreground/70 hover:text-foreground">
            Previous
          </Link>
        ) : (
          <span className="text-foreground/25">Previous</span>
        )}
        <span>
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} className="text-foreground/70 hover:text-foreground">
            Next
          </Link>
        ) : (
          <span className="text-foreground/25">Next</span>
        )}
      </div>
    </div>
  );
}
