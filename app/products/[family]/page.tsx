"use client";

import ProductCard from "@/components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { useGetClientData } from "@/hooks/useGetClientData";
import { useGetProductsPerFamily } from "@/hooks/useGetProductsPerFamily";
import { useHandleOnSubmitProducts } from "@/hooks/useHandleOnSubmitProducts";
import { IProductItem } from "@/lib/interfaces";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { appStore } from "@/stores/appStore";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export default function FamilyProducts() {
  const {
    setHydrated,
    hydrated,
    currentBranch,
    vat,
    setCurrentBranch,
    setBasketId,
  } = appStore();
  const pathname = usePathname();
  const family = decodeURIComponent(pathname.split("/")[2] || "").trim();

  const { data: clientData, mutate } = useGetClientData();

  const { mutate: addToCartMutation } = useAddToCart();
  const hasTriggeredBasketCreation = useRef(false);

  // Derive trdr and branch from currentBranch if available, otherwise fall back to clientData
  // This ensures the query has the correct params even before currentBranch is set
  const { trdr, branch } = useMemo(() => {
    // Prefer currentBranch if it's already set
    if (currentBranch?.TRDR && currentBranch?.BRANCH) {
      return {
        trdr: String(currentBranch.TRDR),
        branch: String(currentBranch.BRANCH),
      };
    }

    // Fall back to clientData if currentBranch is not yet set
    if (clientData?.count === 1 && clientData?.data[0]) {
      const firstBranch = clientData.data[0];
      return {
        trdr: firstBranch.TRDR ? String(firstBranch.TRDR) : undefined,
        branch: firstBranch.BRANCH ? String(firstBranch.BRANCH) : undefined,
      };
    }

    return { trdr: undefined, branch: undefined };
  }, [currentBranch, clientData]);

  const { data, isLoading } = useGetProductsPerFamily({
    family,
    trdr,
    branch,
  });

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  // Set currentBranch when clientData is available for L'ARTIGIANO
  // The query will automatically refetch when trdr/branch change via useMemo
  useEffect(() => {
    // If there is only one branch, and the basket key is 0, we need to create a new basket with a 'fake' addition of a product to the cart
    if (
      clientData &&
      clientData?.count === 1 &&
      clientData.data[0]?.GROUP_CHAIN === "L'ARTIGIANO" &&
      clientData?.data[0].BASKET_KEY === "0" &&
      !hasTriggeredBasketCreation.current &&
      // Only run if currentBranch is not already set for this branch
      (!currentBranch ||
        currentBranch.TRDR !== clientData.data[0].TRDR ||
        currentBranch.BRANCH !== clientData.data[0].BRANCH)
    ) {
      hasTriggeredBasketCreation.current = true;
      const payload = buildFirstBasketKeyPayload({
        trdr: Number(clientData?.data[0].TRDR),
        branch: Number(clientData?.data[0].BRANCH),
      });

      addToCartMutation(payload, {
        onSuccess: (data) => {
          if (data.id) {
            setBasketId(data.id);
          }
          setCurrentBranch(clientData?.data[0]);
        },
      });
    }

    if (
      clientData &&
      clientData.count === 1 &&
      clientData.data[0]?.GROUP_CHAIN === "L'ARTIGIANO" &&
      clientData?.data[0].BASKET_KEY !== "0"
    ) {
      setCurrentBranch(clientData.data[0]);
      if (clientData.data[0].BASKET_KEY) {
        setBasketId(clientData.data[0].BASKET_KEY);
      }
      // Reset the ref when BASKET_KEY is not "0" to allow future basket creation if needed
      hasTriggeredBasketCreation.current = false;
    }
  }, [
    clientData,
    currentBranch,
    setBasketId,
    setCurrentBranch,
    addToCartMutation,
  ]);

  const { data: cartData } = useGetCart({ trdr, branch });

  const { onSubmitProducts, pendingProductId } = useHandleOnSubmitProducts();

  const productsWithQty = useMemo((): IProductItem[] | undefined => {
    return data?.map((product) => {
      const productId = Number(product.ITEMUID);

      const matchingCartLine = cartData?.data?.find(
        (line: IProductItem) => Number(line.MTRL) === productId
      );

      return {
        ...product,
        Qty2: matchingCartLine ? Number(matchingCartLine.Qty2) : 0,
      };
    });
  }, [data, cartData]);

  if (!hydrated) return null;

  if (clientData && clientData?.count > 1 && !currentBranch?.BRANCH)
    redirect("/stores");

  if (isLoading) return <Loading />;

  const favProducts = productsWithQty?.filter((p) => p.FAV === "FAV");
  const regProducts = productsWithQty?.filter((p) => p.FAV === "REG");

  return (
    <>
      <Card className="shadow-none rounded-2xl">
        <CardContent className="p-0 lg:p-3 space-y-6 text-sm">
          {favProducts && favProducts.length > 0 && (
            <section>
              <div className="relative mb-3">
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  Αγαπημενα Προϊοντα
                </span>
              </div>

              <div className="space-y-3">
                {favProducts.map((item) => (
                  <ProductCard
                    product={item}
                    key={item.CODE}
                    onSubmitProducts={onSubmitProducts}
                    isPending={pendingProductId === item.ITEMUID}
                  />
                ))}
              </div>
            </section>
          )}

          {regProducts && regProducts.length > 0 && (
            <section>
              <div className="mb-3">
                <span className="inline-flex items-center rounded-full bg-black px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  Αλλα Προϊοντα
                </span>
              </div>

              <div className="space-y-3">
                {regProducts.map((item) => (
                  <ProductCard
                    product={item}
                    key={item.CODE}
                    onSubmitProducts={onSubmitProducts}
                    isPending={pendingProductId === item.ITEMUID}
                  />
                ))}
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </>
  );
}
