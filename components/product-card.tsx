"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IProductInCart } from "@/lib/interfaces";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const placeholderImage =
  "https://via.placeholder.com/300x200?text=No+Image";

interface ProductCardProps {
  product: IProductInCart;
  onAddToOrder?: (product: IProductInCart, qty: number) => void;
  isPending?: boolean;

  showRemoveButton?: boolean;
  onRemove?: (product: IProductInCart) => void;

  onCheck?: (product: IProductInCart, checked: boolean) => void;
  checked?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  onAddToOrder,
  isPending,
  showRemoveButton,
  onRemove,
  onCheck,
  checked = false,
}) => {
  const pathname = usePathname();
  const [qty, setQty] = useState<number>(Number(product.Qty2));

  useEffect(() => {
    setQty(Number(product.Qty2));
  }, [product.Qty2]);

  const handleDecrease = (currentQty: number) => {
    setQty(Math.max(currentQty - 1, 1));
  };

  const handleIncrease = (currentQty: number) => {
    setQty(Math.max(currentQty + 1, 1));
  };

  const handleAddToOrder = () => {
    if (onAddToOrder && qty) {
      onAddToOrder(product, qty);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(product);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheck) {
      onCheck(product, e.target.checked);
    }
  };

  const IMAGE_BASE_URL = "https://ergastiri.oncloud.gr/s1services?filename=";

  const imageUrl = product.IMAGE
    ? `${IMAGE_BASE_URL}${product.IMAGE}`
    : placeholderImage;

  return (
    <div className="flex items-start gap-3">

      {showRemoveButton && (
        <input
          type="checkbox"
          className="h-5 w-5 mt-4 cursor-pointer"
          checked={checked}
          onChange={handleCheckboxChange}
        />
      )}

      <Card className="border border-slate-200/80 shadow-none rounded-2xl bg-white w-full">
        <CardContent className="p-3 sm:p-3">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

            <div className="shrink-0">
              <div className="sm:mt-0 h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-slate-50 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={product.TITLE}
                  className="h-full w-full object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 text-sm">

              <div className="space-y-1.5">
                <div className="font-medium text-[15px] sm:text-base">
                  {product.TITLE || product.FULL_DESCRIPTION}
                </div>

                <div className="text-s text-slate-500">
                  {product.DESCRIPTION || product.FULL_DESCRIPTION}
                </div>

                <div className="flex gap-1">
                  <span className="font-medium text-slate-600">Κωδικός:</span>
                  <span className="tabular-nums">{product.CODE}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[11px] sm:text-xs text-slate-600">
                <span className="inline-flex w-fit items-center rounded-full border border-slate-200 px-2 py-1">
                  {product.SXESI} τεμάχια / {product.ORDER_UNIT?.toLowerCase()}
                </span>

                <span className="inline-flex w-fit items-center rounded-full border border-slate-200 px-2 py-1">
                  Προμηθευτής:
                  <span className="ml-1 font-medium">{product.SUPPLIER}</span>
                </span>

                <span className="inline-flex w-fit items-center rounded-full border border-slate-200 px-2 py-1">
                  MTRL:
                  <span className="ml-1 font-medium">{product.MTRL}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end min-w-[130px] sm:min-w-[150px]">
              <div className="flex flex-col items-end gap-3">

                <div className="flex items-center justify-end gap-2">

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleDecrease(qty)}
                      disabled={qty <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <div className="min-w-12 text-center text-sm font-medium tabular-nums">
                      {qty ?? product.Qty2}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleIncrease(qty)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {pathname !== '/cart' && (
                    <Button
                      size="sm"
                      className="whitespace-nowrap gap-1 cursor-pointer"
                      onClick={handleAddToOrder}
                      disabled={isPending}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  )}

                  {showRemoveButton && (
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

    </div>
  );

};

export default ProductCard;
