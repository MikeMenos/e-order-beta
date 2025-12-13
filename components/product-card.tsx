"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";
import { usePathname } from "next/navigation";
import { IProductItem } from "@/lib/interfaces";
import { Input } from "./ui/input";

export const placeholderImage =
  "https://images.pexels.com/photos/2955820/pexels-photo-2955820.jpeg";

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

  const IMAGE_BASE_URL = "https://ergastiri.oncloud.gr/s1services?filename=";
  const imageUrl = product.IMAGE
    ? `${IMAGE_BASE_URL}${product.IMAGE}`
    : placeholderImage;

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

  return (
    <Card className="border border-slate-200/80 shadow-none rounded-2xl p-0 w-full max-w-4xl mx-auto mb-2">
      <CardContent className="sm:p-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
          <div className="h-24 w-h-24 sm:h-24 sm:w-24 rounded-xl bg-slate-50 overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.TITLE}
              className="h-full w-full object-cover"
              width={800}
              height={800}
            />
          </div>

          <div className="flex-1 flex flex-col gap-2 text-sm p-0">
            <div className="flex flex-col space-y-1.5">
              <div className="font-medium text-[15px] sm:text-base">
                {product.TITLE || product.FULL_DESCRIPTION}
              </div>

              <div className="text-s text-slate-500">
                {product.DESCRIPTION || product.FULL_DESCRIPTION}
              </div>

              <div className="flex flex-row gap-1 text-[11px] sm:text-xs text-slate-600">
                <span className="inline-flex w-fit items-center rounded-full border border-slate-200 px-2 py-1">
                  Κωδικός:
                  <span className="ml-1 font-medium">{product.CODE}</span>
                </span>

                <span className="inline-flex w-fit items-center rounded-full border border-slate-200 px-2 py-1">
                  MTRL:
                  <span className="ml-1 font-medium">{product.MTRL}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-1 text-[11px] sm:text-xs text-slate-600 mt-1">
              <span className="inline-flex w-fit self-start items-center rounded-full border border-slate-200 px-2 py-1">
                {product.SXESI} τεμάχια / {product.ORDER_UNIT?.toLowerCase()}
              </span>

              <span className="inline-flex w-fit self-start items-center rounded-full border border-slate-200 px-2 py-1">
                Προμηθευτής:
                <span className="ml-1 font-medium">{product.SUPPLIER}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center justify-end gap-2">
                <div className="relative">
                  <Input
                    className="min-w-12 text-center text-sm font-medium tabular-nums"
                    value={qty}
                    type="number"
                    onChange={(e) => handleQtyChange(e.target.value, setQty)}
                    min={0}
                  />
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
