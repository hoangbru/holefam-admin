import { NextRequest, NextResponse } from "next/server";

import { settingsSchema } from "@/schemas/settings-schema";
import { Setting } from "@/types/setting";
import { verifyAccessToken } from "@/utils/auth";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";

export async function GET() {
  try {
    const settings = await readJsonFile<Setting>("settings.json");
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = settingsSchema.parse(body);
    await writeJsonFile("settings.json", data);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
