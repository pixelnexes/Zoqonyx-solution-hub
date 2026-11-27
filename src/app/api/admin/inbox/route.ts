import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { mailConfigured, mailRecipients } from "@/lib/notify";

export const dynamic = "force-dynamic";

/** Latest enquiries, polled by the admin panel to raise alerts. */
export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const query = { orderBy: { createdAt: "desc" as const }, take: 5 };
  // Either table may be unavailable; still report the other one.
  const [leads, messages] = await Promise.all([
    prisma.lead.findMany(query).catch(() => []),
    prisma.contactMessage.findMany(query).catch(() => []),
  ]);
  const items = [
    ...leads.map((l) => ({ id: l.id, name: l.name, what: l.service || "Lead form", href: "/admin/leads", at: l.createdAt })),
    ...messages.map((m) => ({ id: m.id, name: m.name, what: "Contact form", href: "/admin/messages", at: m.createdAt })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());
  return NextResponse.json({ items, mail: { configured: mailConfigured(), to: mailRecipients() } });
}
