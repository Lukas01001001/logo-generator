import Link from "next/link";

function bufferToBase64(buffer: Uint8Array | Buffer | any): string {
  const byteArray = Array.isArray(buffer) ? buffer : Object.values(buffer);

  if (typeof window === "undefined") {
    // Server-side (Node.js)
    return Buffer.from(byteArray).toString("base64");
  }

  // Client-side (browser)
  let binary = "";
  const bytes = new Uint8Array(byteArray);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

type Client = {
  id: number;
  name: string;
  address?: string | null;
  industry?: string | null;
  logoBlob?: Uint8Array | null;
  logoType?: string | null;
};

export default function ClientList({ clients }: { clients?: Client[] }) {
  if (!clients) {
    return (
      <div className="text-red-500">
        ⚠️ Clients list not loaded. Please try again later.
      </div>
    );
  }

  return (
    // <div className="max-w-4xl mx-auto p-6">
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Client List</h1>
        {/* <Link
          href="/clients/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Add new client
        </Link> */}
      </div>

      {!clients || clients.length === 0 ? (
        <p className="text-gray-400">No clients found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="border rounded p-4 shadow bg-gray-800 flex items-center space-x-4 hover:shadow-lg hover:bg-gray-700 transition cursor-pointer"
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
                <p className="text-lg font-semibold text-white">
                  {client.name}
                </p>
                {client.industry && (
                  <p className="text-gray-300 text-sm">{client.industry}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* export default function ClientList({ clients }: { clients: Client[] }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Client List</h1>
        <Link
          href="/clients/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Add new client
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-400">No clients found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="border rounded p-4 shadow bg-gray-800 flex items-center space-x-4"
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
                <Link
                  href={`/clients/${client.id}`}
                  className="text-white hover:underline block text-lg font-semibold"
                >
                  {client.name}
                </Link>

                {client.industry && (
                  <p className="text-gray-300 text-sm">{client.industry}</p>
                )}
                <Link
                  href={`/clients/${client.id}/edit`}
                  className="inline-block mt-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <DeleteButton id={client.id} name={client.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 */
