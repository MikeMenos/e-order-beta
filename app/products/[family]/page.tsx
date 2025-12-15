"use client";

import ProductCard from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCart } from "@/hooks/useGetCart";
import { useGetProductsPerFamily } from "@/hooks/useGetProductsPerFamily";
import { useHandleOnSubmitProducts } from "@/hooks/useHandleOnSubmitProducts";
import { IProductItem } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function FamilyProducts() {
  const { clientData, setHydrated, hydrated, branchNumber, basketId } = appStore();
  const pathname = usePathname();
  const family = decodeURIComponent(pathname.split("/")[2] || "").trim();
  const trdr = clientData?.data[0].TRDR as string;
  const branch = clientData?.data[0].BRANCH as string;
  const currentBranch = clientData?.data.find(
    (item) => item.BRANCH === branchNumber
  );

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  const { data, isLoading } = useGetProductsPerFamily({ family, trdr, branch });

  const { data: cartData } = useGetCart({
    trdr: currentBranch?.TRDR,
    branch: branchNumber,
  });

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
  if (clientData && clientData?.count > 1 && !branchNumber) redirect("/stores");

  if (isLoading) return <div>Loading...</div>;

  const favProducts = productsWithQty?.filter((p) => p.FAV === "FAV");
  const regProducts = productsWithQty?.filter((p) => p.FAV === "REG");

  return (
    <div>
      <CardHeader className="border-b border-slate-200 mb-4">
        <CardTitle className="text-base sm:text-lg">
          {data?.[0]?.FAMILY ?? "Προϊόντα"}
        </CardTitle>
      </CardHeader>
      <Card className="shadow-none rounded-2xl">
        <CardContent className="p-0 lg:p-3 space-y-6 text-sm">
          {favProducts && favProducts.length > 0 && (
            <section>
              <div className="border-b border-slate-200 pb-2 mb-3">
                <span className="text-lg font-semibold">
                  Αγαπημένα Προϊόντα
                </span>
              </div>

              {favProducts &&
                favProducts?.length > 0 &&
                regProducts &&
                regProducts?.length > 0 && <hr className="my-4" />}

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

          {favProducts &&
            favProducts?.length > 0 &&
            regProducts &&
            regProducts?.length > 0 && <hr className="my-2" />}

          {regProducts && regProducts.length > 0 && (
            <section>
              <div className="border-b border-slate-200 pb-2 mb-3">
                <span className="text-lg font-semibold">Άλλα Προϊόντα</span>
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
