import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { Technology } from "@/types/technology";
import { verifyAccessToken } from "@/utils/auth";
import { technologySchema } from "@/schemas/technology-schema";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";

export async function GET() {
  const technologies = await readJsonFile<Technology[]>("technologies.json");
  return NextResponse.json(technologies);
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = technologySchema.parse(body);
    const technologies = await readJsonFile<Technology[]>("technologies.json");
    const newTechnology: Technology = {
      id: randomUUID(),
      ...data,
      createdAt: data.createdAt ?? undefined,
      updatedAt: data.updatedAt ?? undefined,
    };
    technologies.push(newTechnology);
    await writeJsonFile("technologies.json", technologies);
    return NextResponse.json(newTechnology, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
