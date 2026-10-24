import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, toolSlug } = body;

    if (!email || !toolSlug) {
      return NextResponse.json(
        { error: "Email and toolSlug are required." },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Upsert or create
    await prisma.notificationSubscriber.upsert({
      where: {
        email_toolSlug: {
          email: trimmedEmail,
          toolSlug: String(toolSlug),
        },
      },
      update: {},
      create: {
        email: trimmedEmail,
        toolSlug: String(toolSlug),
      },
    });

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll notify you as soon as this tool launches.",
    });
  } catch (error) {
    console.error("Error subscribing to tool notification:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
