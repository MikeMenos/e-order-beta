"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { FC, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { IProductItem } from "@/lib/interfaces";
import { Input } from "./ui/input";

export const placeholderImage: Record<string, string> = {
  DONUT: "/categories/donuts.jpg",
  ΑΡΤΟΠΟΙΗΜΑΤΑ: "/categories/artos.jpg",
  ΣΦΟΛΙΑΤΑ: "/categories/sfol.jpg",
  ΑΛΛΟ: "/categories/allo.jpg",
};

interface ProductCardProps {
  product: IProductItem;
  onSubmitProducts?: (
    product: IProductItem,
    qty: number,
    isDelete?: boolean
  ) => void;
  onQtyChange?: (product: IProductItem, qty: number) => void;
  isPending?: boolean;
  onRemove?: (product: IProductItem) => void;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  onSubmitProducts,
  isPending,
  onQtyChange,
}) => {
  const pathname = usePathname();
  const [qty, setQty] = useState<number | "">(product.Qty2);
  const [error, setError] = useState("");
  const prevQty2Ref = useRef(product.Qty2);

  // Sync local qty state with product.Qty2 when it changes
  // This is necessary because when productsWithQty updates (e.g., after useGetProductsPerFamily call),
  // the product.Qty2 prop changes but the local state doesn't automatically update
  // We need to sync state from props here because the same product (same CODE) can have different Qty2 values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (product.Qty2 !== prevQty2Ref.current) {
      prevQty2Ref.current = product.Qty2;
      setQty(product.Qty2);
    }
  }, [product.Qty2]);

  const IMAGE_BASE_URL = "https://ergastiri.oncloud.gr/s1services?filename=";

  const categoryKey = product.FAMILY?.trim().toUpperCase();
  const imageUrl = product.IMAGE?.trim()
    ? `${IMAGE_BASE_URL}${product.IMAGE.trim()}`
    : placeholderImage[categoryKey] ?? "/categories/allo.jpg";

  const onAddProductToBasket = () => {
    if (typeof qty === "number" && qty <= 0) {
      setError("Η ποσότητα δεν μπορεί να είναι μηδέν ή μικρότερη από μηδέν");
      return;
    }
    if (onSubmitProducts && qty) {
      onSubmitProducts(product, qty);
    }
  };

  const handleRemove = () => {
    if (onSubmitProducts && qty) {
      onSubmitProducts(product, qty, true);
    }
  };

  const handleQtyChange = (value: string, setter: (v: number | "") => void) => {
    setError("");

    const numberValue = value === "" ? "" : Number(value);
    setter(numberValue);

    if (
      pathname === "/cart" &&
      onQtyChange &&
      typeof numberValue === "number"
    ) {
      onQtyChange(product, numberValue);
    }
  };

  const incrementQty = () => {
    const next = Number(qty || 0) + 1;
    handleQtyChange(String(next), setQty);
  };

  const decrementQty = () => {
    const next = Math.max(0, Number(qty || 0) - 1);
    handleQtyChange(String(next), setQty);
  };

  return (
    <Card className="border border-slate-200/80 shadow-none rounded-2xl p-0 w-full max-w-4xl mx-auto mb-2">
      <CardContent>
        <div className="flex-1 md:hidden justify-center items-center flex flex-col text-sm p-0 mb-2">
          <div className="font-medium text-[15px] sm:text-base">
            {product.TITLE || product.FULL_DESCRIPTION}
          </div>

          <div className="text-s text-slate-500">
            {product.DESCRIPTION || product.FULL_DESCRIPTION}
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4 items-center justify-between">
          <div className="h-12 w-h-12 sm:h-24 sm:w-24 rounded-xl bg-slate-50 overflow-hidden">
            <img
              src={imageUrl}
              alt={product.TITLE}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 md:flex flex-col gap-2 text-sm p-0 hidden">
            <div className="font-medium text-[15px] sm:text-base">
              {product.TITLE || product.FULL_DESCRIPTION}
            </div>

            <div className="text-s text-slate-500">
              {product.DESCRIPTION || product.FULL_DESCRIPTION}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center justify-end gap-2">
                <div className="relative">
                  <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-white">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={decrementQty}
                      className="px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                      disabled={isPending || Number(qty || 0) <= 0}
                      aria-label="Decrease quantity"
                    >
                      −
                    </Button>

                    <Input
                      className="w-12 min-w-12 text-center border-0 focus-visible:ring-0 text-sm font-medium tabular-nums"
                      value={qty}
                      type="number"
                      onChange={(e) => handleQtyChange(e.target.value, setQty)}
                      min={0}
                    />

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={incrementQty}
                      className="px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                      disabled={isPending}
                      aria-label="Increase quantity"
                    >
                      +
                    </Button>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 w-44 text-center mx-auto absolute top-10">
                      {error}
                    </p>
                  )}
                </div>
                {pathname !== "/cart" && (
                  <Button
                    size="sm"
                    className="whitespace-nowrap gap-1 cursor-pointer"
                    onClick={onAddProductToBasket}
                    disabled={isPending || product.Qty2 === qty || !qty}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                )}

                {pathname === "/cart" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={handleRemove}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
