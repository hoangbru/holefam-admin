import { NextRequest, NextResponse } from "next/server";

import { contactSchema } from "@/schemas/contact-schema";
import { Contact } from "@/types/contact";
import { verifyAccessToken } from "@/utils/auth";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";

export async function GET() {
  const contacts = await readJsonFile<Contact[]>("contacts.json");
  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = contactSchema.parse(body);
    const contacts = await readJsonFile<Contact[]>("contacts.json");
    const newContact: Contact = {
      id: contacts.length ? Math.max(...contacts.map((c) => c.id)) + 1 : 1,
      ...data,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? undefined,
    };
    contacts.push(newContact);
    await writeJsonFile("contacts.json", contacts);
    return NextResponse.json(newContact, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
