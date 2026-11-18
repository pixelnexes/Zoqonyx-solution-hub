import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureContentTables } from "@/lib/content-db";

export const dynamic = "force-dynamic";

// Very small in-memory limiter: 5 submissions per IP per 10 minutes.
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (tooMany(ip)) {
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
  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Please enter your name, a valid email and a short message." }, { status: 400 });
  }

  try {
    await ensureContentTables();
    await prisma.lead.create({
      data: {
        name,
        email,
        phone: clip(body.phone, 60),
        company: clip(body.company, 120),
        service: clip(body.service, 120),
        budget: clip(body.budget, 60),
        message,
        sourcePage: clip(body.sourcePage, 190),
        notes: "",
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Lead could not be saved:", e);
    // Don't pretend it worked: the visitor needs another way to reach us.
    return NextResponse.json(
      { error: "We couldn't save your message right now. Please email hello@zoqonyx.com instead." },
      { status: 503 }
    );
  }
}
