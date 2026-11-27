import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadEmail } from "@/lib/notify";
import { tooMany } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (tooMany(req, "subscribe")) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }
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

    await sendLeadEmail("New tool waitlist signup", { Email: trimmedEmail, Tool: String(toolSlug).slice(0, 120) }, trimmedEmail);

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
