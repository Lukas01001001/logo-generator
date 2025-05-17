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
      {/* Sliders */}
      <div className="flex flex-col sm:flex-row gap-6 mb-4 text-white">
        <div className="flex items-center gap-2 flex-1">
          <label>Canvas Height:</label>
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
              // Remove leading zeros
              const raw = e.target.value.replace(/^0+(?=\d)/, "");

              setInputCanvasHeight(raw); //Allow the user to enter even an empty string
            }}
            onFocus={() => setIsHeightFocused(true)}
            onBlur={() => {
              setIsHeightFocused(false);
              const value = parseInt(inputCanvasHeight);
              if (isNaN(value)) {
                // If empty or incorrect, return to last correct one
                setInputCanvasHeight(canvasHeight.toString());
                return;
              }

              //Clamp to range
              const clamped = Math.max(240, Math.min(2500, value));
              setCanvasHeight(clamped);
              setInputCanvasHeight(clamped.toString());
            }}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />

          <span>px</span>
        </div>
        {isHeightFocused && (
          <p
            className="text-sm text-gray-400 mt-2 ml-1 italic"
            aria-live="polite"
          >
            ⚠️ Value will be applied after leaving the field
          </p>
        )}

        <div className="flex items-center gap-2 flex-1">
          <label>Canvas Width:</label>
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
              setInputCanvasWidth(raw); // Allow the user to enter even an empty string
            }}
            onFocus={() => setIsWidthFocused(true)}
            onBlur={() => {
              setIsWidthFocused(false);
              const value = parseInt(inputCanvasWidth);
              if (isNaN(value)) {
                // If empty or incorrect, return to last correct one
                setInputCanvasWidth(canvasWidth.toString());
                return;
              }

              // Clamp to range
              const clamped = Math.max(240, Math.min(2500, value));
              setCanvasWidth(clamped);
              setInputCanvasWidth(clamped.toString());
            }}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />

          <span>px</span>
          {/* <span
            title="Value will be applied after leaving the field"
            className="text-gray-400 cursor-help ml-1"
          >
            ⓘ
          </span> */}
        </div>
        {isWidthFocused && (
          <p
            className="text-sm text-gray-400 mt-2 ml-1 italic"
            aria-live="polite"
          >
            ⚠️ Value will be applied after leaving the field
          </p>
        )}

        {/* Switch Selected Logos Background Color button */}
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
          className="w-full sm:w-auto bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Toggle Logo BGs
        </button>

        {/* Switch Color button */}
        <button
          onClick={toggleCanvasBackground}
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded shadow"
        >
          {canvasBg === "black" ? "White Background" : "Black Background"}
        </button>

        {/* Reset button */}
        <button
          onClick={resetLayout}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Reset Layout
        </button>
      </div>

      {/* Canvas area */}
      <div
        className={`relative border border-yellow-600 rounded overflow-x-auto ${
          canvasBg === "black" ? "bg-black" : "bg-white"
        }`}
        style={{ width: canvasWidth, height: canvasHeight }}
        id="logo-canvas"
      >
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
                disableDragging={dragDisabledId === client.id} // Needed to make logo checkboxes on canvas work !!!
                className="absolute"
              >
                {base64 ? (
                  <>
                    <input
                      // Prevent drag interference when tapping checkbox on mobile
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
                      onPointerDown={() => setDragDisabledId(client.id)} // temporarily disable dragging
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
