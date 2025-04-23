import { prisma } from "@/lib/db";

function bufferToBase64(buffer: Buffer | Uint8Array): string {
  if (typeof window === "undefined") {
    return Buffer.from(buffer).toString("base64");
  }
  // fallback if Buffer not available
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default async function ClientsPage() {
  const clients = await prisma.client.findMany();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Client List</h1>

      {clients.length === 0 ? (
        <p className="text-gray-600">No clients found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="border rounded p-4 shadow bg-white flex items-center space-x-4"
            >
              {client.logoBlob && client.logoType ? (
                <img
                  src={`data:${client.logoType};base64,${bufferToBase64(
                    client.logoBlob
                  )}`}
                  alt={`${client.name} logo`}
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                  No Logo
                </div>
              )}

              <div>
                <p className="text-lg font-semibold">{client.name}</p>
                {client.industry && (
                  <p className="text-gray-600 text-sm">{client.industry}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
