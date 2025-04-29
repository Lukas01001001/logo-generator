// src/components/DownloadButton.tsx

"use client";

import { toPng } from "html-to-image";

export default function DownloadButton() {
  const handleDownload = async () => {
    const node = document.getElementById("logo-canvas");
    if (!node) return;

    const dataUrl = await toPng(node);
    const link = document.createElement("a");
    link.download = "logo-forest.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleDownload}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded shadow-lg transition"
      >
        Download PNG
      </button>
    </div>
  );
}
