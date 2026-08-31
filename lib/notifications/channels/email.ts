import "server-only";
import nodemailer from "nodemailer";

// Lazily created and cached across invocations (a fresh SMTP connection per
// event would be wasteful) — Yahoo SMTP via an account app password, not a
// transactional email provider. See .env.example for the vars this needs.
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.YAHOO_SMTP_USER;
  const pass = process.env.YAHOO_SMTP_APP_PASSWORD;
  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
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
    console.error("email: not configured — set YAHOO_SMTP_USER, YAHOO_SMTP_APP_PASSWORD");
    return false;
  }

  try {
    await transport.sendMail({ from: `"OnPoint Clothing" <${process.env.YAHOO_SMTP_USER}>`, to, subject, text });
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
