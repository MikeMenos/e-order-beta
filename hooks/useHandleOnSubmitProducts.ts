"use client";

import { useEffect, useState } from "react";
import { successToast } from "@/components/toasts";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { AddToCartPayload, IProductItem } from "@/lib/interfaces";
import { buildUpdatedLines } from "@/lib/utils";
import { useGetClientData } from "./useGetClientData";
import { appStore } from "@/stores/appStore";

export function useHandleOnSubmitProducts() {
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const { basketId, vat, currentBranch, setHydrated } = appStore();

  const { mutate } = useGetClientData();

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat]);

  const trdr = currentBranch?.TRDR as string;
  const branch = currentBranch?.BRANCH as string;

  const { data: cartData } = useGetCart({
    trdr,
    branch,
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
