// src/components/ClientList.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function bufferToBase64(buffer: Uint8Array | Buffer | any): string {
  const byteArray = Array.isArray(buffer) ? buffer : Object.values(buffer);

  if (typeof window === "undefined") {
    return Buffer.from(byteArray).toString("base64");
  }

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

export default function ClientList() {
  const searchParams = useSearchParams();

  const [clients, setClients] = useState<Client[] | null>(null);

  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const params = new URLSearchParams();

        const name = searchParams.get("name");
        const industry = searchParams.get("industry");

        if (name) params.set("name", name);
        if (industry) params.set("industry", industry);

        const query = params.toString();
        setQueryString(query);

        const res = await fetch(`/api/clients?${query}`, { cache: "no-store" });

        const data = await res.json();
        setClients(data);
      } catch (error) {
        console.error("Failed to fetch clients", error);
        setClients([]);
      }
    };

    fetchClients();
  }, [searchParams]);
  if (clients === null) {
    return <div className="text-gray-400">Loading clients...</div>;
  }

  if (clients.length === 0) {
    return <div className="text-gray-400">No clients found.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Client List</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}${
              queryString ? `?${queryString}` : ""
            }`}
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
              <p className="text-lg font-semibold text-white">{client.name}</p>
              {client.industry && (
                <p className="text-gray-300 text-sm">{client.industry}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
