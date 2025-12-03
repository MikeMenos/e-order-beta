"use client";

import StoreCard from "@/components/store-card";
import { appStore } from "@/stores/appStore";
import Link from "next/link";
import { useEffect } from "react";

export default function Stores() {
  const { clientData, hydrated, setHydrated, setBranchNumber, setBasketId } = appStore();

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  if (!hydrated) return null;

  return (
    <>
      {clientData?.data.map((item) => (
        <Link key={item.BRANCH} href={'/'} onClick={() => {
          setBranchNumber(item.BRANCH)
          setBasketId(item.BASKET_KEY ?? '')
        }}>
          <StoreCard data={item} />
        </Link>
      ))}
    </>
  );
}
