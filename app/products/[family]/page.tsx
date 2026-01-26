"use client";

import ProductCard from "@/components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetCart } from "@/hooks/useGetCart";
import { useGetClientData } from "@/hooks/useGetClientData";
import { useGetProductsPerFamily } from "@/hooks/useGetProductsPerFamily";
import { useHandleOnSubmitProducts } from "@/hooks/useHandleOnSubmitProducts";
import { IProductItem } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function FamilyProducts() {
  const {
    setHydrated,
    hydrated,
    currentBranch,
    vat,
    setCurrentBranch,
    setBasketId,
  } = appStore();
  const pathname = usePathname();
  const family = decodeURIComponent(pathname.split("/")[2] || "").trim();

  const isSpecialAfm = vat === "999999999" || vat === "987654321";
  const { data: clientData, mutate } = useGetClientData(isSpecialAfm);

  const { trdr, branch } = useMemo(() => {
    if (currentBranch?.TRDR && currentBranch?.BRANCH) {
      return {
        trdr: String(currentBranch.TRDR),
        branch: String(currentBranch.BRANCH),
      };
    }
    if (clientData?.count === 1 && clientData?.data[0]) {
      const firstBranch = clientData.data[0];
      return {
        trdr: firstBranch.TRDR ? String(firstBranch.TRDR) : undefined,
        branch: firstBranch.BRANCH ? String(firstBranch.BRANCH) : undefined,
      };
    }
    return { trdr: undefined, branch: undefined };
  }, [currentBranch, clientData]);

  const { data, isLoading } = useGetProductsPerFamily({
    family,
    trdr,
    branch,
  });

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  useEffect(() => {
    if (
      !clientData ||
      clientData.count !== 1 ||
      clientData.data[0]?.GROUP_CHAIN !== "L'ARTIGIANO"
    )
      return;
    const b = clientData.data[0];
    setCurrentBranch(b);
    if (b.BASKET_KEY && b.BASKET_KEY !== "0") {
      setBasketId(b.BASKET_KEY);
    }
  }, [clientData, setCurrentBranch, setBasketId]);

  const { data: cartData } = useGetCart({ trdr, branch });

  const { onSubmitProducts, pendingProductId } = useHandleOnSubmitProducts();

  const productsWithQty = useMemo((): IProductItem[] | undefined => {
    return data?.map((product) => {
      const productId = Number(product.ITEMUID);

      const matchingCartLine = cartData?.data?.find(
        (line: IProductItem) => Number(line.MTRL) === productId,
      );

      return {
        ...product,
        Qty2: matchingCartLine ? Number(matchingCartLine.Qty2) : 0,
      };
    });
  }, [data, cartData]);

  const [filter, setFilter] = useState("");

  const filteredProducts = useMemo(() => {
    if (!productsWithQty) return undefined;
    const q = filter.trim().toLowerCase();
    if (!q) return productsWithQty;
    return productsWithQty.filter((p) =>
      (p.TITLE ?? "").toLowerCase().includes(q),
    );
  }, [productsWithQty, filter]);

  if (!hydrated) return null;

  if (clientData && clientData?.count > 1 && !currentBranch?.BRANCH)
    redirect("/stores");

  if (isLoading) return <Loading />;

  const favProducts = filteredProducts?.filter((p) => p.FAV === "FAV");
  const regProducts = filteredProducts?.filter((p) => p.FAV === "REG");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center mb-1">
        <Input
          placeholder="Αναζήτηση…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="sm:max-w-xs"
        />
      </div>

      <Card className="shadow-none rounded-2xl">
        <CardContent className="p-0 lg:p-3 space-y-6 text-sm">
          {favProducts && favProducts.length > 0 && (
            <section>
              <div className="relative mb-3">
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  Αγαπημενα Προϊοντα
                </span>
              </div>

              <div className="space-y-3">
                {favProducts.map((item) => (
                  <ProductCard
                    product={item}
                    key={item.CODE}
                    onSubmitProducts={onSubmitProducts}
                    isPending={pendingProductId === item.ITEMUID}
                    showWholesalePrice={vat === "999999999"}
                  />
                ))}
              </div>
            </section>
          )}

          {regProducts && regProducts.length > 0 && (
            <section>
              <div className="mb-3">
                <span className="inline-flex items-center rounded-full bg-black px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  Αλλα Προϊοντα
                </span>
              </div>

              <div className="space-y-3">
                {regProducts.map((item) => (
                  <ProductCard
                    product={item}
                    key={item.CODE}
                    onSubmitProducts={onSubmitProducts}
                    isPending={pendingProductId === item.ITEMUID}
                    showWholesalePrice={vat === "999999999"}
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
