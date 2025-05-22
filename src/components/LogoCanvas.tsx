//src/components/LogoCanvas.tsx

"use client";

import { useEffect } from "react";
import { Rnd } from "react-rnd";
import { useCanvasStore } from "@/store/useCanvasStore";

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
  const {
    canvasWidth,
    canvasHeight,
    canvasBg,
    logoBackgrounds,
    layout,
    selectedIds,
    setCanvas,
    resetCanvas,
  } = useCanvasStore();

  // ---
  // Synchronizes the global canvas layout with the state of the clients (clients[] from props):
  // - Adds new logos to the layout and gives them default positions/backgrounds (when you return from the list and select logos).
  // - Removes logos that are no longer selected from the layout, background and selectedIds
  // - DOES NOT reset the entire layout - everything that was already laid out stays unchanged
  // This allows you to return from the customer list to /generate without losing the layout and composition
  // ---

  // Key logic: merge layout and delete non-existent logos from layout!
  useEffect(() => {
    const clientIds = clients.map((c) => c.id);

    // 1. Add all new logs to the state (merge)
    const currentLayoutIds = Object.keys(layout).map(Number);

    // IDs of logos that we don't yet have in the layout state
    const missingIds = clientIds.filter((id) => !currentLayoutIds.includes(id));
    // IDs of logos that are no longer needed (they are not in the clients).
    const extraIds = currentLayoutIds.filter((id) => !clientIds.includes(id));

    if (missingIds.length > 0 || extraIds.length > 0) {
      // Add missing ones and remove redundant ones
      // 1. Layout
      const newLayout: Record<number, PositionAndSize> = {};
      let baseIdx = 0;
      clientIds.forEach((id) => {
        //if (layout[id]) {
        if (layout.hasOwnProperty(id)) {
          newLayout[id] = layout[id];
        } else {
          newLayout[id] = {
            x: 30 + (currentLayoutIds.length + baseIdx) * 10,
            y: 30,
            width: 100,
            height: 100,
          };
          baseIdx++;
        }
      });

      // 2. Logo background colors
      const newLogoBackgrounds: Record<number, "black" | "white"> = {};
      clientIds.forEach((id) => {
        //if (logoBackgrounds[id]) {
        if (id in logoBackgrounds) {
          newLogoBackgrounds[id] = logoBackgrounds[id];
        } else {
          newLogoBackgrounds[id] = "black";
        }
      });

      // 3. selectedIds – leave only those that are still on the canvas
      const newSelectedIds = selectedIds.filter((id) => clientIds.includes(id));

      setCanvas({
        layout: newLayout,
        logoBackgrounds: newLogoBackgrounds,
        selectedIds: newSelectedIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(clients.map((c) => c.id))]);

  // Size update
  const handleHeight = (value: number) => setCanvas({ canvasHeight: value });
  const handleWidth = (value: number) => setCanvas({ canvasWidth: value });

  // Update layout
  const updateClientLayout = (
    id: number,
    changes: Partial<PositionAndSize>
  ) => {
    setCanvas({
      layout: {
        ...layout,
        [id]: { ...layout[id], ...changes },
      },
    });
  };

  // Toggle canvass background
  const toggleCanvasBackground = () => {
    setCanvas({ canvasBg: canvasBg === "black" ? "white" : "black" });
  };

  // Reset everything
  const handleReset = () => resetCanvas(clients.map((c) => c.id));

  // Switch logo backgrounds
  const handleToggleLogoBGs = () => {
    const updated = { ...logoBackgrounds };
    selectedIds.forEach((id) => {
      updated[id] = logoBackgrounds[id] === "black" ? "white" : "black";
    });
    setCanvas({ logoBackgrounds: updated });
  };

  // Checkboxy
  const handleToggleAll = () => {
    if (selectedIds.length === clients.length) {
      setCanvas({ selectedIds: [] });
    } else {
      setCanvas({ selectedIds: clients.map((c) => c.id) });
    }
  };

  const handleCheckbox = (id: number) => {
    if (selectedIds.includes(id)) {
      setCanvas({ selectedIds: selectedIds.filter((x) => x !== id) });
    } else {
      setCanvas({ selectedIds: [...selectedIds, id] });
    }
  };

  return (
    <div className="mb-8">
      {/* Sliders + Buttons */}
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 mb-4 text-white items-start lg:items-center">
        {/* Canvas Height input */}
        <div className="flex items-center gap-2 flex-1 w-full">
          <label className="whitespace-nowrap">Canvas Height:</label>
          <input
            type="range"
            min={240}
            max={2500}
            value={canvasHeight}
            onChange={(e) => handleHeight(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            min={240}
            max={2500}
            value={canvasHeight}
            onChange={(e) => handleHeight(Number(e.target.value))}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />
          <span>px</span>
        </div>

        {/* Canvas Width input */}
        <div className="flex items-center gap-2 flex-1 w-full">
          <label className="whitespace-nowrap">Canvas Width:</label>
          <input
            type="range"
            min={240}
            max={2500}
            value={canvasWidth}
            onChange={(e) => handleWidth(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            min={240}
            max={2500}
            value={canvasWidth}
            onChange={(e) => handleWidth(Number(e.target.value))}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />
          <span>px</span>
        </div>

        {/* Buttons Group */}
        <div className="flex flex-col md:flex-row lg:flex-row lg:items-center gap-4 w-full lg:w-auto">
          <button
            onClick={handleToggleLogoBGs}
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
            onClick={handleReset}
            className="w-full lg:w-auto  bg-yellow-500 hover:bg-yellow-600  text-black font-semibold px-4 py-2 rounded shadow"
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
          onClick={handleToggleAll}
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
                className="absolute"
              >
                {base64 ? (
                  <>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(client.id)}
                      onChange={() => handleCheckbox(client.id)}
                      className="absolute top-1 left-1 w-5 h-5 z-10 cursor-pointer"
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
