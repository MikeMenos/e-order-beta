"use client";

import ProductCard from "@/components/product-card";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { useGetProductsPerFamily } from "@/hooks/useGetProductsPerFamily";
import {
  AddToCartPayload,
  IProductInCart,
  IProductItem,
} from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function FamilyProducts() {
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const { clientData, setHydrated, hydrated, branchNumber, basketId } =
    appStore();
  const pathname = usePathname();
  const family = pathname.split("/")[2];
  const trdr = clientData?.data[0].TRDR as string;
  const branch = clientData?.data[0].BRANCH as string;
  const currentBranch = clientData?.data.find(
    (item) => item.BRANCH === branchNumber
  );

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  const { data, isLoading } = useGetProductsPerFamily({ family, trdr, branch });

  const { data: cartData } = useGetCart({
    trdr: currentBranch?.TRDR,
    branch: branchNumber,
  });
  const { mutate: addToCartMutation } = useAddToCart();

  const productsWithQty = useMemo(() => {
    return data?.map((product) => {
      const productId = Number(product.ITEMUID);

      const matchingCartLine = cartData?.data?.find(
        (line: IProductInCart) => Number(line.MTRL) === productId
      );

      return {
        ...product,
        Qty2: matchingCartLine ? Number(matchingCartLine.Qty2) : 0,
      };
    });
  }, [data, cartData]);


  const handleAddToOrder = (product: IProductItem, qty: number) => {
    setPendingProductId(product.ITEMUID);
    const KEY = cartData?.count === 0 ? "" : basketId;

    const existingLines =
      cartData?.data?.map((line: IProductInCart) => ({
        MTRL: Number(line.MTRL),
        QTY2: Number(line.Qty2),
      })) ?? [];

    const newLineMTRL = Number(product.ITEMUID);

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

  if (!hydrated) return null;
  if (clientData && clientData?.count > 1 && !branchNumber) redirect("/stores");

  if (isLoading) return <div>Loading...</div>;

  return productsWithQty?.map((item) => (
    <ProductCard
      product={item}
      key={item.CODE}
      onAddToOrder={handleAddToOrder}
      isPending={pendingProductId === item.ITEMUID}
    />
  ));
}
