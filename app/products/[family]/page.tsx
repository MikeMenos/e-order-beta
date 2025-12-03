"use client";

import ProductCard from "@/components/product-card";
import { successToast } from "@/components/toasts";
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
      KEY: basketId ?? '',

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
        successToast('Προστέθηκε στο καλάθι');
        setPendingProductId(null);
      },
    });
  };

  if (!hydrated) return null;
  if (clientData && clientData?.count > 1 && !branchNumber) redirect("/stores");

  if (isLoading) return <div>Loading...</div>;

  const favProducts = productsWithQty?.filter((p) => p.FAV === "FAV");
  const regProducts = productsWithQty?.filter((p) => p.FAV === "REG");


  return (
    <>
      {/* FAV PRODUCTS */}
      {favProducts && favProducts.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">Αγαπημένα Προϊόντα</h2>
          {favProducts.map((item) => (
            <ProductCard
              product={item}
              key={item.CODE}
              onAddToOrder={handleAddToOrder}
              isPending={pendingProductId === item.ITEMUID}
            />
          ))}
        </>
      )}

      {/* Divider only if both exist */}
      {favProducts && favProducts?.length > 0 && regProducts && regProducts?.length > 0 && <hr className="my-4" />}

      {/* REGULAR PRODUCTS */}
      {regProducts && regProducts.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">Άλλα Προϊόντα</h2>
          {regProducts.map((item) => (
            <ProductCard
              product={item}
              key={item.CODE}
              onAddToOrder={handleAddToOrder}
              isPending={pendingProductId === item.ITEMUID}
            />
          ))}
        </>
      )}
    </>
  );

}
