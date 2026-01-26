"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { successToast, errorToast } from "@/components/toasts";
import { getFirstBasketKey, useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { AddToCartPayload, IProductItem } from "@/lib/interfaces";
import { buildUpdatedLines } from "@/lib/utils";
import { useGetClientData } from "./useGetClientData";
import { useGetClientsAll } from "./useGetClientsAll";
import { appStore } from "@/stores/appStore";

export function useHandleOnSubmitProducts() {
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    basketId,
    vat,
    currentBranch,
    setHydrated,
    setBasketId,
    setCurrentBranch,
  } = appStore();
  const isSpecialAfm = vat === "999999999" || vat === "987654321";
  const { mutate, mutateAsync: mutateClientData } =
    useGetClientData(isSpecialAfm);
  const { refetch: refetchClientsAll } = useGetClientsAll(isSpecialAfm);

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  const trdr = currentBranch?.TRDR ? currentBranch.TRDR : undefined;
  const branch = currentBranch?.BRANCH ? currentBranch.BRANCH : undefined;

  const { data: cartData } = useGetCart({
    trdr,
    branch,
  });

  const { mutateAsync: addToCartMutation, isPending } = useAddToCart();

  const onSubmitProducts = async (
    product: IProductItem,
    qty: number,
    isDelete?: boolean,
  ) => {
    setPendingProductId(product.ITEMUID);

    let effectiveBasketId = basketId;

    if (currentBranch?.BASKET_KEY === "0") {
      const t = Number(currentBranch.TRDR);
      const b = Number(currentBranch.BRANCH);
      if (Number.isNaN(t) || Number.isNaN(b)) {
        errorToast("Λάθος κατάστημα");
        setPendingProductId(null);
        return;
      }
      try {
        const id = await getFirstBasketKey({ trdr: t, branch: b });
        if (!id) {
          errorToast("Δεν δημιουργήθηκε καλάθι");
          setPendingProductId(null);
          return;
        }
        setBasketId(id);
        effectiveBasketId = id;
        queryClient.invalidateQueries({ queryKey: ["cart"] });

        if (isSpecialAfm) {
          const { data: res } = await refetchClientsAll();
          const updated = res?.data?.find(
            (b) =>
              String(b.TRDR) === String(currentBranch.TRDR) &&
              String(b.BRANCH) === String(currentBranch.BRANCH),
          );
          if (updated) setCurrentBranch(updated);
        } else if (vat) {
          await mutateClientData(vat);
        }
      } catch {
        errorToast("Σφάλμα δημιουργίας καλαθιού");
        setPendingProductId(null);
        return;
      }
    }

    if (!effectiveBasketId) {
      errorToast("Το καλάθι δεν βρέθηκε");
      setPendingProductId(null);
      return;
    }

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
      KEY: effectiveBasketId,
      LOCATEINFO:
        "ITELINES:MTRL,LINENUM,QTY1,QTY2,MTRL_MTRL_CODE,MTRL_MTRL_NAME",
      data: {
        ITELINES:
          updatedLines?.length === 0 && isDelete
            ? [{ MTRL: 2924, QTY2: 0.1 }]
            : updatedLines,
      },
    };

    try {
      await addToCartMutation(payload);
      if (vat === "999999999") {
        await queryClient.invalidateQueries({ queryKey: ["cart-pricing"] });
      }
      successToast(
        isDelete ? "Αφαιρέθηκε από το καλάθι" : "Το καλάθι ενημερώθηκε",
      );
    } catch {
      // errorToast handled by mutation
    } finally {
      setPendingProductId(null);
    }
  };

  return { onSubmitProducts, pendingProductId, isPending };
}
