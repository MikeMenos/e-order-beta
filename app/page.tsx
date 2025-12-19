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
    branchNumber,
    setBasketId,
    setBranchNumber,
    vat,
  } = appStore();

  const { data, isLoading } = useGetFamilies();
  const { mutate: addToCartMutation } = useAddToCart();
  const { data: clientData, mutate, isPending } = useGetClientData();

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat]);

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
          setBasketId(data.id!);
          setBranchNumber(clientData?.data[0].BRANCH);
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
      });
    }
    if (
      clientData &&
      clientData?.count === 1 &&
      clientData?.data[0].BASKET_KEY !== "0"
    ) {
      setBranchNumber(clientData?.data[0].BRANCH);
      setBasketId(clientData?.data[0].BASKET_KEY);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  }, [clientData]);

  if (!hydrated) return null;
  if (clientData && clientData?.count > 1 && !branchNumber) redirect("/stores");

  if (isLoading || isPending) return <Loading />;

  return <ProductCategories data={data} />;
}
