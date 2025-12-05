import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { IProductInCart } from "@/lib/interfaces";
import { ShoppingCart } from "lucide-react";

interface CartTotalsProps {
    items?: IProductInCart[];
    onSendOrder?: (payload: {
        items: IProductInCart[];
        comments: string;
        delivDate: string;
        remarks: string;
    }) => void;
}

export function CartTotals({ items, onSendOrder }: CartTotalsProps) {
    const totals = React.useMemo(() => {
        const totalQty = items?.reduce((acc, item) => {
            const qty = Number(item.Qty1) || 0;
            return acc + qty;
        }, 0);

        const totalAmount = items?.reduce((acc, item) => {
            const qty = Number(item.Qty1) || 0;
            const price = Number(item.PRICE_PER_MU1) || 0;
            return acc + qty * price;
        }, 0);

        return { totalQty, totalAmount };
    }, [items]);

    const [comments, setComments] = React.useState(
        "ΠΑΡΑΓΓΕΛΙΑ ΑΠΟ E-ORDER APP IP:xxx MODEL:XXXX GPS:XXX-YYY"
    );
    const [delivDate, setDelivDate] = React.useState("");
    const [remarks, setRemarks] = React.useState("JSON COPY FOR MONITORING");

    const handleSendOrder = () => {
        // const payload = {
        //     items,
        //     comments,
        //     delivDate,
        //     remarks,
        // };

        // if (onSendOrder && payload?.items) {
        //     onSendOrder(payload);
        // } else {
        //     console.log("Send order payload:", payload);
        // }
    };

    return (
        <div className="basis-2/3">
            <Card className="border border-slate-200/80 shadow-none rounded-2xl bg-slate-50">
                <CardHeader className="border-b border-slate-200">
                    <CardTitle className="text-base sm:text-lg">
                        Σύνολο Παραγγελίας
                    </CardTitle>
                </CardHeader>

                <CardContent className="pb-4 space-y-4 text-sm p-0">
                    <div className="px-5 flex items-center justify-between pt-3">
                        <span className="text-slate-500">Σύνολο τεμαχίων</span>
                        <span className="font-semibold">{totals.totalQty}</span>
                    </div>

                    <div className="px-5 space-y-1">
                        <label className="text-xs font-medium text-slate-500">
                            Σχόλια Παραγγελίας
                        </label>
                        <Textarea className="bg-white"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="px-5 space-y-1">
                        <label className="text-xs font-medium text-slate-500">
                            Επιλογή: Ημερομηνία Παράδοσης
                        </label>
                        <Input className="bg-white"
                            type="date"
                            value={delivDate}
                            onChange={(e) => setDelivDate(e.target.value)}
                        />
                    </div>

                    <div className="px-5 space-y-1">
                        <label className="text-xs font-medium text-slate-500">
                            Παρατηρήσεις
                        </label>
                        <Input className="bg-white"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 p-4">
                        <Button
                            className="w-full gap-2"
                            size="lg"
                            onClick={handleSendOrder}
                            disabled={items?.length === 0}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Αποστολή Παραγγελίας
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
