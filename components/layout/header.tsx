"use client";

import { usePathname } from "next/navigation";
import { useGetCart } from "@/hooks/useGetCart";
import { appStore } from "@/stores/appStore";
import { useGetFamilies } from "@/hooks/useGetFamilies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IStoreInfo } from "@/lib/interfaces";
import { useGetClientData } from "@/hooks/useGetClientData";
import { Logo } from "@/components/header/logo";
import { MobileDrawer } from "@/components/header/mobile-drawer";
import { ProductCategoriesNav } from "@/components/header/product-categories-nav";
import { BranchSelector } from "@/components/header/branch-selector";
import { CartButton } from "@/components/header/cart-button";
import { LogoutButton } from "@/components/header/logout-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const {
    hydrated,
    setHydrated,
    vat,
    currentBranch,
    setCurrentBranch,
    setBasketId,
  } = appStore();

  const isSpecialAfm = vat === "999999999" || vat === "987654321";

  const { data: families, isFetching } = useGetFamilies();
  const { data: clientData, mutate } = useGetClientData(isSpecialAfm);

  useEffect(() => {
    appStore.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!vat) return;
    mutate(vat);
  }, [vat, mutate]);

  useEffect(() => {
    if (!hydrated) return;

    // If special AFM user without currentBranch, redirect to /clients
    if (isSpecialAfm && !currentBranch) {
      router.replace("/clients");
    }
  }, [hydrated, currentBranch, pathname, router, isSpecialAfm]);

  const trdr = currentBranch?.TRDR ? String(currentBranch.TRDR) : undefined;
  const branch = currentBranch?.BRANCH
    ? String(currentBranch.BRANCH)
    : undefined;

  const { data } = useGetCart({
    trdr,
    branch,
  });

  if (!hydrated) return null;
  if (pathname === "/login") return null;

  const showClientsLink = isSpecialAfm && !pathname.startsWith("/clients");
  const isPending = false;

  const handleBranchChange = (branch: IStoreInfo) => {
    setOpen(false);
    setCurrentBranch(branch);
    if (branch?.BASKET_KEY && branch.BASKET_KEY !== "0") {
      setBasketId(branch.BASKET_KEY);
    }
    if (branch.GROUP_CHAIN === "L'ARTIGIANO") {
      router.push("/products/LARTIGIANO");
    } else {
      router.push("/");
    }
  };

  const handleLogout = async () => {
    appStore.getState().resetState();
    appStore.persist.clearStorage();
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b bg-white/80 shadow-[0_1px_4px_rgba(0,0,0,0.08)] dark:bg-black/80 backdrop-blur">
      <div className="flex h-16 w-full max-w-full min-w-0 items-center px-2 sm:px-4 justify-between overflow-x-hidden">
        <Logo pathname={pathname} clientData={clientData ?? undefined} />
        {!isFetching && (
          <>
            {pathname !== "/stores" && (
              <>
                <MobileDrawer
                  drawerOpen={drawerOpen}
                  onDrawerOpenChange={setDrawerOpen}
                  currentBranch={currentBranch}
                  clientData={clientData ?? undefined}
                  isPending={isPending}
                  onBranchChange={handleBranchChange}
                  onLogout={handleLogout}
                />

                <div className="flex flex-1 min-w-0 overflow-x-auto items-center">
                  {showClientsLink && (
                    <Button
                      asChild
                      variant="ghost"
                      size="default"
                      className="whitespace-nowrap text-sm font-semibold px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors duration-200 rounded-lg"
                    >
                      <Link href="/clients">ΠΕΛΑΤΕΣ</Link>
                    </Button>
                  )}
                  <ProductCategoriesNav
                    families={families}
                    shouldShow={
                      currentBranch?.GROUP_CHAIN !== "L'ARTIGIANO" &&
                      pathname !== "/" &&
                      !pathname.startsWith("/clients")
                    }
                  />
                </div>
              </>
            )}

            <div className="flex items-center sm:gap-2 md:gap-4 min-w-0">
              {pathname !== "/stores" && !pathname.startsWith("/clients") && (
                <>
                  <BranchSelector
                    currentBranch={currentBranch}
                    clientData={clientData ?? undefined}
                    isPending={isPending}
                    open={open}
                    onOpenChange={setOpen}
                    onBranchChange={handleBranchChange}
                    showOnMobile={currentBranch?.GROUP_CHAIN === "L'ARTIGIANO"}
                  />

                  <CartButton cartCount={data?.count} />
                </>
              )}

              <LogoutButton
                onLogout={handleLogout}
                variant="desktop"
                pathname={pathname}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
