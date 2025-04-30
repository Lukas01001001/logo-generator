// src/app/generate/page.tsx

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LogoCanvas from "@/components/LogoCanvas";

import DownloadButton from "@/components/DownloadButton";
import Link from "next/link";

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

      <Link
        // href={`clients?ids=${ids}`}
        href={`/clients?ids=${encodeURIComponent(ids)}`}
        className="fixed bottom-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-hite font-bold py-3 px-6 rounded-lg shadow-lg transition-all text-base md:text-lg"
      >
        ← Back to List
      </Link>

      <LogoCanvas clients={clients} />

      <DownloadButton />
    </div>
  );
}
