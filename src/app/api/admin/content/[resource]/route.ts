import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ensureContentTables } from "@/lib/content-db";
import { RESOURCES, cleanBody, isResourceKey } from "@/lib/content-resources";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { resource } = await ctx.params;
  if (!isResourceKey(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const def = RESOURCES[resource];
  try {
    await ensureContentTables();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (prisma as any)[def.model].findMany({ orderBy: def.orderBy });
    return NextResponse.json(rows);
  } catch (e) {
    console.error("admin list failed", e);
    return NextResponse.json({ error: "The database is not reachable. Check DATABASE_URL." }, { status: 503 });
  }
}

export async function POST(req: Request, ctx: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { resource } = await ctx.params;
  if (!isResourceKey(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const def = RESOURCES[resource];
  if (!def.canCreate) return NextResponse.json({ error: "Not allowed" }, { status: 405 });
  try {
    await ensureContentTables();
    const data = cleanBody(def, await req.json());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma as any)[def.model].create({ data });
    return NextResponse.json(row, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Could not save.";
    const duplicate = /Unique constraint/i.test(msg);
    return NextResponse.json({ error: duplicate ? "That URL slug is already used." : msg.slice(0, 200) }, { status: 400 });
  }
}
