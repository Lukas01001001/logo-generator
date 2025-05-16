// src/app/clients/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

import DeleteButton from "@/components/DeleteButton";
import BackToListButton from "@/components/BackToListButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id: parseInt(id) },
    include: { industry: true },
  });

  if (!client) return notFound();

  const base64Logo =
    client.logoBlob && client.logoType
      ? `data:${client.logoType};base64,${Buffer.from(client.logoBlob).toString(
          "base64"
        )}`
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-white">
        {client.name}
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="w-64 h-64 bg-white rounded-md flex items-center justify-center p-4">
          {base64Logo ? (
            <img
              src={base64Logo}
              alt={`${client.name} logo`}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-gray-400">No Logo</span>
          )}
        </div>

        <div className="text-white flex-1 space-y-4 text-lg">
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {client.address || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Industry:</span>{" "}
            {client.industry?.name || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <BackToListButton />
        <Link
          href={`/clients/${client.id}/edit`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded text-center"
        >
          Edit
        </Link>
        <DeleteButton id={client.id} name={client.name} />
      </div>
    </div>
  );
}
