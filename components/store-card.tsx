import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Phone } from "lucide-react";
import type { IStoreInfo } from "@/lib/interfaces";

interface StoreInfoCardProps {
  data: IStoreInfo;
  isPending: boolean;
}

interface InfoItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  href?: string;
}

function InfoItem({ label, value, icon, href }: InfoItemProps) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-200">
      {icon && <span className="mt-2">{icon}</span>}

      <div className="space-y-0.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">
          {label}
        </p>

        {href ? (
          <a
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-medium wrap-break-word hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium wrap-break-word">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function StoreCard({ data, isPending }: StoreInfoCardProps) {
  const isCentral = data.BRANCH === "0";
  const branchTitle = isCentral ? "Κεντρικό" : `Υποκατάστημα ${data.BRANCH}`;

  const addressLine = [data.ADDRESS, data.DISTRICT].filter(Boolean).join(", ");
  const fullAddress = addressLine || undefined;
  const mapsHref = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [fullAddress, data.CITY].filter(Boolean).join(", ")
      )}`
    : undefined;

  const cityLine = [data.CITY, data.ZIP ? `Τ.Κ. ${data.ZIP}` : ""]
    .filter(Boolean)
    .join(" • ");

  const phone = (data.PHONE01 ?? "").trim() || undefined;
  const phoneHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;

  return (
    <Card
      className={[
        "group overflow-hidden mb-4 border border-zinc-200 bg-white shadow-sm",
        "transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md",
        "dark:border-zinc-800 dark:bg-zinc-900/80",
        isPending ? "opacity-60 pointer-events-none" : "",
      ].join(" ")}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
              <Building2 className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {branchTitle}
                </p>

                <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-100 dark:bg-zinc-700">
                  {data.BRANCH}
                </span>
              </div>

              {cityLine ? (
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-400">
                  {cityLine}
                </p>
              ) : null}
            </div>
          </div>

          {data.CITY ? (
            <span className="hidden sm:inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-100 whitespace-nowrap">
              <MapPin className="mr-1 h-3 w-3" />
              {data.CITY}
            </span>
          ) : null}
        </div>

        <div className="my-4 border-t border-dashed border-zinc-200 dark:border-zinc-800" />

        <div className="flex flex-col gap-3">
          <InfoItem
            label="Διεύθυνση"
            value={fullAddress}
            href={mapsHref}
            icon={<MapPin className="h-4 w-4 text-zinc-400" />}
          />

          <InfoItem
            label="Τηλέφωνο"
            value={phone}
            href={phoneHref}
            icon={<Phone className="h-4 w-4 text-zinc-400" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}
