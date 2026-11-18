import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ensureContentTables } from "@/lib/content-db";
import { RESOURCES, cleanBody, isResourceKey } from "@/lib/content-resources";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { resource, id } = await ctx.params;
  if (!isResourceKey(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const def = RESOURCES[resource];
  try {
    await ensureContentTables();
    const data = cleanBody(def, await req.json());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma as any)[def.model].update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Could not save.";
    const duplicate = /Unique constraint/i.test(msg);
    return NextResponse.json({ error: duplicate ? "That URL slug is already used." : msg.slice(0, 200) }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { resource, id } = await ctx.params;
  if (!isResourceKey(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const def = RESOURCES[resource];
  try {
    await ensureContentTables();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any)[def.model].delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete." }, { status: 400 });
  }
}
