import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error returning site settings:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}
