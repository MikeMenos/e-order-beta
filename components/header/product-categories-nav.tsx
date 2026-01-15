"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IFamilyCategories } from "@/lib/interfaces";

interface ProductCategoriesNavProps {
  families: IFamilyCategories[] | undefined;
  shouldShow: boolean;
}

export function ProductCategoriesNav({
  families,
  shouldShow,
}: ProductCategoriesNavProps) {
  const pathname = usePathname();

  if (!shouldShow || !families) return null;

  return (
    <nav className="ml-4 flex items-center gap-1 md:gap-2">
      {families.map((family) => {
        const href = `/products/${encodeURIComponent(family.FAMILY)}`;
        const isActive = pathname === href;

        return (
          <Button
            key={family.FAMILY}
            asChild
            variant="ghost"
            size="sm"
            className={`whitespace-nowrap text-xs font-medium transition-colors duration-300 ${
              isActive
                ? "bg-primary font-bold text-white hover:bg-primary rounded-full sm:px-4 sm:py-1"
                : ""
            }`}
          >
            <Link href={href}>{family.FAMILY}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
