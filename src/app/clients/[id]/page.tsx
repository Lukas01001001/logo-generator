// src/app/clients/[id]/page.tsximport { prisma } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { notFound } from "next/navigation";

// type Props = {
//     params: { id: string }; //without Promise
//   };
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id: parseInt(id) },
  });

  if (!client) return notFound();

  const base64Logo =
    client.logoBlob && client.logoType
      ? `data:${client.logoType};base64,${Buffer.from(client.logoBlob).toString(
          "base64"
        )}`
      : null;

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-6 text-white">{client.name}</h1>

      <div className="w-72 h-72 bg-white shadow-md rounded flex items-center justify-center mx-auto mb-6 p-2">
        {base64Logo ? (
          <img
            src={base64Logo}
            alt={`${client.name} logo`}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-gray-500 text-sm">No Logo</span>
        )}
      </div>

      <p className="text-white mb-2">
        <strong>Address:</strong> {client.address || "N/A"}
      </p>
      <p className="text-white mb-6">
        <strong>Industry:</strong> {client.industry || "N/A"}
      </p>

      <div className="flex justify-center gap-4">
        <Link
          href="/clients"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ← Back to list
        </Link>
        <Link
          href={`/clients/${client.id}/edit`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Edit
        </Link>
        <DeleteButton id={client.id} name={client.name} />
      </div>
    </div>
  );
}
