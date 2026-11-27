import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadEmail } from "@/lib/notify";
import { tooMany } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  if (tooMany(req, "contact")) {
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
  const phone = clip(body.phone, 60);
  const subject = clip(body.subject, 150);
  const message = clip(body.message, 4000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ error: "Please enter a phone or WhatsApp number." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Please write a message of at least 10 characters." }, { status: 400 });
  }

  const stored = [subject ? `Subject: ${subject}` : null, `Phone: ${phone}`, "", message]
    .filter((line) => line !== null)
    .join("\n");

  let saved = false;
  try {
    await prisma.contactMessage.create({ data: { name, email, message: stored } });
    saved = true;
  } catch (e) {
    console.error("Contact message could not be saved:", e);
  }

  // Email even if saving failed, so the enquiry still reaches someone.
  const mailed = await sendLeadEmail(
    `New contact message: ${subject || name}`,
    {
      Name: name,
      Email: email,
      "Phone / WhatsApp": phone,
      Subject: subject,
      Message: "\n" + message,
      "Saved in admin": saved ? "yes" : "NO - keep this email",
    },
    email
  );

  if (saved || mailed) {
    return NextResponse.json({ success: true, message: "Thank you! Your message has been received." });
  }
  return NextResponse.json(
    { error: "We couldn't send your message right now. Please email info@newixtechsolutions.com instead." },
    { status: 503 }
  );
}
