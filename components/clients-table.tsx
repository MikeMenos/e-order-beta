"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetClientsAll } from "@/hooks/useGetClientsAll";
import { useSearchClients } from "@/hooks/useSearchClients";

export default function ClientsTable() {
  const [q, setQ] = useState("");

  const all = useGetClientsAll();
  const search = useSearchClients();

  const hasSearch = search.isSuccess;

  const rows = useMemo(() => {
    if (hasSearch) return search.data?.data ?? [];
    return all.data?.data ?? [];
  }, [all.data, hasSearch, search.data]);

  const loading = all.isLoading || search.isPending;

  const onSearch = () => {
    const value = q.trim();
    if (!value) return;
    search.mutate({ q: value });
  };

  const onClear = () => {
    setQ("");
    search.reset();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="ΑΦΜ ή Όνομα…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          className="sm:max-w-md"
        />
        <div className="flex gap-2">
          <Button onClick={onSearch} disabled={!q.trim() || search.isPending}>
            Αναζήτηση
          </Button>
          <Button variant="secondary" onClick={onClear} disabled={!hasSearch}>
            Καθαρισμός
          </Button>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-600">Φόρτωση…</div>}
      {(all.isError || search.isError) && (
        <div className="text-sm text-red-600">
          {((all.error as Error)?.message || (search.error as Error)?.message) ??
            "Κάτι πήγε στραβά"}
        </div>
      )}

      <div className="rounded-2xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Επωνυμία</TableHead>
              <TableHead>ΑΦΜ</TableHead>
              <TableHead>Πόλη</TableHead>
              <TableHead className="hidden md:table-cell">Διεύθυνση</TableHead>
              <TableHead className="hidden lg:table-cell">Τηλέφωνο</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-slate-600">
                  Δεν βρέθηκαν αποτελέσματα.
                </TableCell>
              </TableRow>
            )}

            {rows.map((c) => (
              <TableRow key={`${c.TRDR}-${c.BRANCH}-${c.AFM}`}>
                <TableCell className="font-medium">{c.NAME}</TableCell>
                <TableCell>{c.AFM}</TableCell>
                <TableCell>{c.CITY}</TableCell>
                <TableCell className="hidden md:table-cell">{c.ADDRESS}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {c.PHONE01 ?? "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
