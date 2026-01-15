"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  cartCount?: number;
}

export function CartButton({ cartCount }: CartButtonProps) {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/cart" aria-label="Καλάθι" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {(cartCount ?? 0) > 0 && (
          <div className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
            {cartCount}
          </div>
        )}
      </Link>
    </Button>
  );
}
