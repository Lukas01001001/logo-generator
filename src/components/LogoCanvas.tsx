//src/components/LogoCanvas.tsx

"use client";

import { useEffect, useState } from "react";
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

type PositionAndSize = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function bufferToBase64(buffer: Uint8Array | Buffer | any): string {
  const byteArray = Array.isArray(buffer) ? buffer : Object.values(buffer);
  const bytes = new Uint8Array(byteArray);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof window === "undefined"
    ? Buffer.from(binary, "binary").toString("base64")
    : window.btoa(binary);
}

export default function LogoCanvas({ clients }: Props) {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(600);

  // NEW: Store positions and sizes for each client
  const [layout, setLayout] = useState<Record<number, PositionAndSize>>({});

  useEffect(() => {
    const initialWidth = Math.min(window.innerWidth - 40, 1200);
    setCanvasWidth(initialWidth);

    // Set default layout
    const defaultLayout: Record<number, PositionAndSize> = {};
    clients.forEach((client, index) => {
      defaultLayout[client.id] = {
        x: 30 + index * 10,
        y: 30,
        width: 100,
        height: 100,
      };
    });
    setLayout(defaultLayout);
  }, [clients]);

  const resetLayout = () => {
    const reset: Record<number, PositionAndSize> = {};
    clients.forEach((client, index) => {
      reset[client.id] = {
        x: 30 + index * 10,
        y: 30,
        width: 100,
        height: 100,
      };
    });
    setLayout(reset);
  };

  const updateClientLayout = (
    id: number,
    changes: Partial<PositionAndSize>
  ) => {
    setLayout((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...changes },
    }));
  };

  return (
    <div className="mb-8">
      {/* Sliders and reset button */}
      <div className="flex flex-col sm:flex-row gap-6 mb-4 text-white">
        <div className="flex items-center gap-2 flex-1">
          <label>Canvas Height:</label>
          <input
            type="range"
            min={300}
            max={2500}
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            min={300}
            max={2500}
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />
          <span>px</span>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <label>Canvas Width:</label>
          <input
            type="range"
            min={300}
            max={2500}
            value={canvasWidth}
            onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            min={300}
            max={2500}
            value={canvasWidth}
            onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />
          <span>px</span>
        </div>

        {/* Reset button */}
        <button
          onClick={resetLayout}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Reset Layout
        </button>
      </div>

      {/* Canvas area */}
      <div
        className="relative border border-gray-600 bg-black rounded overflow-x-auto"
        style={{ width: canvasWidth, height: canvasHeight }}
        id="logo-canvas"
      >
        {clients.map((client) => {
          const base64 =
            client.logoBlob && client.logoType
              ? `data:${client.logoType};base64,${bufferToBase64(
                  client.logoBlob
                )}`
              : null;

          const pos = layout[client.id];

          return (
            pos && (
              <Rnd
                key={client.id}
                default={pos}
                bounds="parent"
                position={{ x: pos.x, y: pos.y }}
                size={{ width: pos.width, height: pos.height }}
                onDragStop={(_, d) =>
                  updateClientLayout(client.id, { x: d.x, y: d.y })
                }
                onResizeStop={(_, __, ref, delta, position) =>
                  updateClientLayout(client.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    ...position,
                  })
                }
                className="absolute"
              >
                {base64 ? (
                  <img
                    src={base64}
                    alt={client.name}
                    className="w-full h-full object-contain border-2 border-white rounded bg-black with-border"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-700">
                    No Logo
                  </div>
                )}
              </Rnd>
            )
          );
        })}
      </div>
    </div>
  );
}
