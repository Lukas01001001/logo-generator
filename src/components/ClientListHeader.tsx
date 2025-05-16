// src/components/ClientListHeader.tsx

"use client";

type Props = {
  selectedCount: number;
  onReset: () => void;
  onGenerate: () => void;
};

export default function ClientListHeader({
  selectedCount,
  onReset,
  onGenerate,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <h1 className="text-3xl font-bold text-white">Client List</h1>

      {selectedCount > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onReset}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md text-sm"
          >
            Reset Checkbox
          </button>

          <button
            onClick={onGenerate}
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-md text-sm"
          >
            Generate Logo Forest
          </button>
        </div>
      )}
    </div>
  );
}
