"use client";

import { CartTotals } from "@/components/cart-totals";
import { OrderSummary } from "@/components/order-summary";
import { successToast } from "@/components/toasts";
import EmptyCart from "@/components/ui/empty-cart";
import Loading from "@/components/ui/loading";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { useGetClientData } from "@/hooks/useGetClientData";
import { AddToCartPayload, IProductItem } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { useEffect, useState } from "react";

export default function Cart() {
  const { basketId, vat, currentBranch } = appStore();

  const [editedQuantities, setEditedQuantities] = useState<
    Record<number, number>
  >({});
  const [comments, setComments] = useState("");
  const [delivDate, setDelivDate] = useState("");

  const { mutate } = useGetClientData();

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat]);

  const trdr = currentBranch?.TRDR as string;
  const branch = currentBranch?.BRANCH as string;

  const { data, isLoading } = useGetCart({
    trdr,
    branch,
  });

  const { mutate: addToCartMutation, isPending } = useAddToCart();

  const handleSendOrder = ({
    comments,
    delivDate,
  }: {
    comments: string;
    delivDate: string;
  }) => {
    if (!data?.data) return;

    const BASE_LINENUM = 9000001;

    const existingLines =
      data?.data?.map((line: IProductItem, index) => ({
        LINENUM: BASE_LINENUM + index,
        MTRL: Number(line.MTRL),
        QTY2: Number(line.Qty2),
      })) ?? [];

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
            TRDBRANCH: Number(currentBranch?.BRANCH),
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

    const payloadForBasketDeletion: AddToCartPayload = {
      service: "setData",
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID!,
      appId: process.env.NEXT_PUBLIC_APP_ID!,
      OBJECT: "SALDOC",
      KEY: basketId as string,

      data: {
        SALDOC: [
          {
            SERIES: "7001",
            TRDR: Number(currentBranch?.TRDR),
            TRDBRANCH: Number(currentBranch?.BRANCH),
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

        ITELINES: [
          {
            MTRL: 2924,
            QTY2: 0.1,
          },
        ],
      },
    };

    addToCartMutation(payload, {
      onSuccess: () => {
        addToCartMutation(payloadForBasketDeletion);
        successToast("Η παραγγελία σας έχει σταλθεί");
        setComments("");
        setDelivDate("");
      },
    });
  };

  const handleQtyEdit = (product: IProductItem, newQty: number) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [Number(product.MTRL)]: newQty,
    }));
  };
  if (isLoading) return <Loading />;

  if (data?.count === 0) return <EmptyCart />;

  return (
    <div className="flex md:flex-row flex-col gap-6">
      <OrderSummary items={data} onQtyChange={handleQtyEdit} />

      <div className="basis-1/3">
        <CartTotals
          items={data?.data}
          onSendOrder={handleSendOrder}
          comments={comments}
          setComments={setComments}
          delivDate={delivDate}
          setDelivDate={setDelivDate}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
