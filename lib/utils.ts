import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IProductItem } from "@/lib/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ExistingLine = {
  LINENUM: number;
  MTRL: number;
  QTY2: number;
};

export function buildUpdatedLines(params: {
  cartLines?: IProductItem[];
  product: IProductItem;
  qty: number;
  isDelete?: boolean;
  baseLineNum?: number;
}): ExistingLine[] {
  const { cartLines, product, qty, isDelete, baseLineNum = 9000001 } = params;

  const existingLines: ExistingLine[] =
    cartLines?.map((line, index) => ({
      LINENUM: baseLineNum + index,
      MTRL: Number(line.MTRL),
      QTY2: Number(line.Qty2),
    })) ?? [];

  const clickedMtrl = Number(product.ITEMUID || product.MTRL);

  if (isDelete) {
    return existingLines.filter((l) => l.MTRL !== clickedMtrl);
  }

  const exists = existingLines.some((l) => l.MTRL === clickedMtrl);

  if (exists) {
    return existingLines.map((l) =>
      l.MTRL === clickedMtrl ? { ...l, QTY2: qty } : l
    );
  } else {
    return [
      ...existingLines,
      {
        MTRL: clickedMtrl,
        QTY2: qty,
        LINENUM: baseLineNum + existingLines.length,
      },
    ];
  }

  return [
    ...existingLines,
    {
      MTRL: clickedMtrl,
      QTY2: qty,
      LINENUM: baseLineNum + existingLines.length,
    },
  ];
}
