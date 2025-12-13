"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICart, IProductItem } from "@/lib/interfaces";
import ProductCard from "./product-card";
import { useHandleOnSubmitProducts } from "@/hooks/useHandleOnSubmitProducts";

interface OrderSummaryProps {
  items?: ICart;
  onQtyChange?: (product: IProductItem, qty: number) => void;
}

export function OrderSummary({ items, onQtyChange }: OrderSummaryProps) {
  const { onSubmitProducts } = useHandleOnSubmitProducts();
  return (
    <div className="basis-2/3">
      <CardHeader className="border-b border-slate-200 mb-4">
        <CardTitle className="text-base sm:text-lg">
          Σύνοψη Παραγγελίας
        </CardTitle>
      </CardHeader>
      <Card className="border-0 shadow-none rounded-2xl">
        <CardContent className="p-0 md:p-0 lg:p-0 space-y-3 text-sm">
          {items?.data.map((item) => (
            <ProductCard
              key={item.MTRL}
              product={item}
              onQtyChange={onQtyChange}
              onSubmitProducts={onSubmitProducts}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
