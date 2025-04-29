// src/components/BackToListButton.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BackToListButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    // If we have enough history, go back
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      // If not, build a URL with the current filters
      const params = searchParams.toString();
      const href = params ? `/clients?${params}` : `/clients`;
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      ← Back to list
    </button>
  );
}
