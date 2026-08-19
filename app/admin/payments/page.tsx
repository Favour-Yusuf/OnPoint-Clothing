import type { Metadata } from "next";
import { getPaymentsForAdmin } from "@/lib/payments";
import { PaymentsTable } from "@/components/admin/payments-table";
import { Pagination } from "@/components/admin/pagination";
import { SearchInput } from "@/components/admin/search-input";
import { FilterSelect } from "@/components/admin/filter-select";
import { PAYMENT_STATUS_LABEL } from "@/components/admin/status-badge";
import type { PaymentStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Payments",
};

const PAGE_SIZE = 20;

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { payments, total } = await getPaymentsForAdmin({
    search: params.q,
    status: (params.status as PaymentStatus) || "all",
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-light text-foreground">Payments</h1>
        <SearchInput placeholder="Search reference, order, customer…" />
      </div>

      <div className="mt-4">
        <FilterSelect
          paramName="status"
          label="Status"
          options={[
            { value: "all", label: "All statuses" },
            ...Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      <div className="mt-6">
        <PaymentsTable payments={payments} />
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          basePath="/admin/payments"
          searchParams={{ q: params.q, status: params.status }}
        />
      </div>
    </div>
  );
}
