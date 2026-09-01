import "server-only";
import { sendCustomerEmail } from "@/lib/notifications/channels/email";
import { formatPrice } from "@/lib/format";
import { CONTACT } from "@/lib/contact";
import type { AbandonedCheckoutNotification } from "@/lib/notifications/types";

function formatItemLine(item: AbandonedCheckoutNotification["items"][number]): string {
  const attrs = [item.size, item.color].filter(Boolean).join(", ");
  return `  • ${item.productName}${attrs ? ` (${attrs})` : ""} × ${item.quantity}: ${formatPrice(item.totalPrice / 100)}`;
}

function buildEmail(order: AbandonedCheckoutNotification) {
  const text = `Hi ${order.customerName},

You started an order with us but the payment didn't go through. Your order is still saved and nothing has been charged.

Order #${order.orderNumber}
${order.items.map(formatItemLine).join("\n")}

Total: ${formatPrice(order.total / 100)}

Pick up where you left off: ${order.checkoutUrl}

Had a problem paying, or have a question about your order? Reach us at ${CONTACT.email.display} or on WhatsApp at ${CONTACT.whatsapp.display}. We're happy to help.

OnPoint Clothing
`;
  return { subject: `You left something at OnPoint: order #${order.orderNumber}`, text };
}

/** Best-effort — returns whether the send succeeded so the caller (the abandoned-checkout cron) can decide whether to retry on the next run. */
export async function sendAbandonedCheckoutEmail(order: AbandonedCheckoutNotification): Promise<boolean> {
  const { subject, text } = buildEmail(order);
  return sendCustomerEmail({ to: order.customerEmail, subject, text });
}
