import type { Metadata } from "next";
import { getBespokeRequestsForAdmin } from "@/lib/bespoke";
import { BespokeTable } from "@/components/admin/bespoke-table";
import { Pagination } from "@/components/admin/pagination";
import { SearchInput } from "@/components/admin/search-input";
import { FilterSelect } from "@/components/admin/filter-select";
import { BESPOKE_STATUS_LABEL } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { BespokeStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bespoke Requests",
};

const PAGE_SIZE = 20;

export default async function AdminBespokePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const hasFilters = Boolean(params.q || params.status);

  const { requests, total } = await getBespokeRequestsForAdmin({
    search: params.q,
    status: (params.status as BespokeStatus) || "all",
    page,
    pageSize: PAGE_SIZE,
  });

  if (total === 0 && !hasFilters) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="font-serif text-2xl font-light text-foreground">Bespoke Requests</h1>
        <EmptyState title="No bespoke requests yet." description="Enquiries submitted from the Bespoke page will appear here." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-light text-foreground">Bespoke Requests</h1>
        <SearchInput placeholder="Search name, email, garment…" />
      </div>

      <div className="mt-4">
        <FilterSelect
          paramName="status"
          label="Status"
          options={[
            { value: "all", label: "All statuses" },
            ...Object.entries(BESPOKE_STATUS_LABEL).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      <div className="mt-6">
        <BespokeTable requests={requests} />
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          basePath="/admin/bespoke"
          searchParams={{ q: params.q, status: params.status }}
        />
      </div>
    </div>
  );
}
