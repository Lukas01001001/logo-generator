"use client";

import { Rnd } from "react-rnd";

type Client = {
  id: number;
  name: string;
  logoBlob: Uint8Array | null;
  logoType: string | null;
};

type Props = {
  clients: Client[];
};

function bufferToBase64(buffer: Uint8Array | Buffer | any): string {
  const byteArray = Array.isArray(buffer) ? buffer : Object.values(buffer);
  let binary = "";
  const bytes = new Uint8Array(byteArray);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default function LogoCanvas({ clients }: Props) {
  return (
    <div className="relative w-full h-[600px] border border-gray-600 bg-black rounded">
      {clients.map((client, index) => {
        const base64 =
          client.logoBlob && client.logoType
            ? `data:${client.logoType};base64,${bufferToBase64(
                client.logoBlob
              )}`
            : null;

        return (
          <Rnd
            key={client.id}
            default={{
              x: 30 + index * 120,
              y: 30,
              width: 100,
              height: 100,
            }}
            bounds="parent"
            className="absolute"
          >
            {base64 ? (
              <img
                src={base64}
                alt={client.name}
                className="w-full h-full object-contain border-2 border-white rounded bg-black"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-700">
                No Logo
              </div>
            )}
          </Rnd>
        );
      })}
    </div>
  );
}
