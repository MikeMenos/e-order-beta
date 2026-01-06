"use client";

import StoreCard from "@/components/store-card";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetClientData } from "@/hooks/useGetClientData";
import { IStoreInfo } from "@/lib/interfaces";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { appStore } from "@/stores/appStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import logoIcon from "@/public/logo-icon.png";
import Image from "next/image";

function getGroupChainIconSrc(groupChain?: string) {
  const text = (groupChain ?? "").toUpperCase();

  if (text.includes("ARTIGIANO")) {
    return "/group-chain/lartigiano.png";
  }

  if (text.includes("BEAT")) {
    return "/group-chain/beat.png";
  }

  return null;
}

export default function Stores() {
  const { hydrated, setHydrated, setBasketId, vat, setCurrentBranch } =
    appStore();
  const router = useRouter();

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  const { mutate: addToCartMutation, isPending } = useAddToCart();
  const { data, mutate } = useGetClientData();

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  if (!hydrated) return null;

  const stores = data?.data ?? [];
  const headStore = stores[0];
  const headerIconSrc = getGroupChainIconSrc(headStore?.GROUP_CHAIN);

  const handleBranchChange = (branch: IStoreInfo) => {
    if (isPending) return;

    if (branch.BASKET_KEY === "0") {
      const payload = buildFirstBasketKeyPayload({
        trdr: Number(branch.TRDR),
        branch: Number(branch.BRANCH),
      });

      addToCartMutation(payload, {
        onSuccess: (data) => {
          if (data.id) {
            setBasketId(data.id);
          }
          if (vat) {
            mutate(vat);
          }
          router.push("/");
        },
      });
    } else if (branch.BASKET_KEY) {
      setBasketId(branch.BASKET_KEY);
      router.push("/");
    }

    setCurrentBranch(branch);
  };

  return (
    <>
      {headStore && (
        <CardHeader className="mb-4 px-0 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-8 md:h-12 w-auto max-w-10 md:max-w-16 shrink-0 items-center justify-center overflow-hidden dark:bg-zinc-800">
                {headerIconSrc ? (
                  <img
                    src={headerIconSrc}
                    alt="Group icon"
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <Image
                    src={logoIcon}
                    alt="Logo"
                    className="h-full w-auto object-contain opacity-80 gap-0.5"
                  />
                )}
              </span>


              <CardTitle className="min-w-0 flex-1 truncate text-sm md:text-xl font-semibold tracking-tight leading-tight">
                {(headStore.NAME ?? "").split("-")[0].trim()}
              </CardTitle>
            </div>

            <span className="text-xs uppercase tracking-[0.16em] text-zinc-400 whitespace-nowrap sm:pl-0">
              ΑΦΜ {headStore.AFM}
            </span>
          </div>
        </CardHeader>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stores.map((item) => (
          <div
            key={item.KEY_CODE ?? item.BRANCH}
            onClick={() => handleBranchChange(item)}
            className="cursor-pointer"
          >
            <StoreCard data={item} isPending={isPending} />
          </div>
        ))}
      </div>
    </>
  );
}
