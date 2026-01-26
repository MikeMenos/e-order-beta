"use client";

import StoreCard from "@/components/store-card";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useGetClientData } from "@/hooks/useGetClientData";
import { IStoreInfo } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Stores() {
  const { hydrated, setHydrated, setBasketId, vat, setCurrentBranch } =
    appStore();
  const router = useRouter();
  const isSpecialAfm = vat === "999999999" || vat === "987654321";

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  const { data, mutate } = useGetClientData(isSpecialAfm);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  if (!hydrated) return null;

  const stores = data?.data ?? [];
  const headStore = stores[0];

  const handleBranchChange = (branch: IStoreInfo) => {
    setCurrentBranch(branch);
    if (branch.BASKET_KEY && branch.BASKET_KEY !== "0") {
      setBasketId(branch.BASKET_KEY);
    }
    if (branch.GROUP_CHAIN === "L'ARTIGIANO") {
      router.push("/products/LARTIGIANO");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      {headStore && (
        <CardHeader className="mb-4 px-0 overflow-x-hidden">
          <div className="flex flex-col gap-2 min-w-0">

            <div className="flex items-center justify-between gap-3 min-w-0">
              <CardTitle className="min-w-0 truncate text-sm md:text-xl font-semibold tracking-tight leading-tight">
                {(headStore.NAME ?? "").split("-")[0].trim()}
              </CardTitle>

              {headStore.AFM && (
                <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-zinc-400">
                  ΑΦΜ {headStore.AFM}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y">
        {stores.map((item) => (
          <div
            key={item.KEY_CODE ?? item.BRANCH}
            onClick={() => handleBranchChange(item)}
            className="mb-4 break-inside-avoid cursor-pointer"
          >
            <StoreCard data={item} isPending={false} />
          </div>
        ))}
      </div>
    </>
  );
}
