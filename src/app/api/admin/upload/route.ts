import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(png|jpe?g|svg|webp|ico|gif)$/i)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PNG, JPG, SVG, WebP, or ICO image." },
        { status: 400 }
      );
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 5MB size limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitize extension and filename
    const ext = path.extname(file.name).toLowerCase() || ".png";
    const baseClean = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${baseClean}_${Date.now()}${ext}`;
    const destinationPath = path.join(uploadsDir, uniqueFilename);

    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
    });
  } catch (error: any) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { error: "Failed to upload file: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
