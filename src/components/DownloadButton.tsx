// src/components/DownloadButton.tsx

"use client";

import { toPng } from "html-to-image";

import { useToast } from "@/context/ToastContext";

export default function DownloadButton() {
  const { showToast } = useToast();

  const handleDownload = async () => {
    const node = document.getElementById("logo-canvas");
    if (!node) return;

    try {
      const dataUrl = await toPng(node);
      const link = document.createElement("a");
      link.download = "logo-forest.png";
      link.href = dataUrl;
      link.click();

      showToast("Saved!", "success");
    } catch (error) {
      showToast("Download failed", "error");
      console.error("Download error", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all text-base md:text-lg"
      // className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded shadow"
    >
      Download PNG
    </button>
  );
}
