import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureContentTables } from "@/lib/content-db";

export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}
const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

// Visitors send a review; it is saved unpublished and shown only after the admin approves it.
export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (tooMany(ip)) return NextResponse.json({ error: "Too many reviews from this connection. Please try again later." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (clip(body.website, 200)) return NextResponse.json({ success: true });

  const name = clip(body.name, 80);
  const quote = clip(body.quote, 1200);
  const rating = Math.round(Number(body.rating));
  const problems: string[] = [];
  if (!name) problems.push("your name");
  if (!(rating >= 1 && rating <= 5)) problems.push("a star rating");
  if (quote.length < 20) problems.push("a review of at least 20 characters");
  if (/https?:\/\//i.test(quote)) problems.push("a review without links");
  if (problems.length) return NextResponse.json({ error: "Please add " + problems.join(", ") + "." }, { status: 400 });

  try {
    await ensureContentTables();
    await prisma.testimonial.create({
      data: { name, role: clip(body.role, 80), company: "", quote, rating, serviceSlug: "", isPublished: false, order: 0 },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Review could not be saved:", e);
    return NextResponse.json({ error: "We couldn't save your review right now. Please try again later." }, { status: 503 });
  }
}
