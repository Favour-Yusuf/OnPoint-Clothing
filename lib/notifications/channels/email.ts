import "server-only";
import nodemailer from "nodemailer";

// Lazily created and cached across invocations (a fresh SMTP connection per
// event would be wasteful) — Spacemail (mail.spacemail.com), not a
// transactional email provider. See .env.example for the vars this needs.
//
// SMTP_USER authenticates as info@justonpointng.com (the real mailbox —
// aliases like noreply@ can't log in on their own), but outgoing mail is
// sent as FROM_ADDRESS below so customers see the address the alias was
// actually set up for.
const FROM_ADDRESS = "noreply@justonpointng.com";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    host: "mail.spacemail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  return transporter;
}

/** Shared send path. Returns whether the send actually succeeded, so callers that need to know (unlike the fire-and-forget admin notifications) can act on failure. */
async function send({ to, subject, text }: { to: string; subject: string; text: string }): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.error("email: not configured — set SMTP_USER, SMTP_PASSWORD");
    return false;
  }

  try {
    await transport.sendMail({ from: `"OnPoint Clothing" <${FROM_ADDRESS}>`, to, subject, text });
    return true;
  } catch (error) {
    console.error(`email: send failed ("${subject}"):`, error);
    return false;
  }
}

/** Best-effort — logs and returns on any failure rather than throwing. */
export async function sendAdminEmail({ subject, text }: { subject: string; text: string }): Promise<void> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!to) {
    console.error("sendAdminEmail: not configured — set ADMIN_NOTIFICATION_EMAIL");
    return;
  }
  await send({ to, subject, text });
}

/** Same as sendAdminEmail, but for bespoke enquiries specifically — routed to its own inbox (ADMIN_BESPOKE_EMAIL) so it doesn't mix in with order alerts, falling back to the shared admin address if that's not set. */
export async function sendBespokeAdminEmail({ subject, text }: { subject: string; text: string }): Promise<void> {
  const to = process.env.ADMIN_BESPOKE_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!to) {
    console.error("sendBespokeAdminEmail: not configured — set ADMIN_BESPOKE_EMAIL or ADMIN_NOTIFICATION_EMAIL");
    return;
  }
  await send({ to, subject, text });
}

/** Sends to an arbitrary customer address. Returns success so callers (e.g. the abandoned-checkout cron) can decide whether to retry. */
export async function sendCustomerEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  return send({ to, subject, text });
}
