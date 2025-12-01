"use client";

import ProductCard from "@/components/product-card";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { useGetProductsPerFamily } from "@/hooks/useGetProductsPerFamily";
import {
  AddToCartPayload,
  IProductInBasket,
  IProductItem,
} from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  const handleAddToOrder = (product: IProductItem, qty: number) => {
    setPendingProductId(product.ITEMUID);
    const KEY = cartData?.count === 0 ? "" : basketId;

    const existingLines =
      cartData?.data?.map((line: IProductInBasket) => ({
        MTRL: Number(line.MTRL),
        QTY2: Number(line.Qty2),
      })) ?? [];

    const newLine = {
      MTRL: Number(product.ITEMUID),
      QTY2: qty,
    };

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

        ITELINES: [...existingLines, newLine],
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

  return data?.map((item) => (
    <ProductCard
      product={item}
      key={item.CODE}
      onAddToOrder={handleAddToOrder}
      isPending={pendingProductId === item.ITEMUID}
    />
  ));
}
