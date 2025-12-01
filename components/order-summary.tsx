"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardProduct } from "@/components/cart-product";
import { ICartProductItem } from "@/lib/interfaces";

interface OrderSummaryProps {
  items: ICartProductItem[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  return (
    <div className="basis-2/3 mt-6">
      <Card className="border border-slate-200/80 shadow-none rounded-2xl bg-white">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-base sm:text-lg">
            Σύνοψη Παραγγελίας
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          {items.map((item) => (
            <CardProduct key={item.MTRL} item={item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
