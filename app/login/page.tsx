"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetClientData } from "@/hooks/useGetClientData";
import { useVerifyPin } from "@/hooks/useVerifyPin";
import { errorToast } from "@/components/toasts";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { appStore } from "@/stores/appStore";

export default function Login() {
  const router = useRouter();
  const { vat, setVat } = appStore();

  const [backendPin, setBackendPin] = useState<string | null>(null);

  const pinRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [enteredPin, setEnteredPin] = useState(Array(6).fill(""));

  const { mutate: clientDataMutation, isPending } = useGetClientData();
  const pinMutation = useVerifyPin();

  useEffect(() => {
    if (!backendPin) return;

    setTimeout(() => {
      pinRefs.current[0]?.focus();
    }, 0);
  }, [backendPin]);

  const handlePinChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      e.target.value = "";
      return;
    }

    const digit = raw.slice(-1);
    e.target.value = digit;

    const updated = [...enteredPin];
    updated[index] = digit;
    setEnteredPin(updated);

    if (index < 5) {
      pinRefs.current[index + 1]?.focus();
      pinRefs.current[index + 1]?.select();
    }

    if (updated.every((d) => d !== "")) {
      onSubmitPin(updated.join(""));
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (enteredPin[index]) {
        const updated = [...enteredPin];
        updated[index] = "";
        setEnteredPin(updated);
        return;
      }
      if (index > 0) {
        e.preventDefault();
        pinRefs.current[index - 1]?.focus();
        pinRefs.current[index - 1]?.select();
      }
    }
  };

  const onSubmitVat = () => {
    if (!vat) return;

    clientDataMutation(vat, {
      onSuccess: (data) => {
        setBackendPin(data.data[0].PIN_A);
      },
      onError: () => {
        errorToast("Δε βρέθηκαν στοιχεία για το συγκεκριμένο ΑΦΜ");
      },
    });
  };

  const onSubmitPin = (pin: string) => {
    if (pin !== backendPin) {
      errorToast("Λάθος PIN");
      return;
    }

    pinMutation.mutate(pin, {
      onSuccess: () => router.push("/"),
      onError: () => errorToast("Αποτυχία σύνδεσης"),
    });
  };

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Καλωσορίσατε στην εφαρμογή</CardTitle>
          <CardDescription>
            Εισάγετε τα στοιχεία σας για να συνδεθείτε
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            {!backendPin && (
              <div className="grid gap-2">
                <Label htmlFor="AFM">ΑΦΜ</Label>
                <Input
                  id="AFM"
                  value={vat}
                  onChange={(e) => setVat(e.target.value)}
                  placeholder="Πληκτρολογήστε το ΑΦΜ σας"
                  required
                />
              </div>
            )}

            {backendPin && (
              <div className="grid gap-2">
                <Label>6-ψήφιο PIN</Label>
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Input
                      key={i}
                      ref={(el) => {
                        pinRefs.current[i] = el;
                      }}
                      maxLength={1}
                      inputMode="numeric"
                      className="h-12 w-12 text-center text-xl font-semibold"
                      onChange={(e) => handlePinChange(i, e)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          {!backendPin ? (
            <Button
              className="w-full"
              onClick={onSubmitVat}
              disabled={isPending || !vat}
            >
              {isPending ? "Παρακαλώ περιμένετε..." : "Συνέχεια"}
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => onSubmitPin(enteredPin.join(""))}
              disabled={pinMutation.isPending}
            >
              {pinMutation.isPending
                ? "Γίνεται επαλήθευση..."
                : "Επιβεβαίωση PIN"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
