"use client";

import ProductCategories from "@/components/product-categories";
import Loading from "@/components/ui/loading";
import { useGetFamilies } from "@/hooks/useGetFamilies";
import { appStore } from "@/stores/appStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { clientData, setHydrated, hydrated, branchNumber, basketId } =
    appStore();

  const { data, isLoading } = useGetFamilies();

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  if (!hydrated) return null;
  if (clientData && clientData?.count > 1 && !branchNumber) redirect("/stores");

  if (isLoading) return <Loading />;

  return <ProductCategories data={data} />;
}
