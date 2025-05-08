import { NextRequest, NextResponse } from "next/server";

import { generateAccessToken, verifyRefreshToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 401 }
      );
    }

    const user = await verifyRefreshToken(refreshToken);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const newAccessToken = generateAccessToken(user);

    const response = NextResponse.json({ message: "Access token refreshed" });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
