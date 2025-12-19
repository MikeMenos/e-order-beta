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
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
      });
    }
    if (
      clientData &&
      clientData?.count === 1 &&
      clientData?.data[0].BASKET_KEY !== "0"
    ) {
      setBasketId(clientData?.data[0].BASKET_KEY);
      setCurrentBranch(clientData?.data[0]);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  }, [
    clientData,
    addToCartMutation,
    setBasketId,
    setCurrentBranch,
    queryClient,
  ]);

  if (!hydrated) return null;
  if (clientData && clientData?.count > 1 && !currentBranch?.BRANCH)
    redirect("/stores");

  if (isLoading || isPending) return <Loading />;

  return <ProductCategories data={data} />;
}
