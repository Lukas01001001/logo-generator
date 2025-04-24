"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmed) return;

    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete client.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-block mt-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded ml-2"
    >
      Delete
    </button>
  );
}
