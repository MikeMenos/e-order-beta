"use client"

import { CartTotals } from "@/components/cart-totals";
import { OrderSummary } from "@/components/order-summary";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useGetCart } from "@/hooks/useGetCart";
import { AddToCartPayload, IProductInCart } from "@/lib/interfaces";
import { appStore } from "@/stores/appStore";

export default function Cart() {
    const { clientData, branchNumber } = appStore();

    const currentBranch = clientData?.data.find(
        (item) => item.BRANCH === branchNumber
    );
    const { data, isLoading } = useGetCart({
        trdr: currentBranch?.TRDR,
        branch: branchNumber,
    });

    const { mutate: addToCartMutation } = useAddToCart();

    const handleAddToOrder = (product: IProductInCart, qty: number) => {

        const existingLines =
            data?.data?.map((line: IProductInCart) => ({
                MTRL: Number(line.MTRL),
                QTY2: Number(line.Qty2),
            })) ?? [];

        const newLineMTRL = Number(product.MTRL);

        const lineExists = existingLines.find(l => l.MTRL === newLineMTRL);

        let updatedLines;

        if (lineExists) {
            updatedLines = existingLines.map(l =>
                l.MTRL === newLineMTRL
                    ? { ...l, QTY2: l.QTY2 + ((l.QTY2 - qty) < 0 ? Math.abs(l.QTY2 - qty) : -(l.QTY2 - qty)) }
                    : l
            );
        } else {
            updatedLines = [
                ...existingLines,
                { MTRL: newLineMTRL, QTY2: qty }
            ];
        }

        const payload: AddToCartPayload = {
            service: "setData",
            clientID: process.env.NEXT_PUBLIC_CLIENT_ID!,
            appId: process.env.NEXT_PUBLIC_APP_ID!,
            OBJECT: "SALDOC",
            KEY: '',

            data: {
                SALDOC: [
                    {
                        SERIES: "7024",
                        TRDR: Number(currentBranch?.TRDR),
                        TRDBRANCH: Number(branchNumber),
                        PAYMENT: 1006,
                        TRUCKS: 2,
                        DELIVDATE: "",
                        COMMENTS: "",
                        REMARKS: "",
                    },
                ],
                MTRDOC: [
                    {
                        TRUCKS: 2,
                        DELIVDATE: "",
                    },
                ],

                ITELINES: updatedLines,
            },
        };

        addToCartMutation(payload, {
            onSettled: () => {

            },
        });
    };

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="flex flex-col gap-6 md:flex-row">
            <OrderSummary items={data} />

            <div className="md:basis-1/3">
                <CartTotals items={data?.data} />
            </div>
        </div>

    );
}
