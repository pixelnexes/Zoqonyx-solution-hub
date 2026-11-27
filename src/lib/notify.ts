import nodemailer from "nodemailer";

// Lead emails. Needs SMTP_USER and SMTP_PASS in the hosting environment; without them nothing is sent
// and the lead is only stored in the admin panel.
const DEFAULT_TO = "info@newixtechsolutions.com";

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function mailRecipients(): string[] {
  return (process.env.LEAD_NOTIFY_TO || DEFAULT_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Emails the team about a website enquiry. Never throws; returns true only if the mail server accepted it. */
export async function sendLeadEmail(
  title: string,
  fields: Record<string, string>,
  replyTo?: string
): Promise<boolean> {
  if (!mailConfigured()) return false;
  const port = Number(process.env.SMTP_PORT || 465);
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      // Don't keep the visitor waiting if the mail server is slow.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });
    const body = Object.entries(fields)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    await transport.sendMail({
      from: { name: "Zoqonyx website", address: process.env.SMTP_FROM || (process.env.SMTP_USER as string) },
      to: mailRecipients(),
      replyTo: replyTo || undefined,
      subject: title.replace(/[\r\n]+/g, " ").slice(0, 150),
      text: `${title}\n\n${body}\n\nAll enquiries: https://zoqonyx.com/admin/leads\n`,
    });
    return true;
  } catch (e) {
    console.error("Lead email failed:", e instanceof Error ? e.message : e);
    return false;
  }
}
