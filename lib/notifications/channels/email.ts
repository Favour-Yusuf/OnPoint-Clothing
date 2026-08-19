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

/** Best-effort — logs and returns on any failure rather than throwing. */
export async function sendAdminEmail({ subject, text }: { subject: string; text: string }): Promise<void> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  const transport = getTransporter();
  if (!to || !transport) {
    console.error(
      "sendAdminEmail: not configured — set YAHOO_SMTP_USER, YAHOO_SMTP_APP_PASSWORD, ADMIN_NOTIFICATION_EMAIL"
    );
    return;
  }

  try {
    await transport.sendMail({ from: `"OnPoint Clothing" <${process.env.YAHOO_SMTP_USER}>`, to, subject, text });
  } catch (error) {
    console.error(`sendAdminEmail: send failed ("${subject}"):`, error);
  }
}
