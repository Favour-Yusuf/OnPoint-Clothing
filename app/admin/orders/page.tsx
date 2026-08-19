import type { Metadata } from "next";
import { getOrdersForAdmin } from "@/lib/orders";
import { OrdersTable } from "@/components/admin/orders-table";
import { Pagination } from "@/components/admin/pagination";
import { SearchInput } from "@/components/admin/search-input";
import { FilterSelect } from "@/components/admin/filter-select";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Orders",
};

const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const hasFilters = Boolean(params.q || params.status || params.payment);

  const { orders, total } = await getOrdersForAdmin({
    search: params.q,
    status: (params.status as OrderStatus) || "all",
    paymentStatus: (params.payment as PaymentStatus) || "all",
    page,
    pageSize: PAGE_SIZE,
  });

  if (total === 0 && !hasFilters) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="font-display text-2xl font-light text-foreground">Orders</h1>
        <EmptyState title="No orders yet." description="Orders will appear here when customers make a purchase." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-light text-foreground">Orders</h1>
        <SearchInput placeholder="Search order, name, email, phone…" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <FilterSelect
          paramName="status"
          label="Status"
          options={[
            { value: "all", label: "All statuses" },
            ...Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => ({ value, label })),
          ]}
        />
        <FilterSelect
          paramName="payment"
          label="Payment"
          options={[
            { value: "all", label: "All payments" },
            ...Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      <div className="mt-6">
        <OrdersTable orders={orders} />
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          basePath="/admin/orders"
          searchParams={{ q: params.q, status: params.status, payment: params.payment }}
        />
      </div>
    </div>
  );
}
