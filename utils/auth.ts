import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { readJsonFile } from "./jsonFileUtils";
import { User } from "@/types/user";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET as string;

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = await readJsonFile<User[]>("users.json");
  const user = users.find((u) => u.email === email);
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
}

export function generateAccessToken(user: User): string {
  return jwt.sign({ userId: user.id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(user: User): string {
  return jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export async function verifyAccessToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: number;
      role: string;
    };
    const users = await readJsonFile<User[]>("users.json");
    const user = users.find((u) => u.id === decoded.userId);
    return user || null;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as {
      userId: number;
    };
    const users = await readJsonFile<User[]>("users.json");
    const user = users.find((u) => u.id === decoded.userId);
    return user || null;
  } catch {
    return null;
  }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  const user = await verifyRefreshToken(refreshToken);
  if (user) {
    return generateAccessToken(user);
  }
  return null;
}
