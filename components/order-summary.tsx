"use client";

import { ICart, IProductItem } from "@/lib/interfaces";
import ProductCard from "./product-card";
import { useHandleOnSubmitProducts } from "@/hooks/useHandleOnSubmitProducts";

interface OrderSummaryProps {
  items?: ICart;
  onQtyChange?: (product: IProductItem, qty: number) => void;
  showVatPricing?: boolean;
  isPricingLoading?: boolean;
}

export function OrderSummary({
  items,
  onQtyChange,
  showVatPricing,
  isPricingLoading,
}: OrderSummaryProps) {
  const { onSubmitProducts, isPending } = useHandleOnSubmitProducts();
  return (
    <div className="basis-2/3">
      <h1 className="text-xl py-4 font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Σύνοψη Παραγγελίας
      </h1>
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
