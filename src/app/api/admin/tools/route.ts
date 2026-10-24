import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tools = await prisma.tool.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(tools);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, category, icon, isActive, isComingSoon, content, metaTitle, metaDesc, order } = body;

    if (!name || !slug || !category) {
      return NextResponse.json({ error: "Name, slug, and category are required." }, { status: 400 });
    }

    const newTool = await prisma.tool.create({
      data: {
        name,
        slug,
        description: description || "",
        category,
        icon: icon || "Wrench",
        isActive: isActive ?? true,
        isComingSoon: isComingSoon ?? false,
        content: content || null,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json(newTool, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating tool:", err);
    return NextResponse.json({ error: "Failed to create tool. Check unique slug." }, { status: 500 });
  }
}
