// src/components/ClientCard.tsx

"use client";

import Link from "next/link";

type Props = {
  id: number;
  name: string;
  industry?: string | null;
  logoBlob?: Uint8Array | null;
  logoType?: string | null;
  selected: boolean;
  toggle: () => void;
  queryString: string;
};

function bufferToBase64(buffer: Uint8Array | Buffer | any): string {
  const byteArray = Array.isArray(buffer) ? buffer : Object.values(buffer);

  if (typeof window === "undefined") {
    return Buffer.from(byteArray).toString("base64");
  }

  let binary = "";
  const bytes = new Uint8Array(byteArray);
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
}: Props) {
  return (
    <div className="flex items-center gap-4 border rounded shadow bg-gray-800 hover:bg-gray-700 transition p-4">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={toggle}
        className="w-5 h-5 accent-blue-500"
      />

      {/* Card as link */}
      <Link
        href={`/clients/${id}${queryString ? `?${queryString}` : ""}`}
        className="flex items-center gap-4 flex-1"
      >
        {/* Logo */}
        {logoBlob && logoType ? (
          <img
            src={`data:${logoType};base64,${bufferToBase64(logoBlob)}`}
            alt={`${name} logo`}
            className="w-20 h-20 object-contain"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
            No Logo
          </div>
        )}

        {/* Text */}
        <div>
          <p className="text-lg font-semibold text-white">{name}</p>
          {industry && <p className="text-gray-300 text-sm">{industry}</p>}
        </div>
      </Link>
    </div>
  );
}
