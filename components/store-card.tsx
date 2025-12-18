import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Building2,
  MapPin,
  IdCard,
  KeyRound,
  Pin,
  CreditCard,
} from "lucide-react";
import { IStoreInfo } from "@/lib/interfaces";

interface StoreInfoCardProps {
  data: IStoreInfo;
  isPending: boolean;
}

interface InfoItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}

function InfoItem({ label, value, icon }: InfoItemProps) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-200 ">
      {icon && <span className="mt-2">{icon}</span>}
      <div className="space-y-0.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">
          {label}
        </p>
        <p className="text-sm font-medium break-all">{value}</p>
      </div>
    </div>
  );
}

export default function StoreCard({ data, isPending }: StoreInfoCardProps) {
  const headerMeta = [data.BRANCH && `Υποκατάστημα ${data.BRANCH}`]
    .filter(Boolean)
    .join(" • ");

  const typeLine = [data.BRANCHES && `Σύνολο Υποκαταστημάτων: ${data.BRANCHES}`]
    .filter(Boolean)
    .join(" • ");

  const addressLine = [data.ADDRESS, data.DISTRICT].filter(Boolean).join(", ");

  return (
 
    <Card
      className={`group overflow-hidden mb-4 border border-zinc-200 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 pt-2 px-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
              <Building2 className="h-4 w-4" />
            </span>
            <span>{data.NAME}</span>
          </CardTitle>

          {headerMeta && (
            <CardDescription className="mt-4 text-xs uppercase tracking-[0.16em] text-zinc-400">
              {headerMeta}
            </CardDescription>
          )}

          {typeLine && (
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-400">
              {typeLine}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-row sm:flex-row gap-2">
            {data.CITY && (
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-100">
                <MapPin className="mr-1 h-3 w-3" />
                {data.CITY}
              </span>
            )}

          </div>

          <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-100 dark:bg-zinc-700">
           Υποκατάστημα: {data.BRANCH}
          </span>
        </div>
      </CardHeader>

      <CardContent className="border-t border-dashed border-zinc-200 pt-4 text-sm dark:border-zinc-800">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <InfoItem
              label="Διεύθυνση"
              value={`${addressLine} - Τ.Κ. ${data.ZIP}`}
              icon={<MapPin className="h-4 w-4 text-zinc-400" />}
            />
            {/* <InfoItem
              label="ΑΦΜ"
              value={data.AFM}
              icon={<IdCard className="h-4 w-4 text-zinc-400" />}
            /> */}
            {/* <InfoItem
              label="TRDR"
              value={data.TRDR}
              icon={<KeyRound className="h-4 w-4 text-zinc-400" />}
            /> */}

            {/* <InfoItem
              label="Τρόπος Πληρωμής"
              value={data.PAYMENT}
              icon={<CreditCard className="h-4 w-4 text-zinc-400" />}
            /> */}
          </div>
        </div>
      </CardContent>

    </Card>
 
  );
}

