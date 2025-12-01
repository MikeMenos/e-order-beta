"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardProduct } from "@/components/cart-product";
import { IProductInCart } from "@/lib/interfaces";
import ProductCard from "./product-card";

interface OrderSummaryProps {
  items?: IProductInCart[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  return (
    <div className="basis-2/3 mt-6">
      <Card className="border-0 shadow-none rounded-2xl bg-white">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-base sm:text-lg">
            Σύνοψη Παραγγελίας
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3 pt-0 space-y-3 text-sm">
          {items?.map((item) => (
            <ProductCard key={item.MTRL} product={item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
