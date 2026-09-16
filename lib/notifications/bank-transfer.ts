import "server-only";
import { sendAdminEmail } from "@/lib/notifications/channels/email";
import { sendAdminWhatsApp } from "@/lib/notifications/channels/whatsapp";
import { formatPrice } from "@/lib/format";
import type { BankTransferOrderNotification } from "@/lib/notifications/types";

function formatItemLine(item: BankTransferOrderNotification["items"][number]): string {
  const attrs = [item.size, item.color].filter(Boolean).join(", ");
  return `  • ${item.productName}${attrs ? ` (${attrs})` : ""} × ${item.quantity}: ${formatPrice(item.totalPrice / 100)}`;
}

function buildEmail(order: BankTransferOrderNotification) {
  const address = order.shippingAddress;
  const text = `New bank transfer order: ${order.orderNumber}

Payment not yet confirmed — the customer still needs to send the transfer
and its receipt on WhatsApp. Don't fulfil until payment is confirmed and
marked paid in admin.

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
  return { subject: `New bank transfer order (awaiting payment): ${order.orderNumber} (${formatPrice(order.total / 100)})`, text };
}

function buildWhatsApp(order: BankTransferOrderNotification): string {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return [
    "New OnPoint order — bank transfer, awaiting payment!",
    `#${order.orderNumber}: ${order.customerName}`,
    `${itemCount} item${itemCount === 1 ? "" : "s"}: ${formatPrice(order.total / 100)}`,
    order.adminUrl,
  ].join("\n");
}

/** Fires both admin notifications concurrently. Never throws — each channel already handles its own failures. */
export async function notifyAdminOfBankTransferOrder(order: BankTransferOrderNotification): Promise<void> {
  await Promise.allSettled([sendAdminEmail(buildEmail(order)), sendAdminWhatsApp(buildWhatsApp(order))]);
}
