"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICart, IProductItem } from "@/lib/interfaces";
import ProductCard from "./product-card";

interface OrderSummaryProps {
  items?: ICart;
  onQtyChange?: (product: IProductItem, qty: number) => void;
}

export function OrderSummary({ items, onQtyChange }: OrderSummaryProps) {
  return (
    <div className="basis-2/3 mt-6">
      <Card className="border-0 shadow-none rounded-2xl bg-white">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-base sm:text-lg">
            Σύνοψη Παραγγελίας
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3 pt-0 space-y-3 text-sm">
          {items?.data.map((item) => (
            <ProductCard
              key={item.CODE}
              product={item}
              showRemoveButton
              onQtyChange={onQtyChange}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
