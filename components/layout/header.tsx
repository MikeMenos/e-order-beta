"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, LogOut, ChevronDown } from "lucide-react";
import { useGetCart } from "@/hooks/useGetCart";
import { appStore } from "@/stores/appStore";
import { useGetFamilies } from "@/hooks/useGetFamilies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildFirstBasketKeyPayload, cn } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useAddToCart";
import { api } from "@/lib/api";
import { IStoreInfo } from "@/lib/interfaces";

export default function Header() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const {
    clientData,
    branchNumber,
    setBranchNumber,
    hydrated,
    setHydrated,
    setBasketId,
    setClientData,
  } = appStore();

  const currentBranch = clientData?.data.find(
    (item) => item.BRANCH === branchNumber
  );

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  const { data: families } = useGetFamilies();
  const { data } = useGetCart({
    trdr: currentBranch?.TRDR,
    branch: branchNumber,
  });
  const { mutate: addToCartMutation, isPending } = useAddToCart();

  if (!hydrated) return null;
  if (pathname === "/login") return null;

  const handleBranchChange = (branch: IStoreInfo) => {
    setOpen(false);

    if (branch?.BASKET_KEY === "0") {
      const payload = buildFirstBasketKeyPayload({
        trdr: Number(branch.TRDR),
        branch: Number(branch.BRANCH),
      });

      addToCartMutation(payload, {
        onSuccess: (data) => {
          setBasketId(data.id!);
        },
      });
    } else {
      setBasketId(branch?.BASKET_KEY as string);
    }

    setBranchNumber(branch.BRANCH);
    router.push("/");
  };
  const handleLogout = async () => {
    setBranchNumber(undefined);
    setClientData(undefined);
    setBasketId(undefined);
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 shadow-[0_1px_4px_rgba(0,0,0,0.08)] dark:bg-black/80 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={32} height={32} />

          <span className="hidden sm:inline text-lg font-semibold">
            Ergastirion Manager
          </span>
        </Link>

        {pathname !== "/stores" && (
          <div className="flex-1 overflow-x-auto">
            <nav className="ml-4 flex items-center gap-1 md:gap-2">
              {families?.map((family) => (
                <Button
                  key={family.FAMILY}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="whitespace-nowrap text-xs font-medium"
                >
                  <Link href={`/products/${encodeURIComponent(family.FAMILY)}`}>
                    {family.FAMILY}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {pathname !== "/stores" && (
            <>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Επιλογή καταστήματος</DropdownMenuLabel>

                  {clientData?.data.map((branch) => {
                    const isActive = branch.BRANCH === branchNumber;

                    return (
                      <DropdownMenuItem
                        disabled={isActive || isPending}
                        key={branch.BRANCH}
                        onClick={() => handleBranchChange(branch)}
                        className={"cursor-pointer"}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {branch.NAME}
                          </span>
                          <span className="text-xs text-slate-500">
                            {branch.ADDRESS}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>

                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 sm:px-3 p-6"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase tracking-wide text-slate-500">
                        Καταστημα
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-tight">
                        {currentBranch?.NAME}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                        {currentBranch?.ADDRESS}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </DropdownMenu>

              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" aria-label="Καλάθι" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {data && data.count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                      {data.count}
                    </span>
                  )}
                </Link>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex bg-red-500 text-white hover:bg-red-600 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
