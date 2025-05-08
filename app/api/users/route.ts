import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { verifyAccessToken } from "@/utils/auth";
import { User } from "@/types/user";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";
import { userSchema } from "@/schemas/user-schema";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await readJsonFile<User[]>("users.json");
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = userSchema.parse(body);
    const users = await readJsonFile<User[]>("users.json");
    const newUser: User = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username: data.username,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      avatar: data.avatar || "default-avatar.png",
      role: data.role,
    };
    users.push(newUser);
    await writeJsonFile("users.json", users);
    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
