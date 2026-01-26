"use client";

import ProductCategories from "@/components/product-categories";
import Loading from "@/components/ui/loading";
import { useGetClientData } from "@/hooks/useGetClientData";
import { useGetFamilies } from "@/hooks/useGetFamilies";
import { appStore } from "@/stores/appStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {
    setHydrated,
    hydrated,
    setBasketId,
    currentBranch,
    vat,
    setCurrentBranch,
  } = appStore();
  const isSpecialAfm = vat === "999999999" || vat === "987654321";
  const { data, isLoading } = useGetFamilies();
  const {
    data: clientData,
    mutate,
    isPending,
  } = useGetClientData(isSpecialAfm);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!clientData || clientData.count !== 1) return;
    const branch = clientData.data[0];
    setCurrentBranch(branch);
    if (branch.BASKET_KEY && branch.BASKET_KEY !== "0") {
      setBasketId(branch.BASKET_KEY);
    }
  }, [clientData, setCurrentBranch, setBasketId]);

  if (!hydrated) return null;
  // If there are more than one branch, and the current branch is not set, redirect to the stores page
  if (clientData && clientData?.count > 1 && !currentBranch?.BRANCH)
    redirect("/stores");

  // If the current branch is Artigiano, redirect to the Artigiano products page
  if (currentBranch && currentBranch.GROUP_CHAIN === "L'ARTIGIANO")
    redirect("/products/LARTIGIANO");

  if (isLoading || isPending) return <Loading />;

  return <ProductCategories data={data} />;
}
