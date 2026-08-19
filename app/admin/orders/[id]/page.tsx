import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { getOrderByIdForAdmin } from "@/lib/orders";
import { getPaymentByOrderId } from "@/lib/payments";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badge";
import { MediaImage } from "@/components/ui/media-image";

export const metadata: Metadata = {
  title: "Order Detail",
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderByIdForAdmin(id);
  if (!order) notFound();

  const payment = await getPaymentByOrderId(order.id);
  const isRegistered = Boolean(order.userId);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/orders" className="font-sans text-xs text-foreground/50 hover:text-foreground">
        &larr; All Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-light text-foreground">{order.orderNumber}</h1>
          <div className="mt-2 flex items-center gap-4">
            <PaymentStatusBadge status={order.paymentStatus} />
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-2 font-sans text-sm text-foreground/45">
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <OrderStatusControl orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-sans text-xs font-light tracking-[0.2em] text-foreground/50 uppercase">Items</h2>
            <div className="mt-4 flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 font-sans text-sm">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-foreground/5">
                    {item.imagePublicId ? (
                      <MediaImage image={{ publicId: item.imagePublicId, alt: item.productName }} sizes="64px" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{item.productName}</p>
                    <p className="text-foreground/50">
                      {item.size ? `Size ${item.size}` : null}
                      {item.size && item.color ? " · " : null}
                      {item.color ?? null}
                      {(item.size || item.color) && " · "}
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span className="font-light tracking-wide text-foreground tabular-nums">{formatPrice(item.totalPrice / 100)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 font-sans text-sm">
              <div className="flex justify-between text-foreground/60">
                <span>Subtotal</span>
                <span className="font-light tracking-wide tabular-nums">{formatPrice(order.subtotal / 100)}</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>Shipping</span>
                <span className="font-light tracking-wide tabular-nums">{formatPrice(order.shippingFee / 100)}</span>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between text-foreground/60">
                  <span>Discount</span>
                  <span className="font-light tracking-wide tabular-nums">&minus;{formatPrice(order.discount / 100)}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-foreground/10 pt-2 text-base text-foreground">
                <span>Total</span>
                <span className="font-light tracking-wide tabular-nums">{formatPrice(order.total / 100)}</span>
              </div>
            </div>
          </section>

          {payment ? (
            <section>
              <h2 className="font-sans text-xs font-light tracking-[0.2em] text-foreground/50 uppercase">
                Payment
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 font-sans text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-foreground/45">Provider</dt>
                  <dd className="mt-0.5 text-foreground capitalize">{payment.provider}</dd>
                </div>
                <div>
                  <dt className="text-foreground/45">Reference</dt>
                  <dd className="mt-0.5 font-mono text-xs text-foreground">{payment.reference}</dd>
                </div>
                <div>
                  <dt className="text-foreground/45">Amount</dt>
                  <dd className="mt-0.5 font-light tracking-wide text-foreground tabular-nums">
                    {formatPrice(payment.amount / 100)} {payment.currency}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground/45">Status</dt>
                  <dd className="mt-0.5">
                    <PaymentStatusBadge status={payment.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground/45">Paid</dt>
                  <dd className="mt-0.5 text-foreground">
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "—"}
                  </dd>
                </div>
              </dl>
            </section>
          ) : null}
        </div>

        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-sans text-xs font-light tracking-[0.2em] text-foreground/50 uppercase">Customer</h2>
            <div className="mt-4 font-sans text-sm text-foreground/70">
              <p className="text-foreground">{order.customerName}</p>
              <p>{order.customerEmail}</p>
              {order.customerPhone ? <p>{order.customerPhone}</p> : null}
              <p className="mt-2 text-xs text-foreground/45">
                {isRegistered ? "Registered customer" : "Guest checkout"}
              </p>
              {isRegistered ? (
                <Link
                  href={`/admin/customers/${order.userId}`}
                  className="mt-1 inline-block font-sans text-xs text-foreground/70 underline-offset-4 hover:underline"
                >
                  View customer
                </Link>
              ) : null}
            </div>
          </section>

          <section>
            <h2 className="font-sans text-xs font-light tracking-[0.2em] text-foreground/50 uppercase">
              Shipping Address
            </h2>
            <div className="mt-4 font-sans text-sm text-foreground/70 select-all">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 ? <p>{order.shippingAddress.address2}</p> : null}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone ? <p className="mt-2">{order.shippingAddress.phone}</p> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
