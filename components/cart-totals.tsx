import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IProductItem, IStoreInfo } from "@/lib/interfaces";
import { ShoppingCart } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";

const PROGRAMMATISMOS_MAP: Record<string, number> = {
  ΚΥΡ: 0,
  ΔΕΥ: 1,
  ΤΡΙ: 2,
  ΤΕΤ: 3,
  ΠΕΜ: 4,
  ΠΑΡ: 5,
  ΣΑΒ: 6,
};

function parseProgrammatismos(s: string): {
  allowed: Set<number>;
  label: string;
} {
  const allowed = new Set<number>();
  const parts = s
    .split("-")
    .map((p) => p.trim())
    .filter(Boolean);
  for (const p of parts) {
    const n = PROGRAMMATISMOS_MAP[p];
    if (n !== undefined) allowed.add(n);
  }
  return { allowed, label: parts.join(", ") };
}

interface CartTotalsProps {
  items?: IProductItem[];
  onSendOrder?: (meta: { comments: string; delivDate: string }) => void;
  comments: string;
  setComments: (comments: string) => void;
  delivDate: string;
  isPending: boolean;
  setDelivDate: (date: string) => void;
  currentBranch?: IStoreInfo | null;
}

export function CartTotals({
  items,
  onSendOrder,
  comments,
  setComments,
  delivDate,
  setDelivDate,
  isPending,
  currentBranch,
}: CartTotalsProps) {
  const programmatismos = useMemo(() => {
    if (
      currentBranch?.GROUP_CHAIN !== "L'ARTIGIANO" ||
      !currentBranch?.PROGRAMMATISMOS
    )
      return null;
    return parseProgrammatismos(currentBranch.PROGRAMMATISMOS);
  }, [currentBranch]);

  const disabledMatchers = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const matchers: Array<{ before: Date } | { dayOfWeek: number[] }> = [
      { before: today },
    ];
    if (programmatismos) {
      const disabledWeekdays = [0, 1, 2, 3, 4, 5, 6].filter(
        (d) => !programmatismos.allowed.has(d),
      );
      if (disabledWeekdays.length > 0) {
        matchers.push({ dayOfWeek: disabledWeekdays });
      }
    }
    return matchers;
  }, [programmatismos]);

  const selectedDate = useMemo(() => {
    if (!delivDate) return undefined;
    const d = new Date(delivDate + "T12:00:00");
    return Number.isNaN(d.getTime()) ? undefined : d;
  }, [delivDate]);

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) {
      setDelivDate("");
      return;
    }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    setDelivDate(`${y}-${m}-${d}`);
  };

  const handleSendOrderClick = () => {
    if (onSendOrder && items) {
      onSendOrder({
        comments,
        delivDate,
      });
    }
  };

  return (
    <div className="basis-2/3">
      <Card className="border border-slate-200/80 shadow-none rounded-2xl bg-slate-50">
        <CardContent className="pb-4 pt-4 space-y-4 text-sm p-0">
          <div className="px-3 space-y-1">
            <Label className=" text-slate-500">
              Επιλογή: Ημερομηνία Παράδοσης
            </Label>
            {programmatismos && (
              <p className=" text-slate-500">
                Διαθέσιμες ημέρες:{" "}
                <span className="font-bold">{programmatismos.label}</span>
              </p>
            )}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              disabled={disabledMatchers}
              className="rounded-xl border border-slate-200 bg-white"
            />
          </div>

          <div className="px-3 space-y-1">
            <Label className="text-xs text-slate-500">Σχόλια Παραγγελίας</Label>
            <Textarea
              className="bg-white"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>

          <div className="pt-4 p-4">
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleSendOrderClick}
              disabled={items?.length === 0 || !delivDate || isPending}
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
