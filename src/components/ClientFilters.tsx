"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce"; // npm install lodash.debounce

type Props = {
  availableIndustries: string[];
};

export default function ClientFilters({ availableIndustries }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");

  // Profesjonalna aktualizacja z debounce i anulowaniem
  const updateQuery = useCallback(
    debounce((newName: string, newIndustry: string) => {
      const params = new URLSearchParams();
      if (newName) params.set("name", newName);
      if (newIndustry) params.set("industry", newIndustry);
      router.push(`${pathname}?${params.toString()}`);
    }, 300),
    [router, pathname]
  );

  useEffect(() => {
    updateQuery(name, industry);

    // 💣 Najważniejsze: cancel debounce on unmount
    return () => {
      updateQuery.cancel();
    };
  }, [name, industry, updateQuery]);

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search by name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full md:w-1/2"
      />

      <select
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        className="border p-2 rounded w-full md:w-1/2"
      >
        <option value="">All industries</option>
        {availableIndustries.map((ind) => (
          <option key={ind} value={ind}>
            {ind}
          </option>
        ))}
      </select>
    </div>
  );
}
