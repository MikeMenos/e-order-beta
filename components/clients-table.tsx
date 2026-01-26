"use client";

import type { IStoreInfo } from "@/lib/interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, Navigation } from "lucide-react";
import Loading from "./ui/loading";
import { useRouter } from "next/navigation";
import { appStore } from "@/stores/appStore";

interface ClientsTableProps {
  clients: IStoreInfo[];
  loading?: boolean;
  error?: Error | null;
}

export default function ClientsTable({
  clients,
  loading = false,
  error = null,
}: ClientsTableProps) {
  const router = useRouter();
  const setCurrentBranch = appStore((state) => state.setCurrentBranch);
  const setBasketId = appStore((state) => state.setBasketId);

  const handleCardClick = (client: IStoreInfo) => {
    setCurrentBranch(client);
    setBasketId(client.BASKET_KEY);
    router.push("/");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error.message ?? "Κάτι πήγε στραβά"}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="py-12 text-center text-slate-600">
        Δεν βρέθηκαν αποτελέσματα.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((c) => (
        <Card
          key={`${c.TRDR}-${c.BRANCH}-${c.AFM}`}
          className="hover:shadow-lg transition-all duration-200 hover:border-primary/50 group cursor-pointer"
          onClick={() => handleCardClick(c)}
        >
          <CardHeader className="pb-1">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {c.NAME}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1.5">
                  ΑΦΜ:
                  <span className="font-mono text-xs">{c.AFM}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {c.CITY && (
              <div className="flex items-start gap-2.5 text-sm">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-slate-500 text-xs">Πόλη</span>
                  <p className="font-medium text-slate-900">{c.CITY}</p>
                </div>
              </div>
            )}
            {c.ADDRESS && (
              <div className="flex items-start gap-2.5 text-sm">
                <Navigation className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-slate-500 text-xs">Διεύθυνση</span>
                  <p className="font-medium text-slate-900 line-clamp-2">
                    {c.ADDRESS}
                  </p>
                </div>
              </div>
            )}
            {c.PHONE01 && (
              <div className="flex items-start gap-2.5 text-sm">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-slate-500 text-xs">Τηλέφωνο</span>
                  <p className="font-medium text-slate-900">{c.PHONE01}</p>
                </div>
              </div>
            )}
            {(c.DISTRICT || c.ZIP) && (
              <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                {c.DISTRICT && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-600">{c.DISTRICT}</span>
                  </div>
                )}
                {c.ZIP && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-600 font-mono">{c.ZIP}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
