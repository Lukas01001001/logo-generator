// src/components/ClientList.tsx

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import Spinner from "./ui/Spinner";
import ClientCard from "./ClientCard";
import EmptyState from "./ui/EmptyState";
import ClientListHeader from "./ClientListHeader";

type Client = {
  id: number;
  name: string;
  address?: string | null;
  industry?: string | null;
  logoBlob?: Uint8Array | null;
  logoType?: string | null;
};

const LIMIT = 10;

export default function ClientList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clients, setClients] = useState<Client[]>([]);
  //
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);

  //
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    const name = searchParams.get("name");
    const industry = searchParams.get("industry");
    if (name) params.set("name", name);
    if (industry) params.set("industry", industry);
    return params.toString();
  }, [searchParams]);

  // Note the selections from the URL.
  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      const parsed = ids
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      setSelectedClients(parsed);
    }
  }, [searchParams]);

  // ⬇️ Reset clients when changing filters
  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    setClients([]);
    setPage(0);
    setHasMore(true);
    setResetCounter((prev) => prev + 1); // ⬅️ force refetch
  }, [queryString]);

  // Download data at each change of `page`.
  useEffect(() => {
    const fetchClients = async () => {
      if (!hasMore || loading) return;

      try {
        setLoading(true);
        const params = new URLSearchParams(queryString);
        params.set("skip", String(page * LIMIT));
        params.set("limit", String(LIMIT));

        const res = await fetch(`/api/clients?${params.toString()}`);
        //
        const data: Client[] = await res.json();

        if (!data || data.length < LIMIT) {
          setHasMore(false);
        }

        // remove duplicates
        setClients((prev) => {
          const ids = new Set(prev.map((c) => c.id));
          const newClients = data.filter((c) => !ids.has(c.id));
          return [...prev, ...newClients];
        });
      } catch (error) {
        console.error("Failed to fetch clients", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [page, queryString, resetCounter]);

  // ⬇️ Lazy loading with IntersectionObserver
  const lastClientRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const toggleClientSelection = (id: number) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const resetClientSelection = () => {
    setSelectedClients([]);
  };

  const handleGenerate = () => {
    if (selectedClients.length > 0) {
      const query = new URLSearchParams();
      query.set("ids", selectedClients.join(","));

      const name = searchParams.get("name");
      const industry = searchParams.get("industry");

      if (name) query.set("name", name);
      if (industry) query.set("industry", industry);

      router.push(`/generate?${query.toString()}`);
    }
  };

  return (
    <div>
      <ClientListHeader
        selectedCount={selectedClients.length}
        onReset={resetClientSelection}
        onGenerate={handleGenerate}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((client, index) => {
          const isLast = index === clients.length - 1;
          return (
            <div key={client.id} ref={isLast ? lastClientRef : null}>
              <ClientCard
                id={client.id}
                name={client.name}
                industry={client.industry}
                logoBlob={client.logoBlob}
                logoType={client.logoType}
                selected={selectedClients.includes(client.id)}
                toggle={() => toggleClientSelection(client.id)}
                queryString={queryString}
                selectedIds={selectedClients}
              />
            </div>
          );
        })}
      </div>

      {!loading && clients.length === 0 && (
        <EmptyState
          message="No clients found matching the selected filters."
          // onClear={() => router.push("/clients")} //
        />
      )}

      {loading && (
        <div className="flex justify-center my-6">
          <Spinner />
        </div>
      )}
    </div>
  );
}
