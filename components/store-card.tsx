import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import type { IStoreInfo } from "@/lib/interfaces";
import { cn } from "@/lib/utils"

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
  const v = (value ?? "").trim()
  const isEmpty = v.length === 0

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2 shadow-sm",
        "bg-muted/40 text-foreground",
        isEmpty && "opacity-70"
      )}
    >
      <span className="shrink-0 text-muted-foreground">
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground">
          {label}
        </p>

        {href && !isEmpty ? (
          <a
            href={href}
            className="block truncate text-sm font-semibold hover:underline"
          >
            {v}
          </a>
        ) : (
          <p
            className={cn(
              "truncate text-sm font-semibold",
              isEmpty && "font-medium text-muted-foreground"
            )}
          >
            {isEmpty ? "—" : v}
          </p>
        )}
      </div>
    </div>
  )
}

export default function StoreCard({ data, isPending }: StoreInfoCardProps) {
  const isCentral = data.BRANCH === "0";
  const branchTitle = isCentral ? "Κεντρικό" : `Υποκατάστημα ${data.BRANCH}`;

  const addressLine = [data.ADDRESS, data.DISTRICT, data.ZIP].filter(Boolean).join(", ");
  const fullAddress = addressLine || undefined;
  const mapsHref = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      [fullAddress, data.CITY, data.ZIP].filter(Boolean).join(", ")
    )}`
    : undefined;

  const phone = (data.PHONE01 ?? "").trim() || undefined;
  const phoneHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;

  return (
    <Card
      className={[
        "group overflow-hidden shadow-sm",
        "transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md",
        "dark:border-zinc-800 dark:bg-zinc-900/80",
        isPending ? "opacity-60 pointer-events-none" : "",
      ].join(" ")}
    >
      <CardContent className="p-0 sm:p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="inline-flex items-center rounded-2xl bg-primary px-2 py-1 text-sm font-semibold leading-none text-white tracking-tight">
                  {branchTitle}
                </p>
              </div>

            </div>
          </div>

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