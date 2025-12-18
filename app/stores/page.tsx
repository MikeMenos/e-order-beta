"use client";

import StoreCard from "@/components/store-card";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetClientData } from "@/hooks/useGetClientData";
import { IStoreInfo } from "@/lib/interfaces";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { appStore } from "@/stores/appStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      {data?.data.map((item) => (
        <p
          key={item.BRANCH}
          onClick={() => handleBranchChange(item)}
          className="cursor-pointer"
        >
          <StoreCard data={item} isPending={isPending} />
        </p>
      ))}
    </>
  );
}
