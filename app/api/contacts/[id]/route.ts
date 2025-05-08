import { NextRequest, NextResponse } from "next/server";

import { contactSchema } from "@/schemas/contact-schema";
import { Contact } from "@/types/contact";
import { verifyAccessToken } from "@/utils/auth";
import { readJsonFile, writeJsonFile } from "@/utils/jsonFileUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const contacts = await readJsonFile<Contact[]>("contacts.json");
  const contact = contacts.find((c) => c.id === parseInt(params.id));
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  return NextResponse.json(contact);
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
    const data = contactSchema.parse(body);
    const contacts = await readJsonFile<Contact[]>("contacts.json");
    const index = contacts.findIndex((c) => c.id === parseInt(params.id));
    if (index === -1) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    contacts[index] = { 
      id: parseInt(params.id), 
      ...data, 
      createdAt: data.createdAt ?? undefined, 
      updatedAt: data.updatedAt ?? undefined 
    };
    await writeJsonFile("contacts.json", contacts);
    return NextResponse.json(contacts[index]);
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

  const contacts = await readJsonFile<Contact[]>("contacts.json");
  const filteredContacts = contacts.filter((c) => c.id !== parseInt(params.id));
  if (filteredContacts.length === contacts.length) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  await writeJsonFile("contacts.json", filteredContacts);
  return NextResponse.json({ success: true });
}
