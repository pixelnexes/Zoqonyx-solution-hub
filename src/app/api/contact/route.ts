import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Combine subject and phone cleanly with the message body
    const formattedMessage = [
      subject ? `Subject: ${String(subject).trim()}` : null,
      phone ? `Phone: ${String(phone).trim()}` : null,
      "",
      String(message).trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    let messageId = `msg_${Date.now()}`;
    try {
      // Save to database
      const savedMessage = await prisma.contactMessage.create({
        data: {
          name: String(name).trim(),
          email: String(email).trim(),
          message: formattedMessage,
        },
      });
      messageId = savedMessage.id;
    } catch (dbError) {
      console.warn("Prisma contact persistence fallback (database offline):", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received.",
      id: messageId,
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
