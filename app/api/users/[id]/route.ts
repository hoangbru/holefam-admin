import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { verifyAccessToken } from "@/utils/auth";
import { User } from "@/types/user";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";
import { userSchema } from "@/schemas/user-schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await readJsonFile<User[]>("users.json");
  const targetUser = users.find((u) => u.id === parseInt(params.id));
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(targetUser);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = userSchema.parse(body);
    const users = await readJsonFile<User[]>("users.json");
    const index = users.findIndex((u) => u.id === parseInt(params.id));
    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    users[index] = {
      id: parseInt(params.id),
      username: data.username,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      avatar: users[index].avatar, // Preserve the existing avatar
      role: data.role,
    };
    await writeJsonFile("users.json", users);
    return NextResponse.json(users[index]);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await readJsonFile<User[]>("users.json");
  const filteredUsers = users.filter((u) => u.id !== parseInt(params.id));
  if (filteredUsers.length === users.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  await writeJsonFile("users.json", filteredUsers);
  return NextResponse.json({ success: true });
}
