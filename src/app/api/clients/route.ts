import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.toLowerCase() || "";
  const industry = searchParams.get("industry")?.toLowerCase() || "";

  const clients = await prisma.client.findMany({
    where: {
      AND: [
        name
          ? {
              name: {
                contains: name,
                mode: "insensitive",
              },
            }
          : {},
        industry
          ? {
              industry: {
                contains: industry,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },
    orderBy: { name: "asc" },
    take: 20,
  });

  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const industry = formData.get("industry") as string;
    const file = formData.get("logo") as File | null;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    let buffer: Buffer;
    let type: string;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      type = file.type;
    } else {
      // use default logo
      const defaultPath = path.join(process.cwd(), "public/default-logo.png");
      buffer = await fs.readFile(defaultPath);
      type = "image/png";
    }

    const client = await prisma.client.create({
      data: {
        name,
        address,
        industry,
        logoBlob: buffer,
        logoType: type,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Client saved successfully.",
      client,
    });
  } catch (error) {
    console.error("Error saving client:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
