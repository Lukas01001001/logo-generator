//src/components/LogoCanvas.tsx

"use client";

import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

type Client = {
  id: number;
  name: string;
  logoBlob: string | null;
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

export default function LogoCanvas({ clients }: Props) {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(600);

  // Canvas Background color
  const [canvasBg, setCanvasBg] = useState<"black" | "white">("black");

  // Selected logo background color
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [logoBackgrounds, setLogoBackgrounds] = useState<
    Record<number, "black" | "white">
  >({});

  // Needed to make logo checkboxes on canvas work !!!
  const [dragDisabledId, setDragDisabledId] = useState<number | null>(null);

  // INPUT FIELD state height and width
  const [inputCanvasWidth, setInputCanvasWidth] = useState("0");
  const [inputCanvasHeight, setInputCanvasHeight] = useState("600");

  // Input explanation.
  const [isHeightFocused, setIsHeightFocused] = useState(false);
  const [isWidthFocused, setIsWidthFocused] = useState(false);

  // NEW: Store positions and sizes for each client
  const [layout, setLayout] = useState<Record<number, PositionAndSize>>({});

  useEffect(() => {
    const initialWidth = Math.min(window.innerWidth - 40, 1200);
    setCanvasWidth(initialWidth);

    // INPUT FIELDS
    setInputCanvasWidth(initialWidth.toString());
    setInputCanvasHeight("600");

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

    // selected logos background color
    const bgDefaults: Record<number, "black" | "white"> = {};
    clients.forEach((client) => {
      bgDefaults[client.id] = "black";
    });
    setLogoBackgrounds(bgDefaults);
    //
  }, [clients]);

  const resetLayout = () => {
    // Reset layout
    const reset: Record<number, PositionAndSize> = {};

    const defaultBGs: Record<number, "black" | "white"> = {};

    clients.forEach((client, index) => {
      reset[client.id] = {
        x: 30 + index * 10,
        y: 30,
        width: 100,
        height: 100,
      };
      defaultBGs[client.id] = "black"; // reset logo backgrounds
    });
    setLayout(reset);
    setSelectedIds([]); // uncheck all
    setLogoBackgrounds(defaultBGs); // reset all backgrounds to black
    setCanvasBg("black"); // reset canvas background
  };

  // Canvas Color Switch
  const toggleCanvasBackground = () => {
    setCanvasBg((prev) => (prev === "black" ? "white" : "black"));
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
      {/* Sliders + Buttons in responsive layout */}
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 mb-4 text-white items-start lg:items-center">
        {/* Canvas Height input */}
        <div className="flex items-center gap-2 flex-1 w-full">
          <label className="whitespace-nowrap">Canvas Height:</label>
          <input
            type="range"
            min={240}
            max={2500}
            value={canvasHeight}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setCanvasHeight(value);
              setInputCanvasHeight(e.target.value);
            }}
            className="flex-1"
          />
          <input
            type="number"
            min={240}
            max={2500}
            value={inputCanvasHeight}
            onChange={(e) => {
              const raw = e.target.value.replace(/^0+(?=\d)/, "");
              setInputCanvasHeight(raw);
            }}
            onFocus={() => setIsHeightFocused(true)}
            onBlur={() => {
              setIsHeightFocused(false);
              const value = parseInt(inputCanvasHeight);
              if (isNaN(value)) {
                setInputCanvasHeight(canvasHeight.toString());
                return;
              }
              const clamped = Math.max(240, Math.min(2500, value));
              setCanvasHeight(clamped);
              setInputCanvasHeight(clamped.toString());
            }}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />
          <span>px</span>
          {/* {isHeightFocused && (
            <p className="text-sm text-gray-400 italic ml-2 whitespace-nowrap">
              ⚠️ Value will be applied after leaving the field
            </p>
          )} */}
        </div>

        {/* Canvas Width input */}
        <div className="flex items-center gap-2 flex-1 w-full">
          <label className="whitespace-nowrap">Canvas Width:</label>
          <input
            type="range"
            min={240}
            max={2500}
            value={canvasWidth}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setCanvasWidth(value);
              setInputCanvasWidth(e.target.value);
            }}
            className="flex-1"
          />
          <input
            type="number"
            min={240}
            max={2500}
            value={inputCanvasWidth}
            onChange={(e) => {
              const raw = e.target.value.replace(/^0+(?=\d)/, "");
              setInputCanvasWidth(raw);
            }}
            onFocus={() => setIsWidthFocused(true)}
            onBlur={() => {
              setIsWidthFocused(false);
              const value = parseInt(inputCanvasWidth);
              if (isNaN(value)) {
                setInputCanvasWidth(canvasWidth.toString());
                return;
              }
              const clamped = Math.max(240, Math.min(2500, value));
              setCanvasWidth(clamped);
              setInputCanvasWidth(clamped.toString());
            }}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />
          <span>px</span>
          {/* {isWidthFocused && (
            <p className="text-sm text-gray-400 italic ml-2 whitespace-nowrap">
              ⚠️ Value will be applied after leaving the field
            </p>
          )} */}
        </div>

        {/* Buttons Group */}
        <div className="flex flex-col md:flex-row lg:flex-row lg:items-center gap-4 w-full lg:w-auto">
          <button
            onClick={() => {
              setLogoBackgrounds((prev) => {
                const updated = { ...prev };
                selectedIds.forEach((id) => {
                  updated[id] = prev[id] === "black" ? "white" : "black";
                });
                return updated;
              });
            }}
            className="w-full lg:w-auto bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Toggle Logo BGs
          </button>

          <button
            onClick={toggleCanvasBackground}
            className="w-full lg:w-auto bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded shadow"
          >
            {canvasBg === "black" ? "White Background" : "Black Background"}
          </button>

          <button
            onClick={resetLayout}
            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        className={`relative border border-yellow-600 rounded overflow-x-auto ${
          canvasBg === "black" ? "bg-black" : "bg-white"
        }`}
        style={{ width: canvasWidth, height: canvasHeight }}
        id="logo-canvas"
      >
        {/* Toggle all checkbox button - hidden during export */}
        <button
          onClick={() => {
            const allSelected = selectedIds.length === clients.length;
            setSelectedIds(allSelected ? [] : clients.map((c) => c.id));
          }}
          className="canvas-toggle-btn absolute top-4 right-4 border border-yellow-600 bg-white/60 text-black font-semibold text-sm px-3 py-1 rounded shadow z-50"
        >
          {selectedIds.length === clients.length ? "Uncheck All" : "Check All"}
        </button>

        {clients.map((client) => {
          const base64 =
            client.logoBlob && client.logoType
              ? `data:${client.logoType};base64,${client.logoBlob}`
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
                disableDragging={dragDisabledId === client.id}
                className="absolute"
              >
                {base64 ? (
                  <>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(client.id)}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(client.id)
                            ? prev.filter((id) => id !== client.id)
                            : [...prev, client.id]
                        );
                      }}
                      className="absolute top-1 left-1 w-5 h-5 z-10 cursor-pointer"
                      onPointerDown={() => setDragDisabledId(client.id)}
                      onPointerUp={() =>
                        setTimeout(() => setDragDisabledId(null), 100)
                      }
                    />
                    <img
                      src={base64}
                      alt={client.name}
                      className={`w-full h-full object-contain border-2 border-white rounded ${
                        logoBackgrounds[client.id] === "white"
                          ? "bg-white"
                          : "bg-black"
                      }`}
                    />
                  </>
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
