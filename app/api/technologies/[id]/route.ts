import { NextRequest, NextResponse } from "next/server";

import { Technology } from "@/types/technology";
import { verifyAccessToken } from "@/utils/auth";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";
import { technologySchema } from "@/schemas/technology-schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const technologies = await readJsonFile<Technology[]>("technologies.json");
  const technology = technologies.find((t) => t.id === parseInt(params.id));
  if (!technology) {
    return NextResponse.json(
      { error: "Technology not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(technology);
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
    const data = technologySchema.parse(body);
    const technologies = await readJsonFile<Technology[]>("technologies.json");
    const index = technologies.findIndex((t) => t.id === parseInt(params.id));
    if (index === -1) {
      return NextResponse.json(
        { error: "Technology not found" },
        { status: 404 }
      );
    }
    technologies[index] = { 
      id: parseInt(params.id), 
      ...data, 
      createdAt: data.createdAt ?? undefined, 
      updatedAt: data.updatedAt ?? undefined 
    };
    await writeJsonFile("technologies.json", technologies);
    return NextResponse.json(technologies[index]);
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

  const technologies = await readJsonFile<Technology[]>("technologies.json");
  const filteredTechnologies = technologies.filter(
    (t) => t.id !== parseInt(params.id)
  );
  if (filteredTechnologies.length === technologies.length) {
    return NextResponse.json(
      { error: "Technology not found" },
      { status: 404 }
    );
  }
  await writeJsonFile("technologies.json", filteredTechnologies);
  return NextResponse.json({ success: true });
}
