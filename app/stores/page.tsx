"use client";

import StoreCard from "@/components/store-card";
import { useAddToCart } from "@/hooks/useAddToCart";
import { AddToCartPayload, IStoreInfo } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Stores() {
  const { clientData, hydrated, setHydrated, setBranchNumber, setBasketId, basketId } = appStore();
  const router = useRouter();

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  const { mutate: addToCartMutation } = useAddToCart();

  if (!hydrated) return null;

  const handleBranchChange = (branch: IStoreInfo) => {
    if (branch?.BASKET_KEY === '0') {
      const payload: AddToCartPayload = {
        service: "setData",
        clientID: process.env.NEXT_PUBLIC_CLIENT_ID!,
        appId: process.env.NEXT_PUBLIC_APP_ID!,
        OBJECT: "SALDOC",
        KEY: "",
        data: {
          SALDOC: [
            {
              SERIES: "7001",
              TRDR: Number(branch?.TRDR),
              TRDBRANCH: Number(branch.BRANCH),
              PAYMENT: 1006,
              TRUCKS: 2,
              DELIVDATE: '',
              COMMENTS: '',
              REMARKS: "",
            },
          ],
          MTRDOC: [
            {
              TRUCKS: 2,
              DELIVDATE: '',
            },
          ],

          ITELINES: [{
            "LINENUM": 9000001,
            "MTRL": 2924,
            "QTY2": 0.1
          }],
        },
      };

      addToCartMutation(payload, {
        onSuccess: (data) => {
          setBasketId(data.id!)
          router.push('/')
        },
      });

    } else {
      setBasketId(branch?.BASKET_KEY!);
      router.push('/')
    }
    setBranchNumber(branch.BRANCH);
  }

  return (
    <>
      {clientData?.data.map((item) => (
        <p key={item.BRANCH} onClick={() => handleBranchChange(item)}>
          <StoreCard data={item} />
        </p>
      ))}
    </>
  );
}
