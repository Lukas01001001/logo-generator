// src/components/ClientList.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Spinner from "./ui/Spinner";
import ClientCard from "./ClientCard";

type Client = {
  id: number;
  name: string;
  address?: string | null;
  industry?: string | null;
  logoBlob?: Uint8Array | null;
  logoType?: string | null;
};

export default function ClientList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clients, setClients] = useState<Client[] | null>(null);

  const [queryString, setQueryString] = useState("");

  // 🔥 NEW: selected clients
  const [selectedClients, setSelectedClients] = useState<number[]>([]);

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
    // return <div className="text-gray-400">Loading clients...</div>;
    return <Spinner />;
  }

  if (clients.length === 0) {
    return <div className="text-gray-400">No clients found.</div>;
  }

  // 🔥 NEW: toggle selection
  const toggleClientSelection = (id: number) => {
    setSelectedClients((prev) =>
      prev.includes(id)
        ? prev.filter((clientId) => clientId !== id)
        : [...prev, id]
    );
  };

  // 🔥 NEW: generate logo forest
  const handleGenerate = () => {
    if (selectedClients.length > 0) {
      const idsParam = selectedClients.join(",");
      router.push(`/generate?ids=${idsParam}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Client List</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            id={client.id}
            name={client.name}
            industry={client.industry}
            logoBlob={client.logoBlob}
            logoType={client.logoType}
            selected={selectedClients.includes(client.id)}
            toggle={() => toggleClientSelection(client.id)}
            queryString={queryString}
          />
        ))}
      </div>
      {/* 🔥 NEW: generate button */}
      {selectedClients.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleGenerate}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
          >
            Generate Logo Forest
          </button>
        </div>
      )}
    </div>
  );
}
