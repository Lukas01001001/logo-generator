// src/app/generate/page.tsx

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LogoCanvas from "@/components/LogoCanvas";

import DownloadButton from "@/components/DownloadButton";

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
      {/*  <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleDownload}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded shadow-lg transition"
        >
          Download PNG
        </button>
      </div> */}

      <DownloadButton />
    </div>
  );
}
