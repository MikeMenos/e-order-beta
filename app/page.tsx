"use client";

import ProductCategories from "@/components/product-categories";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetFamilies } from "@/hooks/useGetFamilies";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { appStore } from "@/stores/appStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {
    clientData,
    setHydrated,
    hydrated,
    branchNumber,
    setBasketId,
    setBranchNumber,
  } = appStore();

  const { data, isLoading } = useGetFamilies();
  const { mutate: addToCartMutation } = useAddToCart();

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (clientData && clientData?.count === 1) {
      const payload = buildFirstBasketKeyPayload({
        trdr: Number(clientData?.data[0].TRDR),
        branch: Number(clientData?.data[0].BRANCH),
      });

      addToCartMutation(payload, {
        onSuccess: (data) => {
          setBasketId(data.id!);
          setBranchNumber(clientData?.data[0].BRANCH);
        },
      });
    }
  }, [clientData]);

  if (!hydrated) return null;
  if (clientData && clientData?.count > 1 && !branchNumber) redirect("/stores");

  if (isLoading) return <div>Loading...</div>;

  return <ProductCategories data={data} />;
}
