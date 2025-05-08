import { NextRequest, NextResponse } from "next/server";

import { Project } from "@/types/project";
import { verifyAccessToken } from "@/utils/auth";
import { projectSchema } from "@/schemas/project-schema";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";

export async function GET() {
  const projects = await readJsonFile<Project[]>("projects.json");
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);
    const projects = await readJsonFile<Project[]>("projects.json");
    const rest = data; // Use the entire data object as 'rest'
    const newProject: Project = {
      id: projects.length ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
      ...rest,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? undefined,
      technologies: rest.technologies.map((tech, index) => ({
        id: index + 1, // Assign a unique id to each technology
        ...tech,
        createdAt: tech.createdAt ?? undefined, // Convert null to undefined
        updatedAt: tech.updatedAt ?? undefined, // Convert null to undefined
      })),
    };
    projects.push(newProject);
    await writeJsonFile("projects.json", projects);
    return NextResponse.json(newProject, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
