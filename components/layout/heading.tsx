import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

interface HeadingProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  showVatPricing?: boolean;
  sumAmnt?: string;
  isPricingLoading?: boolean;
}

export default function Heading({
  title,
  description,
  actions,
  className,
  showVatPricing,
  sumAmnt,
  isPricingLoading,
}: HeadingProps) {
  const showTotal = showVatPricing && sumAmnt != null && sumAmnt !== "";
  const showSkeleton = showVatPricing && isPricingLoading;

  return (
    <Card
      className={cn(
        "mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}

        {showSkeleton && (
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Σύνολο (με ΦΠΑ):{" "}
            <span className="inline-block h-5 w-16 bg-slate-200 rounded animate-pulse" />
          </p>
        )}

        {showTotal && !showSkeleton && (
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Σύνολο (με ΦΠΑ):{" "}
            <span className="text-xl font-bold">{sumAmnt}€</span>
          </p>
        )}
      </CardContent>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </Card>
  );
}
