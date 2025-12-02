"use client"

import { CartTotals } from "@/components/cart-totals";
import { OrderSummary } from "@/components/order-summary";
import { useGetCart } from "@/hooks/useGetCart";
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

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="flex gap-6">
            <OrderSummary items={data} />

            <div className="basis-1/3">
                <CartTotals items={data?.data} />
            </div>
        </div>
    );
}
