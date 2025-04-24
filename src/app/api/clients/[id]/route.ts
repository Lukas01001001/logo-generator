import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const industry = formData.get("industry") as string;
    const file = formData.get("logo") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Missing name." }, { status: 400 });
    }

    const updateData: any = { name, address, industry };

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      updateData.logoBlob = buffer;
      updateData.logoType = file.type;
    }

    const updated = await prisma.client.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.client.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete client." },
      { status: 500 }
    );
  }
}
