import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, OrderItem, OrderStatus, PaymentStatus, ShippingAddress } from "@/lib/types";

/**
 * Order read layer. Mirrors the lib/products.ts pattern: components/pages
 * import from here, never query `orders`/`order_items` directly, so the
 * mapping between DB rows and the `Order` shape stays in one place.
 */

const ORDER_SELECT = `
  id, order_number, user_id, customer_name, customer_email, customer_phone,
  status, payment_status, subtotal, shipping_fee, discount, total, currency,
  shipping_address, paystack_reference, created_at,
  order_items ( id, product_name, size, color, quantity, unit_price, total_price )
`;

// Admin order detail additionally best-effort joins each item's product for
// a thumbnail. This is a display convenience only — product_name/size/color/
// price on order_items remain the authoritative historical snapshot, and the
// image simply won't resolve if the product was later removed.
const ORDER_SELECT_ADMIN_DETAIL = `
  id, order_number, user_id, customer_name, customer_email, customer_phone,
  status, payment_status, subtotal, shipping_fee, discount, total, currency,
  shipping_address, paystack_reference, created_at,
  order_items (
    id, product_name, size, color, quantity, unit_price, total_price,
    products ( slug, product_images ( url, position ) )
  )
`;

type OrderRow = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  currency: string;
  shipping_address: ShippingAddress;
  paystack_reference: string | null;
  created_at: string;
  order_items: {
    id: string;
    product_name: string;
    size: string | null;
    color: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    products?: { slug: string; product_images: { url: string; position: number }[] } | null;
  }[];
};

function mapOrderRow(row: OrderRow): Order {
  const items: OrderItem[] = row.order_items.map((item) => {
    const images = item.products?.product_images ?? [];
    const firstImage = [...images].sort((a, b) => a.position - b.position)[0];
    return {
      id: item.id,
      productName: item.product_name,
      productSlug: item.products?.slug ?? null,
      imageUrl: firstImage?.url ?? null,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price,
    };
  });

  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    status: row.status,
    paymentStatus: row.payment_status,
    subtotal: row.subtotal,
    shippingFee: row.shipping_fee,
    discount: row.discount,
    total: row.total,
    currency: row.currency,
    shippingAddress: row.shipping_address,
    paystackReference: row.paystack_reference,
    items,
    createdAt: row.created_at,
  };
}

export async function getOrdersForCurrentUser(limit?: number): Promise<Order[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (typeof limit === "number") query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`getOrdersForCurrentUser: ${error.message}`);
  return (data as unknown as OrderRow[]).map(mapOrderRow);
}

// Looked up by Paystack reference on the payment success page — uses the
// admin client because at that point the request may be an unauthenticated
// guest who still needs to see their own just-placed order.
export async function getOrderByReference(reference: string): Promise<Order | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("paystack_reference", reference)
    .maybeSingle();
  if (error) throw new Error(`getOrderByReference: ${error.message}`);
  return data ? mapOrderRow(data as unknown as OrderRow) : undefined;
}

// Admin-only lookups — callers are responsible for verifying the current
// user is an admin before calling these (see app/admin/layout.tsx).

export type AdminOrderFilters = {
  search?: string;
  status?: OrderStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  page?: number; // 1-based
  pageSize?: number;
};

export async function getOrdersForAdmin(
  filters: AdminOrderFilters = {}
): Promise<{ orders: Order[]; total: number }> {
  const { search, status, paymentStatus, dateFrom, dateTo, page = 1, pageSize = 20 } = filters;
  const supabase = await createClient();

  let query = supabase.from("orders").select(ORDER_SELECT, { count: "exact" }).order("created_at", {
    ascending: false,
  });

  if (status && status !== "all") query = query.eq("status", status);
  if (paymentStatus && paymentStatus !== "all") query = query.eq("payment_status", paymentStatus);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);
  if (search?.trim()) {
    const term = search.trim().replace(/[%,]/g, "");
    query = query.or(
      `order_number.ilike.%${term}%,customer_name.ilike.%${term}%,customer_email.ilike.%${term}%,customer_phone.ilike.%${term}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) throw new Error(`getOrdersForAdmin: ${error.message}`);

  return { orders: (data as unknown as OrderRow[]).map(mapOrderRow), total: count ?? 0 };
}

export async function getOrderByIdForAdmin(orderId: string): Promise<Order | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT_ADMIN_DETAIL)
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw new Error(`getOrderByIdForAdmin: ${error.message}`);
  return data ? mapOrderRow(data as unknown as OrderRow) : undefined;
}

export async function getOrdersForCustomerAdmin(params: {
  userId?: string | null;
  email?: string;
}): Promise<Order[]> {
  const supabase = await createClient();
  let query = supabase.from("orders").select(ORDER_SELECT).order("created_at", { ascending: false });
  query = params.userId ? query.eq("user_id", params.userId) : query.eq("customer_email", params.email ?? "");

  const { data, error } = await query;
  if (error) throw new Error(`getOrdersForCustomerAdmin: ${error.message}`);
  return (data as unknown as OrderRow[]).map(mapOrderRow);
}
