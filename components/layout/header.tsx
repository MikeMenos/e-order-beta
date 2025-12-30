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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, LogOut, ChevronDown, Menu } from "lucide-react";
import { useGetCart } from "@/hooks/useGetCart";
import { appStore } from "@/stores/appStore";
import { useGetFamilies } from "@/hooks/useGetFamilies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useAddToCart";
import { IStoreInfo } from "@/lib/interfaces";
import { useGetClientData } from "@/hooks/useGetClientData";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const {
    hydrated,
    setHydrated,
    setBasketId,
    vat,
    currentBranch,
    setCurrentBranch,
  } = appStore();

  const { data: families } = useGetFamilies();
  const { data: clientData, mutate } = useGetClientData();

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  const trdr = currentBranch?.TRDR ? String(currentBranch.TRDR) : undefined;
  const branch = currentBranch?.BRANCH
    ? String(currentBranch.BRANCH)
    : undefined;

  const { data } = useGetCart({
    trdr,
    branch,
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
          if (data.id) {
            setBasketId(data.id);
          }
          if (vat) {
            mutate(vat);
          }
        },
      });
    } else if (branch?.BASKET_KEY) {
      setBasketId(branch.BASKET_KEY);
    }

    setCurrentBranch(branch);
    router.push("/");
  };
  const handleLogout = async () => {
    setBasketId(undefined);
    setCurrentBranch(undefined);
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 shadow-[0_1px_4px_rgba(0,0,0,0.08)] dark:bg-black/80 backdrop-blur">
      <div className="flex h-16 items-center px-2 sm:px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src={logo} alt="Logo" width={150} height={30} />
          {/* <span className="hidden sm:inline text-lg font-bold text-(--color-chart-6) hover:opacity-90 transition">
            Ergastirion Manager
          </span> */}
        </Link>

        {pathname !== "/stores" && (
          <>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden shrink-0"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Κατηγορίες</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-4">
                  <nav className="flex flex-col gap-2">
                    {families?.map((family) => (
                      <DrawerClose key={family.FAMILY} asChild>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Link
                            href={`/products/${encodeURIComponent(
                              family.FAMILY
                            )}`}
                          >
                            {family.FAMILY}
                          </Link>
                        </Button>
                      </DrawerClose>
                    ))}
                  </nav>
                </div>
                <Separator />
                <DrawerFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-red-500 text-white hover:bg-red-600 hover:text-white"
                    onClick={() => {
                      setDrawerOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <div className="hidden md:flex flex-1 overflow-x-auto">
              <nav className="ml-4 flex items-center gap-1 md:gap-2">
                {families?.map((family) => (
                  <Button
                    key={family.FAMILY}
                    asChild
                    variant="ghost"
                    size="sm"
                    className="whitespace-nowrap text-xs font-medium"
                  >
                    <Link
                      href={`/products/${encodeURIComponent(family.FAMILY)}`}
                    >
                      {family.FAMILY}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          </>
        )}

        <div className="flex items-center sm:gap-2 md:gap-4">
          {pathname !== "/stores" && (
            <>
              {clientData?.data.length === 1 ? (
                <>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 sm:px-3 p-6 cursor-default"
                    disabled
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] tracking-wide text-slate-500">
                        ΚΑΤΑΣΤΗΜΑ
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-tight">
                        {currentBranch?.NAME}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                        {currentBranch?.ADDRESS}
                      </span>
                    </div>
                  </Button>
                </>
              ) : (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Επιλογή καταστήματος</DropdownMenuLabel>

                    {clientData?.data.map((branch) => {
                      const isActive = branch.BRANCH === currentBranch?.BRANCH;

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
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:p-6"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] tracking-wide text-slate-500">
                          ΚΑΤΑΣΤΗΜΑ
                        </span>
                        <span className="text-xs sm:text-sm font-medium leading-tight">
                          {currentBranch?.NAME}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                          {currentBranch?.ADDRESS}
                        </span>
                      </div>
                      <ChevronDown className="block h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              )}

              {/* Cart Button */}
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" aria-label="Καλάθι" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {data && data.count > 0 && (
                    <span className="absolute -top-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
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
