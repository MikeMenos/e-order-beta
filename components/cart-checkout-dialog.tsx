"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Heading from "@/components/layout/heading";
import { ArrowRight, X } from "lucide-react";

interface CartCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  headingTitle?: string;
  showVatPricing?: boolean;
  sumAmnt?: string;
  isPricingLoading?: boolean;
}

export function CartCheckoutDialog({
  open,
  onOpenChange,
  children,
  headingTitle = "Λεπτομέρειες Παραγγελίας",
  showVatPricing,
  sumAmnt,
  isPricingLoading,
}: CartCheckoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur border-t md:flex md:justify-center bottom-16 md:bottom-0">
        <DialogTrigger asChild>
          <Button className="w-full md:max-w-sm md:min-w-[280px] h-12 text-base">
            Λεπτομέρειες και Ολοκλήρωση Παραγγελίας{" "}
            <ArrowRight className="size-4" />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="w-11/12">
        <Heading
          title={headingTitle}
          showVatPricing={showVatPricing}
          sumAmnt={sumAmnt}
          isPricingLoading={isPricingLoading}
        />
        <DialogClose asChild className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" aria-label="Κλείσιμο">
            <X className="size-5" />
          </Button>
        </DialogClose>
        {children}
      </DialogContent>
    </Dialog>
  );
}
