"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICart, IProductItem } from "@/lib/interfaces";
import ProductCard from "./product-card";
import { useHandleOnSubmitProducts } from "@/hooks/useHandleOnSubmitProducts";
import Heading from "@/components/layout/heading";

interface OrderSummaryProps {
  items?: ICart;
  onQtyChange?: (product: IProductItem, qty: number) => void;
}

export function OrderSummary({ items, onQtyChange }: OrderSummaryProps) {
  const { onSubmitProducts, isPending } = useHandleOnSubmitProducts();
  return (
    <div className="basis-2/3">
      <Heading
        title="Σύνοψη Παραγγελίας"
      />
      <Card className="shadow-none rounded-2xl">
        <CardContent className="p-0 md:p-0 lg:p-0 space-y-3 text-sm">
          {items?.data.map((item) => (
            <ProductCard
              key={item.MTRL}
              product={item}
              onQtyChange={onQtyChange}
              onSubmitProducts={onSubmitProducts}
              isPending={isPending}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
