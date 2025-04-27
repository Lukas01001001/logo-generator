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
  const [isDeleting, setIsDeleting] = useState(false); // <-- nowa zmienna

  const handleDelete = async () => {
    setIsDeleting(true); // Zablokuj podczas kasowania

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        showToast("Client deleted successfully.", "success");
        setShowModal(false); // Zamknij modal
        router.push("/clients"); // Przenieś do listy
      } else {
        showToast(data.error || "Failed to delete client.", "error");
      }
    } catch (error) {
      showToast("Something went wrong.", "error");
    } finally {
      setIsDeleting(false); // Odblokuj po operacji
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
      >
        Delete
      </button>

      {showModal && (
        <ConfirmModal
          message={`Are you sure you want to delete ${name}?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
          isDeleting={isDeleting} // <-- podajemy stan
        />
      )}
    </>
  );
}
