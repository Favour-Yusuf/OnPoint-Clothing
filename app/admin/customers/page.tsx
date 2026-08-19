import type { Metadata } from "next";
import { getCustomersForAdmin } from "@/lib/customers";
import { CustomersTable } from "@/components/admin/customers-table";
import { Pagination } from "@/components/admin/pagination";
import { SearchInput } from "@/components/admin/search-input";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Customers",
};

const PAGE_SIZE = 20;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { customers, total } = await getCustomersForAdmin({ search: params.q, page, pageSize: PAGE_SIZE });

  if (total === 0 && !params.q) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="font-display text-2xl font-light text-foreground">Customers</h1>
        <EmptyState title="No customers yet." description="Customers will appear here after their first order." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-light text-foreground">Customers</h1>
        <SearchInput placeholder="Search name or email…" />
      </div>

      <div className="mt-6">
        <CustomersTable customers={customers} />
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          basePath="/admin/customers"
          searchParams={{ q: params.q }}
        />
      </div>
    </div>
  );
}
