// components/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DeleteButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      showToast("Client deleted successfully.", "success");
      router.refresh();
    } else {
      showToast(data.error || "Failed to delete client.", "error");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className=" bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
      >
        Delete
      </button>

      {showModal && (
        <ConfirmModal
          message={`Are you sure you want to delete ${name}?`}
          onConfirm={() => {
            handleDelete();
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
