"use client";

import { useState } from "react";

export default function ClientForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoFile) {
      alert("Please select a logo file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("industry", industry);
    formData.append("logo", logoFile);

    const res = await fetch("/api/clients", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Client saved successfully.");
    } else {
      alert("Error saving client.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 border p-2"
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full mb-2 border p-2"
      />
      <input
        type="text"
        placeholder="Industry"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        className="w-full mb-2 border p-2"
      />
      <input
        type="file"
        accept=".svg,.png,.jpg,.jpeg"
        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
        className="w-full mb-4"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save client
      </button>
    </form>
  );
}
