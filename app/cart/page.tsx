"use client";

import { CartTotals } from "@/components/cart-totals";
import { OrderSummary } from "@/components/order-summary";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { AddToCartPayload, IProductItem } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { useState } from "react";

export default function Cart() {
  const { clientData, branchNumber } = appStore();

  const [editedQuantities, setEditedQuantities] = useState<
    Record<number, number>
  >({});
  const currentBranch = clientData?.data.find(
    (item) => item.BRANCH === branchNumber
  );
  const { data, isLoading } = useGetCart({
    trdr: currentBranch?.TRDR,
    branch: branchNumber,
  });

  const { mutate: addToCartMutation } = useAddToCart();

  const handleSendOrder = ({
    comments,
    delivDate,
  }: {
    comments: string;
    delivDate: string;
  }) => {
    if (!data?.data) return;

    const existingLines = data.data.map((line) => ({
      MTRL: Number(line.MTRL),
      QTY2: line.Qty2,
    }));

    const updatedLines = existingLines.map((line) => {
      const delta = editedQuantities[line.MTRL];

      if (delta === undefined) return line;

      return {
        ...line,
        QTY2: delta,
      };
    });

    const payload: AddToCartPayload = {
      service: "setData",
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID!,
      appId: process.env.NEXT_PUBLIC_APP_ID!,
      OBJECT: "SALDOC",
      KEY: "",

      data: {
        SALDOC: [
          {
            SERIES: "7024",
            TRDR: Number(currentBranch?.TRDR),
            TRDBRANCH: Number(branchNumber),
            PAYMENT: 1006,
            TRUCKS: 2,
            DELIVDATE: delivDate,
            COMMENTS: comments,
            REMARKS: "",
          },
        ],
        MTRDOC: [
          {
            TRUCKS: 2,
            DELIVDATE: delivDate,
          },
        ],

        ITELINES: updatedLines,
      },
    };
    console.log(payload);
    // addToCartMutation(payload);
  };

  const handleQtyEdit = (product: IProductItem, newQty: number) => {
    const oldLine = data?.data?.find(
      (item) => Number(item.MTRL) === Number(product.MTRL)
    );

    const oldQty = oldLine ? Number(oldLine.Qty2) : 0;

    const delta = Math.abs(newQty - oldQty);

    setEditedQuantities((prev) => ({
      ...prev,
      [Number(product.MTRL)]: delta,
    }));
  };
  console.log(editedQuantities);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex md:flex-row flex-col gap-6">
      <OrderSummary items={data} onQtyChange={handleQtyEdit} />

      <div className="basis-1/3">
        <CartTotals items={data?.data} onSendOrder={handleSendOrder} />
      </div>
    </div>
  );
}
