"use client";

import { successToast } from "@/components/toasts";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { AddToCartPayload, IProductItem } from "@/lib/interfaces";
import { buildUpdatedLines } from "@/lib/utils";
import { appStore } from "@/stores/appStore";
import { useState } from "react";

export function useHandleOnSubmitProducts() {
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const { basketId, branchNumber, currentBranch } = appStore();

  const { data: cartData } = useGetCart({
    trdr: currentBranch?.TRDR,
    branch: branchNumber,
  });

  const { mutate: addToCartMutation, isPending } = useAddToCart();

  const onSubmitProducts = (
    product: IProductItem,
    qty: number,
    isDelete?: boolean
  ) => {
    setPendingProductId(product.ITEMUID);

    const updatedLines = buildUpdatedLines({
      cartLines: cartData?.data,
      product,
      qty,
      isDelete,
    });

    const payload: AddToCartPayload = {
      service: "setData",
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID!,
      appId: process.env.NEXT_PUBLIC_APP_ID!,
      OBJECT: "SALDOC",
      KEY: basketId as string,
      LOCATEINFO:
        "ITELINES:MTRL,LINENUM,QTY1,QTY2,MTRL_MTRL_CODE,MTRL_MTRL_NAME",
      data: {
        ITELINES:
          updatedLines?.length === 0 && isDelete
            ? [
                {
                  MTRL: 2924,
                  QTY2: 0.1,
                },
              ]
            : updatedLines,
      },
    };

    addToCartMutation(payload, {
      onSuccess: () => {
        successToast(
          isDelete ? "Αφαιρέθηκε από το καλάθι" : "Προστέθηκε στο καλάθι"
        );
        setPendingProductId(null);
      },
      onError: () => {
        setPendingProductId(null);
      },
    });
  };

  return { onSubmitProducts, pendingProductId, isPending };
}
