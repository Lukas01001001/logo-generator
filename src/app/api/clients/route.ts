import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const industry = formData.get("industry") as string;
    const file = formData.get("logo") as File;

    if (!file || !name) {
      return NextResponse.json(
        { error: "Missing required data." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const client = await prisma.client.create({
      data: {
        name,
        address,
        industry,
        logoBlob: buffer,
        logoType: file.type,
      },
    });

    return NextResponse.json({ success: true, client });
  } catch (error) {
    console.error("Error saving client:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
