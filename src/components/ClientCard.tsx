// src/components/ClientCard.tsx

"use client";

import Link from "next/link";
import { useMemo } from "react";

type Props = {
  id: number;
  name: string;
  industry?: string | null;
  logoBlob?: Uint8Array | null;
  logoType?: string | null;
  selected: boolean;
  toggle: () => void;
  queryString: string;
  selectedIds: number[]; // <--
};

// function bufferToBase64(buffer: Uint8Array | Buffer | any): string {
function bufferToBase64(buffer: Uint8Array | Buffer): string {
  const byteArray = Array.isArray(buffer) ? buffer : Object.values(buffer);
  const bytes = new Uint8Array(byteArray);

  if (typeof window === "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default function ClientCard({
  id,
  name,
  industry,
  logoBlob,
  logoType,
  selected,
  toggle,
  queryString,
  selectedIds, // <-
}: Props) {
  const linkHref = useMemo(() => {
    const query = new URLSearchParams(queryString);
    if (selectedIds.length > 0) {
      query.set("ids", selectedIds.join(","));
    }
    return `/clients/${id}${query.toString() ? `?${query.toString()}` : ""}`;
  }, [id, queryString, selectedIds]);

  const logoUrl =
    logoBlob && logoType
      ? `data:${logoType};base64,${bufferToBase64(logoBlob)}`
      : null;

  return (
    <div className="flex items-center gap-4 border rounded shadow bg-gray-800 hover:bg-gray-700 transition p-4">
      <input
        type="checkbox"
        checked={selected}
        onChange={toggle}
        className="w-5 h-5 accent-blue-500"
        title="Select client"
      />

      <Link href={linkHref} className="flex items-center gap-4 flex-1">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="w-20 h-20 object-contain"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
            No Logo
          </div>
        )}

        <div>
          <p className="text-lg font-semibold text-white">{name}</p>
          {industry && <p className="text-gray-300 text-sm">{industry}</p>}
        </div>
      </Link>
    </div>
  );
}
