// src/store/useCanvasStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PositionAndSize = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CanvasStore = {
  canvasWidth: number;
  canvasHeight: number;
  canvasBg: "black" | "white";
  logoBackgrounds: Record<number, "black" | "white">;
  layout: Record<number, PositionAndSize>;
  selectedIds: number[];
  setCanvas: (
    partial: Partial<Omit<CanvasStore, "setCanvas" | "resetCanvas">>
  ) => void;
  resetCanvas: (clientIds: number[]) => void;
};

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set) => ({
      canvasWidth: 1200,
      canvasHeight: 600,
      canvasBg: "black",
      logoBackgrounds: {},
      layout: {},
      selectedIds: [],
      setCanvas: (partial) => set((state) => ({ ...state, ...partial })),
      resetCanvas: (clientIds) =>
        set(() => {
          // reset for new customers
          const layout: Record<number, PositionAndSize> = {};
          const logoBackgrounds: Record<number, "black" | "white"> = {};
          clientIds.forEach((id, idx) => {
            layout[id] = { x: 30 + idx * 10, y: 30, width: 100, height: 100 };
            logoBackgrounds[id] = "black";
          });
          return {
            canvasWidth: 1200,
            canvasHeight: 600,
            canvasBg: "black" as const,
            logoBackgrounds,
            layout,
            selectedIds: [],
          };
        }),
    }),
    {
      name: "logo-canvas-store", // key in localStorage
    }
  )
);
