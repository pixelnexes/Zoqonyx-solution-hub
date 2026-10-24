import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = await prisma.page.findMany({
    orderBy: { slug: "asc" },
  });

  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, title, content, metaTitle, metaDesc } = await req.json();

    const page = await prisma.page.upsert({
      where: { slug },
      update: {
        title,
        content,
        metaTitle,
        metaDesc,
      },
      create: {
        slug,
        title,
        content,
        metaTitle,
        metaDesc,
      },
    });

    return NextResponse.json(page);
  } catch (err: unknown) {
    console.error("Error updating page:", err);
    return NextResponse.json({ error: "Failed to update page." }, { status: 500 });
  }
}
