"use client";

import { useEffect, useMemo, useState } from "react";
import ClientsTable from "@/components/clients-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetClientsAll } from "@/hooks/useGetClientsAll";
import type { IStoreInfo } from "@/lib/interfaces";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { appStore } from "@/stores/appStore";

const ITEMS_PER_PAGE = 20;

export default function ClientsPage() {
  const { vat, setCurrentBranch } = appStore();
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isSpecialAfm = vat === "999999999" || vat === "987654321";

  const { data: allClients, isLoading, error } = useGetClientsAll(isSpecialAfm);

  useEffect(() => {
    setCurrentBranch(undefined);
  }, [setCurrentBranch]);

  const filteredData = useMemo(() => {
    // Helper function to search across all fields
    const matchesSearch = (client: IStoreInfo, searchTerm: string): boolean => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      const fields = [
        client.NAME,
        client.AFM,
        client.CITY,
        client.ADDRESS,
        client.DISTRICT,
        client.ZIP,
        client.PHONE01,
      ];

      return fields.some(
        (field) => field && String(field).toLowerCase().includes(searchLower),
      );
    };

    // Handle regular clients from useGetClientsAll
    if (!allClients?.data) return [];

    // When AFM is 999999999, show only clients with SALESMAN === '16'
    let base = allClients.data;
    if (vat === "999999999") {
      base = base.filter((c) => c.SALESMAN === "16");
    }

    const searchTerm = q.trim();
    if (!searchTerm) return base;

    return base.filter((client) => matchesSearch(client, searchTerm));
  }, [allClients, q, vat]);

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const onClear = () => {
    setQ("");
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Πελάτες</h1>
        <div className="flex items-center gap-4 mt-1">
          {allClients?.data && (
            <p className="text-xs text-slate-500">
              Συνολικά: {totalItems} πελάτες
            </p>
          )}
          {totalPages > 1 && (
            <p className="text-xs text-slate-500">
              Σελίδα {currentPage} από {totalPages}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 flex-row sm:items-center">
          <Input
            placeholder="Αναζήτηση σε όλα τα πεδία…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:max-w-md"
          />
          {q.trim() && (
            <Button variant="ghost" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ClientsTable
          clients={paginatedData}
          loading={isLoading}
          error={error as Error | null}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-1">
                Προηγούμενη
              </span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!showPage) {
                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-slate-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="min-w-10"
                    >
                      {page}
                    </Button>
                  );
                },
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only sm:not-sr-only sm:mr-1">Επόμενη</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
