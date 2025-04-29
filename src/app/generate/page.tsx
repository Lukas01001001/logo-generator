// src/app/generate/page.tsx

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LogoCanvas from "@/components/LogoCanvas";

type Props = {
  searchParams: Promise<{ ids?: string }>;
};

export default async function GeneratePage({ searchParams }: Props) {
  const { ids } = await searchParams;

  if (!ids) return notFound();

  const idList = ids.split(",").map((id) => parseInt(id.trim()));
  const clients = await prisma.client.findMany({
    where: { id: { in: idList } },
  });

  if (!clients.length) return notFound();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Logo Forest
      </h1>

      <LogoCanvas clients={clients} />
    </div>
  );
}
