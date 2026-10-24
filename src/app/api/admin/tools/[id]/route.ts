import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.tool.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.isComingSoon !== undefined && { isComingSoon: body.isComingSoon }),
        ...(body.order !== undefined && { order: Number(body.order) }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDesc !== undefined && { metaDesc: body.metaDesc }),
      },
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("Error updating tool:", err);
    return NextResponse.json({ error: "Failed to update tool." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.tool.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error deleting tool:", err);
    return NextResponse.json({ error: "Failed to delete tool." }, { status: 500 });
  }
}
