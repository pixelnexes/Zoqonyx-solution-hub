import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureContentTables } from "@/lib/content-db";
import { sendLeadEmail } from "@/lib/notify";
import { tooMany } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  if (tooMany(req, "lead")) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Hidden "website" field: real people leave it empty, many bots fill it in.
  if (clip(body.website, 200)) return NextResponse.json({ success: true });

  const name = clip(body.name, 120);
  const email = clip(body.email, 190);
  const message = clip(body.message, 4000);
  const phone = clip(body.phone, 60);
  const problems: string[] = [];
  if (!name) problems.push("your name");
  if (!EMAIL_RE.test(email)) problems.push("a valid email");
  if (phone.replace(/\D/g, "").length < 7) problems.push("a phone or WhatsApp number");
  if (message.length < 10) problems.push("a message of at least 10 characters");
  if (problems.length) {
    return NextResponse.json({ error: "Please add " + problems.join(", ") + "." }, { status: 400 });
  }

  const lead = {
    name,
    email,
    phone,
    company: clip(body.company, 120),
    service: clip(body.service, 120),
    budget: clip(body.budget, 60),
    message,
    sourcePage: clip(body.sourcePage, 190),
  };

  let saved = false;
  try {
    await ensureContentTables();
    await prisma.lead.create({ data: { ...lead, notes: "" } });
    saved = true;
  } catch (e) {
    console.error("Lead could not be saved:", e);
  }

  // Email even if saving failed, so the enquiry still reaches someone.
  const mailed = await sendLeadEmail(
    `New lead: ${name}${lead.service ? ` (${lead.service})` : ""}`,
    {
      Name: name,
      Email: email,
      "Phone / WhatsApp": phone,
      Company: lead.company,
      Service: lead.service,
      Budget: lead.budget,
      Page: lead.sourcePage,
      Message: "\n" + message,
      "Saved in admin": saved ? "yes" : "NO - keep this email",
    },
    email
  );

  if (saved || mailed) return NextResponse.json({ success: true });

  // Don't pretend it worked: the visitor needs another way to reach us.
  return NextResponse.json(
    { error: "We couldn't send your message right now. Please email info@newixtechsolutions.com instead." },
    { status: 503 }
  );
}
