import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }

    const user = await verifyAccessToken(accessToken);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
