"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { CartTotals } from "@/components/cart-totals";
import Heading from "@/components/layout/heading";
import { OrderSummary } from "@/components/order-summary";
import { successToast } from "@/components/toasts";
import EmptyCart from "@/components/ui/empty-cart";
import Loading from "@/components/ui/loading";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { useGetCartPricing } from "@/hooks/useGetCartPricing";
import { useGetClientData } from "@/hooks/useGetClientData";
import { AddToCartPayload, IProductItem } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";

export default function Cart() {
  const { basketId, vat, currentBranch } = appStore();
  const isSpecialAfm = vat === "999999999" || vat === "987654321";
  const [editedQuantities, setEditedQuantities] = useState<
    Record<number, number>
  >({});
  const [comments, setComments] = useState("");
  const [delivDate, setDelivDate] = useState("");

  const { mutate: getClientData } = useGetClientData(isSpecialAfm);

  useEffect(() => {
    if (!vat) return;
    getClientData(vat);
  }, [vat, getClientData]);

  const trdr = currentBranch?.TRDR ? String(currentBranch.TRDR) : undefined;
  const branch = currentBranch?.BRANCH
    ? String(currentBranch.BRANCH)
    : undefined;

  const { data, isLoading } = useGetCart({ trdr, branch });
  const isVat999999999 = vat === "999999999";
  const { data: pricingData, isLoading: isPricingLoading } = useGetCartPricing({
    basketId: basketId ?? undefined,
    enabled: isVat999999999,
  });

  const enrichedCart = useMemo(() => {
    if (!data?.data) return data;
    if (!isVat999999999 || !pricingData?.data?.ITELINES) {
      return data;
    }
    const itelines = pricingData.data.ITELINES;
    const enriched = data.data.map((item) => {
      const match = itelines.find(
        (line) => String(line.MTRL) === String(item.MTRL),
      );
      if (!match) return item;
      return {
        ...item,
        LINEVAL: match.LINEVAL,
        SXPERC: match.SXPERC,
      };
    });
    return { ...data, data: enriched };
  }, [data, isVat999999999, pricingData?.data?.ITELINES]);

  const sumAmnt = pricingData?.data?.SALDOC?.[0]?.SUMAMNT;

  const { mutateAsync: addToCart, isPending } = useAddToCart();

  const handleSendOrder = useCallback(
    async ({
      comments,
      delivDate,
    }: {
      comments: string;
      delivDate: string;
    }) => {
      if (!data || !data.data) return;
      if (!basketId) return;

      const BASE_LINENUM = 9000001;

      const existingLines =
        data.data.map((line: IProductItem, index) => ({
          LINENUM: BASE_LINENUM + index,
          MTRL: Number(line.MTRL),
          QTY2: Number(line.Qty2),
        })) ?? [];

      const updatedLines = existingLines.map((line) => {
        const delta = editedQuantities[line.MTRL];
        if (delta === undefined) return line;
        return { ...line, QTY2: delta };
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
              SERIES:
                currentBranch?.GROUP_CHAIN === "L'ARTIGIANO" ? "7020" : "7024",
              TRDR: Number(currentBranch?.TRDR),
              TRDBRANCH: Number(currentBranch?.BRANCH),
              PAYMENT: 1006,
              TRUCKS: 2,
              DELIVDATE: delivDate,
              COMMENTS:
                vat === "999999999"
                  ? `Order16: ${comments}`
                  : vat === "987654321"
                    ? `FromC: ${comments}`
                    : comments,
              REMARKS: "",
            },
          ],
          MTRDOC: [
            {
              TRUCKS: 2,
              DELIVDATE: delivDate,
              DEPTRDR:
                currentBranch?.GROUP_CHAIN === "L'ARTIGIANO" ? 185 : undefined,
              BILLTRDR:
                currentBranch?.GROUP_CHAIN === "L'ARTIGIANO" ? 185 : undefined,
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
        KEY: basketId,
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

      try {
        // 1) place order
        await addToCart(payload);

        // 2) clear basket
        await addToCart(payloadForBasketDeletion);

        // UI feedback
        successToast("Η παραγγελία σας έχει σταλθεί");
        setComments("");
        setDelivDate("");
        setEditedQuantities({});
      } catch {}
    },
    [
      addToCart,
      basketId,
      currentBranch,
      data,
      editedQuantities,
      setComments,
      setDelivDate,
      setEditedQuantities,
    ],
  );

  const handleQtyEdit = useCallback((product: IProductItem, newQty: number) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [Number(product.MTRL)]: newQty,
    }));
  }, []);

  if (isLoading) return <Loading />;
  if (data?.count === 0) return <EmptyCart />;

  return (
    <div className="flex md:flex-row flex-col gap-6">
      <OrderSummary
        items={enrichedCart}
        onQtyChange={handleQtyEdit}
        showVatPricing={isVat999999999}
        isPricingLoading={isPricingLoading}
      />

      <div className="basis-1/3 space-y-4">
        <Heading
          title="Λεπτομέρειες Παραγγελίας"
          showVatPricing={isVat999999999}
          sumAmnt={sumAmnt}
          isPricingLoading={isPricingLoading}
        />
        <CartTotals
          items={data?.data}
          onSendOrder={handleSendOrder}
          comments={comments}
          setComments={setComments}
          delivDate={delivDate}
          setDelivDate={setDelivDate}
          isPending={isPending}
          currentBranch={currentBranch}
        />
      </div>
    </div>
  );
}
