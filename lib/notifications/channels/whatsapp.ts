import "server-only";

/**
 * Sends a WhatsApp ping to the admin via CallMeBot — a free, unofficial
 * webhook-style API well suited to a single fixed recipient (not the
 * official WhatsApp Business Platform, which is only needed for
 * customer-facing messages). See .env.example for the vars this needs and
 * how to obtain the API key.
 *
 * Best-effort — logs and returns on any failure rather than throwing.
 */
export async function sendAdminWhatsApp(text: string): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE?.replace(/[^\d]/g, "");
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!phone || !apiKey) {
    console.error("sendAdminWhatsApp: not configured — set CALLMEBOT_PHONE, CALLMEBOT_API_KEY");
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`sendAdminWhatsApp: CallMeBot request failed (${response.status})`);
    }
  } catch (error) {
    console.error("sendAdminWhatsApp: request failed:", error);
  }
}
