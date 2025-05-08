import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifyAccessToken } from "@/utils/auth";

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const filePath = path.join(uploadDir, filename);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await fs.unlink(filePath);

    return NextResponse.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
