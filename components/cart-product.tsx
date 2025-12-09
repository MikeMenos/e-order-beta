import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";
import { IProductInCart } from "@/lib/interfaces";
import { placeholderImage } from "./product-card";

interface ICartProductProps {
    item: IProductInCart;
}

export function CardProduct({ item }: ICartProductProps) {
    const qty = Number(item?.Qty1) || 0;
    const IMAGE_BASE_URL =
        "https://ergastiri.oncloud.gr/s1services?filename=";

    return (
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="sm:px-3 sm:py-3">
                <div className="flex items-center gap-4 sm:gap-3">

                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-50">
                        <Image
                            src={item?.IMAGE ? `${IMAGE_BASE_URL}${item.IMAGE}` : placeholderImage}
                            alt={item?.TITLE}
                            fill
                            className="object-contain p-2"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold leading-snug truncate">
                            {item?.TITLE}
                        </h3>

                        <p className="mt-1 text-xs sm:text-[13px] text-slate-500">
                            Κωδ. Προϊόντος: <span className="font-mono">{item?.CODE}</span>
                        </p>

                        <p className="mt-1 text-xs sm:text-[13px] text-slate-500">
                            {item?.SXESI} τεμάχια / {item?.ORDER_UNIT?.toLowerCase()}
                        </p>

                        <p className="mt-1 text-xs sm:text-[13px] text-slate-500">
                            Κατηγορία: {item?.FAMILY}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 sm:gap-3 shrink-0">

                        <div className="flex items-center gap-3">

                            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-slate-700">
                                <Button
                                    variant="outline"

                                    type="button"
                                    className="text-slate-400 disabled:opacity-40"
                                    disabled={qty <= 1}
                                >
                                    –
                                </Button>

                                <input
                                    type="number"
                                    value={qty}
                                    readOnly
                                    className="h-6 w-10 border-0 bg-transparent text-center text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 appearance-none"
                                />

                                <Button
                                    variant="outline"
                                    type="button"
                                    className=" text-slate-400"
                                >
                                    +
                                </Button>
                            </div>

                        </div>

                        <div className="flex items-center justify-end gap-2 text-slate-400">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:text-slate-700"
                            >
                                <Heart className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:text-red-500"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

