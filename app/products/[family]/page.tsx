"use client";

import ProductCard from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { useGetCart } from "@/hooks/useGetCart";
import { useGetClientData } from "@/hooks/useGetClientData";
import { useGetProductsPerFamily } from "@/hooks/useGetProductsPerFamily";
import { useHandleOnSubmitProducts } from "@/hooks/useHandleOnSubmitProducts";
import { IProductItem } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import Heading from "@/components/layout/heading";

export default function FamilyProducts() {
  const { setHydrated, hydrated, currentBranch, vat } = appStore();
  const pathname = usePathname();
  const family = decodeURIComponent(pathname.split("/")[2] || "").trim();

  const { data: clientData, mutate } = useGetClientData();

  const trdr = currentBranch?.TRDR ? String(currentBranch.TRDR) : undefined;
  const branch = currentBranch?.BRANCH
    ? String(currentBranch.BRANCH)
    : undefined;

  const { data, isLoading } = useGetProductsPerFamily({ family, trdr, branch });

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  const { data: cartData } = useGetCart({ trdr, branch });

  const { onSubmitProducts, pendingProductId } = useHandleOnSubmitProducts();

  const productsWithQty = useMemo((): IProductItem[] | undefined => {
    return data?.map((product) => {
      const productId = Number(product.ITEMUID);

      const matchingCartLine = cartData?.data?.find(
        (line: IProductItem) => Number(line.MTRL) === productId
      );

      return {
        ...product,
        Qty2: matchingCartLine ? Number(matchingCartLine.Qty2) : 0,
      };
    });
  }, [data, cartData]);

  if (!hydrated) return null;
  if (clientData && clientData?.count > 1 && !currentBranch?.BRANCH)
    redirect("/stores");

  if (isLoading) return <Loading />;

  const favProducts = productsWithQty?.filter((p) => p.FAV === "FAV");
  const regProducts = productsWithQty?.filter((p) => p.FAV === "REG");

  return (
    <div>
      <Heading
        title={data?.[0]?.FAMILY ?? "Προϊόντα"}
      />

      <Card className="shadow-none rounded-2xl">
        <CardContent className="p-0 lg:p-3 space-y-6 text-sm">
          {favProducts && favProducts.length > 0 && (
            <section>
              <div className="relative pb-2 mb-3">
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  Αγαπημένα Προϊόντα
                </span>
              </div>

              <div className="space-y-3">
                {favProducts.map((item) => (
                  <ProductCard
                    product={item}
                    key={item.CODE}
                    onSubmitProducts={onSubmitProducts}
                    isPending={pendingProductId === item.ITEMUID}
                  />
                ))}
              </div>
            </section>
          )}

          {regProducts && regProducts.length > 0 && (
            <section>
              <div className="pb-2 mb-3 mt-4">
                <span className="inline-flex items-center rounded-full bg-black px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  Άλλα Προϊόντα
                </span>
              </div>

              <div className="space-y-3">
                {regProducts.map((item) => (
                  <ProductCard
                    product={item}
                    key={item.CODE}
                    onSubmitProducts={onSubmitProducts}
                    isPending={pendingProductId === item.ITEMUID}
                  />
                ))}
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
