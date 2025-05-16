// src/components/ClientForm.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

type Industry = {
  id: number;
  name: string;
};

type Client = {
  id?: number;
  name: string;
  address?: string | null;
  industry?: { name: string } | null;
};

type Props = {
  client?: Client;
  isEdit?: boolean;
  onSuccess?: () => void;
  availableIndustries?: Industry[];
};

export default function ClientForm({
  client,
  isEdit = false,
  onSuccess,
  availableIndustries = [],
}: Props) {
  const [name, setName] = useState(client?.name || "");
  const [address, setAddress] = useState(client?.address || "");
  const [industryName, setIndustryName] = useState(
    client?.industry?.name || ""
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      alert("Name must be at least 2 characters.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("industry", industryName); // New or existing
    if (logoFile) formData.append("logo", logoFile);

    const endpoint =
      isEdit && client?.id ? `/api/clients/${client.id}` : "/api/clients";

    const res = await fetch(endpoint, {
      method: isEdit ? "PUT" : "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      showToast(
        data.message || (isEdit ? "Client updated." : "Client saved."),
        "success"
      );
      router.push("/clients");
      if (onSuccess) onSuccess();
    } else {
      showToast(data.error || "Error saving client.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-3">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border p-2"
      />
      <input
        list="industry-options"
        autoComplete="off"
        type="text"
        placeholder="Industry (new or existing)"
        value={industryName}
        onChange={(e) => setIndustryName(e.target.value)}
        className="w-full border p-2"
        required
      />
      <datalist id="industry-options">
        {availableIndustries.map((ind) => (
          <option key={ind.id} value={ind.name} />
        ))}
      </datalist>

      <input
        type="file"
        accept=".svg,.png,.jpg,.jpeg"
        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
        className="w-full"
      />

      <div className="flex items-center gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEdit ? "Update client" : "Save client"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/clients")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
