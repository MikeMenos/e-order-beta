"use client";

import ProductCategories from "@/components/product-categories";
import Loading from "@/components/ui/loading";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetClientData } from "@/hooks/useGetClientData";
import { useGetFamilies } from "@/hooks/useGetFamilies";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { appStore } from "@/stores/appStore";
import { useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const queryClient = useQueryClient();
  const {
    setHydrated,
    hydrated,
    setBasketId,
    currentBranch,
    vat,
    setCurrentBranch,
  } = appStore();

  const { data, isLoading } = useGetFamilies();
  const { mutate: addToCartMutation } = useAddToCart();
  const { data: clientData, mutate, isPending } = useGetClientData();

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    // If there is only one branch, and the basket key is 0, we need to create a new basket with a 'fake' addition of a product to the cart
    if (
      clientData &&
      clientData?.count === 1 &&
      clientData?.data[0].BASKET_KEY === "0"
    ) {
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
    // If there is only one branch, and the basket key is not 0, we need to set the basket key
    if (
      clientData &&
      clientData?.count === 1 &&
      clientData?.data[0].BASKET_KEY !== "0"
    ) {
      setBasketId(clientData?.data[0].BASKET_KEY);
      setCurrentBranch(clientData?.data[0]);
    }
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, [
    clientData,
    addToCartMutation,
    setBasketId,
    setCurrentBranch,
    queryClient,
  ]);

  if (!hydrated) return null;
  // If there are more than one branch, and the current branch is not set, redirect to the stores page
  if (clientData && clientData?.count > 1 && !currentBranch?.BRANCH)
    redirect("/stores");

  // If the current branch is Artigiano, redirect to the Artigiano products page
  if (clientData && clientData?.data[0].GROUP_CHAIN === "L'ARTIGIANO")
    redirect("/products/LARTIGIANO");

  if (isLoading || isPending) return <Loading />;

  return <ProductCategories data={data} />;
}
