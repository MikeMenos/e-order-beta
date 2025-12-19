"use client";

import StoreCard from "@/components/store-card";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetClientData } from "@/hooks/useGetClientData";
import { IStoreInfo } from "@/lib/interfaces";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { appStore } from "@/stores/appStore";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function getGroupChainIconSrc(groupChain?: string) {
  const text = (groupChain ?? "").toUpperCase();

  if (text.includes("ARTIGIANO")) {
    return "/group-chain/lartigiano.png";
  }

  if (text.includes("EAT")) {
    return "/group-chain/beat.png";
  }

  return null;
}

export default function Stores() {
  const { hydrated, setHydrated, setBranchNumber, setBasketId, vat } =
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
  }, [vat]);

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
          setBasketId(data.id!);
          mutate(vat as string);
          router.push("/");
        },
      });
    } else {
      setBasketId(branch.BASKET_KEY as string);
      router.push("/");
    }

    setBranchNumber(branch.BRANCH);
  };

  return (
    <>
      {headStore && (
        <CardHeader className="border-b border-slate-200 mb-4 px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-100 shadow-sm dark:bg-zinc-800">
                {headerIconSrc ? (
                  <img
                    src={headerIconSrc}
                    alt="Group icon"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2
                    className="h-6 w-6 m-auto text-zinc-500 dark:text-zinc-200"
                    aria-hidden="true"
                  />
                )}
              </span>

              <CardTitle className="text-xl font-semibold tracking-tight leading-tight truncate">
                {headStore.GROUP_CHAIN}
                {headStore.GROUP_CHAIN && headStore.NAME && (
                  <span className="mx-2 text-zinc-400">·</span>
                )}
                {headStore.NAME}
              </CardTitle>
            </div>

            <span
              className="
        text-xs uppercase tracking-[0.16em] text-zinc-400 whitespace-nowrap
        pl-[52px] sm:pl-0
      "
            >
              ΑΦΜ {headStore.AFM}
            </span>
          </div>
        </CardHeader>

      )}

      {stores.map((item) => (
        <div
          key={item.KEY_CODE ?? item.BRANCH}
          onClick={() => handleBranchChange(item)}
          className="cursor-pointer"
        >
          <StoreCard data={item} isPending={isPending} />
        </div>
      ))}
    </>
  );
}
