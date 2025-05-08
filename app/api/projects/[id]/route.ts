import { NextRequest, NextResponse } from "next/server";

import { projectSchema } from "@/schemas/project-schema";
import { Project } from "@/types/project";
import { verifyAccessToken } from "@/utils/auth";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projects = await readJsonFile<Project[]>("projects.json");
  const project = projects.find((p) => p.id === parseInt(params.id));
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
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
    const data = projectSchema.parse(body);
    const projects = await readJsonFile<Project[]>("projects.json");
    const index = projects.findIndex((p) => p.id === parseInt(params.id));
    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    const rest = data;
    projects[index] = {
      id: parseInt(params.id),
      ...rest,
      createdAt: data.createdAt ?? undefined, 
      updatedAt: data.updatedAt ?? undefined,
      technologies: rest.technologies.map((tech, idx) => ({
        id: idx + 1,
        ...tech,
        createdAt: tech.createdAt ?? undefined,
        updatedAt: tech.updatedAt ?? undefined,
      })),
    };
    await writeJsonFile("projects.json", projects);
    return NextResponse.json(projects[index]);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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

  const projects = await readJsonFile<Project[]>("projects.json");
  const filteredProjects = projects.filter((p) => p.id !== parseInt(params.id));
  if (filteredProjects.length === projects.length) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  await writeJsonFile("projects.json", filteredProjects);
  return NextResponse.json({ success: true });
}
