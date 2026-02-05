"use client";

import { ICart, IProductItem } from "@/lib/interfaces";
import ProductCard from "./product-card";
import { useHandleOnSubmitProducts } from "@/hooks/useHandleOnSubmitProducts";

interface OrderSummaryProps {
  items?: ICart;
  onQtyChange?: (product: IProductItem, qty: number) => void;
  showVatPricing?: boolean;
  isPricingLoading?: boolean;
  sumAmnt?: string;
}

export function OrderSummary({
  items,
  onQtyChange,
  showVatPricing,
  isPricingLoading,
  sumAmnt,
}: OrderSummaryProps) {
  const { onSubmitProducts, isPending } = useHandleOnSubmitProducts();
  const showTotal = showVatPricing && sumAmnt != null && sumAmnt !== "";
  const showSkeleton = showVatPricing && isPricingLoading;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2 justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Σύνοψη Παραγγελίας
        </h1>
        {showSkeleton && (
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Σύνολο (με ΦΠΑ):{" "}
            <span className="inline-block h-5 w-16 bg-slate-200 rounded animate-pulse" />
          </p>
        )}
        {showTotal && !showSkeleton && (
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Σύνολο (με ΦΠΑ):{" "}
            <span className="text-lg font-bold">{sumAmnt}€</span>
          </span>
        )}
      </div>
      {items?.data.map((item) => (
        <ProductCard
          key={item.MTRL}
          product={item}
          onQtyChange={onQtyChange}
          onSubmitProducts={onSubmitProducts}
          isPending={isPending}
          showCartVatPricing={showVatPricing}
          isPricingLoading={isPricingLoading}
        />
      ))}
    </div>
  );
}
