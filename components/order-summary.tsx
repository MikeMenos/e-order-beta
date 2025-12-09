"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICart } from "@/lib/interfaces";
import ProductCard from "./product-card";

interface OrderSummaryProps {
  items?: ICart;
}

export function OrderSummary({ items }: OrderSummaryProps) {
  return (
    <div className="basis-2/3">
      <Card className="border-0 shadow-none rounded-2xl">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-base sm:text-lg">
            Σύνοψη Παραγγελίας
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 md:p-0 lg:p-0 space-y-3 text-sm">
          {items?.data.map((item) => (
            <ProductCard key={item.CODE} product={item} showRemoveButton />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
