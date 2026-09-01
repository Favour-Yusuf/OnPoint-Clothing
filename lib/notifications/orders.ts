import "server-only";
import { sendAdminEmail } from "@/lib/notifications/channels/email";
import { sendAdminWhatsApp } from "@/lib/notifications/channels/whatsapp";
import { formatPrice } from "@/lib/format";
import type { PaidOrderNotification } from "@/lib/notifications/types";

function formatItemLine(item: PaidOrderNotification["items"][number]): string {
  const attrs = [item.size, item.color].filter(Boolean).join(", ");
  return `  • ${item.productName}${attrs ? ` (${attrs})` : ""} × ${item.quantity}: ${formatPrice(item.totalPrice / 100)}`;
}

function buildEmail(order: PaidOrderNotification) {
  const address = order.shippingAddress;
  const text = `New paid order: ${order.orderNumber}

Customer: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone ?? "Not provided"}

Items:
${order.items.map(formatItemLine).join("\n")}

Total: ${formatPrice(order.total / 100)}

Shipping to:
${address.fullName}
${address.address1}${address.address2 ? `\n${address.address2}` : ""}
${address.city}, ${address.state} ${address.postalCode}
${address.country}

View in admin: ${order.adminUrl}
`;
  return { subject: `New paid order: ${order.orderNumber} (${formatPrice(order.total / 100)})`, text };
}

function buildWhatsApp(order: PaidOrderNotification): string {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return [
    "New OnPoint order paid!",
    `#${order.orderNumber}: ${order.customerName}`,
    `${itemCount} item${itemCount === 1 ? "" : "s"}: ${formatPrice(order.total / 100)}`,
    order.adminUrl,
  ].join("\n");
}

/** Fires both admin notifications concurrently. Never throws — each channel already handles its own failures. */
export async function notifyAdminOfPaidOrder(order: PaidOrderNotification): Promise<void> {
  await Promise.allSettled([sendAdminEmail(buildEmail(order)), sendAdminWhatsApp(buildWhatsApp(order))]);
}
