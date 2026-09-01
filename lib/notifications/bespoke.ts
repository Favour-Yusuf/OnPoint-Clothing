import "server-only";
import { sendAdminEmail } from "@/lib/notifications/channels/email";
import { sendAdminWhatsApp } from "@/lib/notifications/channels/whatsapp";
import type { BespokeRequestNotification } from "@/lib/notifications/types";

function buildEmail(request: BespokeRequestNotification) {
  const text = `New bespoke enquiry from ${request.name}

Email: ${request.email}
Phone: ${request.phone ?? "Not provided"}
Garment type: ${request.garmentType}

Notes:
${request.notes}

View in admin: ${request.adminUrl}
`;
  return { subject: `New bespoke enquiry: ${request.name} (${request.garmentType})`, text };
}

function buildWhatsApp(request: BespokeRequestNotification): string {
  return [
    "New OnPoint bespoke enquiry!",
    `${request.name}: ${request.garmentType}`,
    request.phone ? `Phone: ${request.phone}` : `Email: ${request.email}`,
    request.adminUrl,
  ].join("\n");
}

/** Fires both admin notifications concurrently. Never throws — each channel already handles its own failures. */
export async function notifyAdminOfBespokeRequest(request: BespokeRequestNotification): Promise<void> {
  await Promise.allSettled([sendAdminEmail(buildEmail(request)), sendAdminWhatsApp(buildWhatsApp(request))]);
}
