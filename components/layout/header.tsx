"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import logoIcon from "@/public/logo-icon.png";
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
import { ShoppingCart, LogOut, ChevronDown, Menu, Icon } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b bg-white/80 shadow-[0_1px_4px_rgba(0,0,0,0.08)] dark:bg-black/80 backdrop-blur">
      <div className="flex h-16 w-full max-w-full min-w-0 items-center px-2 sm:px-4 justify-between overflow-x-hidden">
        <Link href="/" className="flex items-center gap-0 shrink-0">
          <Image src={logoIcon} alt="Logo" width={36} height={36} className="h-10 w-10 translate-y-px" />
          {pathname === "/stores" && (
            <Image src={logo} alt="Logo" width={150} height={40} className="h-10 w-auto sm:h-11" priority />
          )}
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
                  <DrawerTitle>Επιλογή καταστήματος</DrawerTitle>
                </DrawerHeader>

                <div className="px-4 pb-4">
                  {clientData && clientData.data.length > 1 && (
                    <nav className="flex flex-col gap-2">
                      {clientData.data.map((branch) => {
                        const isActive = branch.BRANCH === currentBranch?.BRANCH;

                        return (
                          <Button
                            key={branch.BRANCH}
                            type="button"
                            variant="ghost"
                            className={`w-full justify-start ${isActive ? "bg-primary rounded-full text-white hover:bg-primary py-5" : ""
                              }`}
                            disabled={isActive || isPending}
                            onClick={async () => {
                              await handleBranchChange(branch);
                              setDrawerOpen(false);
                            }}
                          >
                            <div className="min-w-0 flex flex-col items-start text-left">
                              <span className="truncate text-sm font-medium">
                                {branch.NAME}
                              </span>
                              <span
                                className={`truncate text-xs ${isActive ? "text-white/80" : "text-slate-500"
                                  }`}
                              >
                                {branch.ADDRESS}
                              </span>
                            </div>
                          </Button>
                        );
                      })}
                    </nav>
                  )}
                </div>

                <Separator />

                <DrawerFooter>
                  <Button variant="outline" className="w-full bg-red-500 text-white hover:bg-red-600 hover:text-white" onClick={() => {
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

            <div className="flex flex-1 min-w-0 overflow-x-auto">
              <nav className="ml-4 flex items-center gap-1 md:gap-2">
                {families?.map((family) => {
                  const href = `/products/${encodeURIComponent(family.FAMILY)}`;
                  const isActive = pathname === href;

                  return (
                    <Button
                      key={family.FAMILY}
                      asChild
                      variant="ghost"
                      size="sm"
                      className={`whitespace-nowrap text-xs font-medium transition-colors duration-300 ${isActive
                        ? "bg-primary font-bold text-white hover:bg-primary rounded-full sm:px-4 sm:py-1"
                        : ""
                        }`}>
                      <Link href={href}>{family.FAMILY}</Link>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </>
        )}

        <div className="flex items-center sm:gap-2 md:gap-4 min-w-0">
          {pathname !== "/stores" && (
            <>
              <div className="hidden md:block min-w-0">
                <div className="min-w-0">
                  {clientData?.data.length === 1 ? (
                    <Button
                      variant="ghost"
                      disabled
                      className="min-w-0 cursor-default px-2 sm:px-3 py-2 sm:py-3"
                    >
                      <div className="min-w-0 w-[170px] sm:w-60 flex flex-col items-start text-left">
                        <span className="text-[10px] tracking-wide text-slate-500">
                          ΚΑΤΑΣΤΗΜΑ
                        </span>

                        <span
                          className="w-full truncate text-xs sm:text-sm font-medium leading-tight"
                          title={currentBranch?.NAME}
                        >
                          {currentBranch?.NAME}
                        </span>

                        <span
                          className="w-full truncate text-[10px] text-slate-500"
                          title={currentBranch?.ADDRESS}
                        >
                          {currentBranch?.ADDRESS}
                        </span>
                      </div>
                    </Button>
                  ) : (
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                      <DropdownMenuContent align="end" className="w-72 bg-white">
                        <DropdownMenuLabel>Επιλογή καταστήματος</DropdownMenuLabel>

                        {clientData?.data.map((branch) => {
                          const isActive = branch.BRANCH === currentBranch?.BRANCH;

                          return (
                            <DropdownMenuItem
                              disabled={isActive || isPending}
                              key={branch.BRANCH}
                              onClick={() => handleBranchChange(branch)}
                              className="cursor-pointer"
                            >
                              <div className="min-w-0 flex flex-col">
                                <span
                                  className="truncate text-sm font-medium"
                                  title={branch.NAME}
                                >
                                  {branch.NAME}
                                </span>
                                <span
                                  className="truncate text-xs text-slate-500"
                                  title={branch.ADDRESS}
                                >
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
                          className="min-w-0 px-2 sm:px-3 py-2 sm:py-3 flex items-center gap-2"
                        >
                          <div className="min-w-0 w-[170px] sm:w-60 flex flex-col items-start text-left">
                            <span className="text-[10px] tracking-wide text-slate-500">
                              ΚΑΤΑΣΤΗΜΑ
                            </span>

                            <span
                              className="w-full truncate text-xs sm:text-sm font-medium leading-tight"
                              title={currentBranch?.NAME}
                            >
                              {currentBranch?.NAME}
                            </span>

                            <span
                              className="w-full truncate text-[10px] text-slate-500"
                              title={currentBranch?.ADDRESS}
                            >
                              {currentBranch?.ADDRESS}
                            </span>
                          </div>

                          <ChevronDown className="h-4 w-4 shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" aria-label="Καλάθι" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {data && data.count > 0 && (
                    <span className="absolute -top-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
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
