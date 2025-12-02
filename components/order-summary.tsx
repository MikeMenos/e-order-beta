"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToCartPayload, ICart, IProductInCart, IProductItem } from "@/lib/interfaces";
import ProductCard from "./product-card";
import { useState } from "react";
import { appStore } from "@/stores/appStore";
import { useAddToCart } from "@/hooks/useAddToCart";

interface OrderSummaryProps {
  items?: ICart
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const { clientData, branchNumber, basketId, setHydrated, hydrated } =
    appStore();
  const currentBranch = clientData?.data.find(
    (item) => item.BRANCH === branchNumber
  );
  const { mutate: addToCartMutation } = useAddToCart();

  const handleAddToOrder = (product: IProductInCart, qty: number) => {
    setPendingProductId(product.ITEMUID);
    const KEY = items?.count === 0 ? "" : basketId;

    const existingLines =
      items?.data?.map((line: IProductInCart) => ({
        MTRL: Number(line.MTRL),
        QTY2: Number(line.Qty2),
      })) ?? [];

    const newLineMTRL = Number(product.MTRL);

    const lineExists = existingLines.find(l => l.MTRL === newLineMTRL);

    let updatedLines;

    if (lineExists) {
      updatedLines = existingLines.map(l =>
        l.MTRL === newLineMTRL
          ? { ...l, QTY2: l.QTY2 + ((l.QTY2 - qty) < 0 ? Math.abs(l.QTY2 - qty) : -(l.QTY2 - qty)) }
          : l
      );
    } else {
      updatedLines = [
        ...existingLines,
        { MTRL: newLineMTRL, QTY2: qty }
      ];
    }


    const payload: AddToCartPayload = {
      service: "setData",
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID!,
      appId: process.env.NEXT_PUBLIC_APP_ID!,
      OBJECT: "SALDOC",
      KEY,

      data: {
        SALDOC: [
          {
            SERIES: "7001",
            TRDR: Number(currentBranch?.TRDR),
            TRDBRANCH: Number(branchNumber),
            PAYMENT: 1006,
            TRUCKS: 2,
            DELIVDATE: "",
            COMMENTS: "",
            REMARKS: "",
          },
        ],
        MTRDOC: [
          {
            TRUCKS: 2,
            DELIVDATE: "",
          },
        ],

        ITELINES: updatedLines,
      },
    };

    addToCartMutation(payload, {
      onSettled: () => {
        setPendingProductId(null);
      },
    });
  };

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
              onAddToOrder={handleAddToOrder}
              isPending={pendingProductId === item.ITEMUID}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
