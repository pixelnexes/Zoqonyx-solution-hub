import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ensureContentTables } from "@/lib/content-db";
import { BLOG_SEEDS } from "@/lib/blog-seed";
import { getServices } from "@/lib/content";
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
    const have = new Set<string>(rows.map((r: { slug: string }) => r.slug));
    const now = Date.now();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let out: any[] = rows.map((r: any) => ({ ...r, source: "admin", ...(resource === "blog" ? { state: r.status === "draft" ? "draft" : r.publishedAt && new Date(r.publishedAt).getTime() > now ? "scheduled" : "live" } : {}) }));
    if (resource === "blog") {
      const seeds = BLOG_SEEDS.filter((s) => !have.has(s.slug)).map((s) => ({
        id: `seed:${s.slug}`, source: "built-in", slug: s.slug, title: s.title, status: "published",
        state: new Date(s.publishedAt + "T00:00:00Z").getTime() > now ? "scheduled" : "live",
        publishedAt: new Date(s.publishedAt + "T00:00:00Z").toISOString(), category: s.category, tags: s.tags.join(", "),
        excerpt: s.excerpt, content: s.content, coverImage: "", authorName: "Zoqonyx Team", metaTitle: s.metaTitle, metaDesc: s.metaDesc,
      }));
      out = [...out, ...seeds];
    } else if (resource === "services") {
      const seeds = (await getServices()).filter((s) => !have.has(s.slug)).map((s) => ({
        id: `seed:${s.slug}`, source: "built-in", slug: s.slug, name: s.name, groupName: s.group, isActive: true, order: s.order,
        shortDesc: s.shortDesc, content: s.content, faqs: JSON.stringify(s.faqs), metaTitle: s.metaTitle, metaDesc: s.metaDesc,
      }));
      out = [...out, ...seeds];
    }
    return NextResponse.json(out);
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
