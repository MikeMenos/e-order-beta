"use client";

import { usePathname } from "next/navigation";
import { useGetCart } from "@/hooks/useGetCart";
import { appStore } from "@/stores/appStore";
import { useGetFamilies } from "@/hooks/useGetFamilies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildFirstBasketKeyPayload } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useAddToCart";
import { IStoreInfo } from "@/lib/interfaces";
import { useGetClientData } from "@/hooks/useGetClientData";
import { Logo } from "@/components/header/logo";
import { MobileDrawer } from "@/components/header/mobile-drawer";
import { ProductCategoriesNav } from "@/components/header/product-categories-nav";
import { BranchSelector } from "@/components/header/branch-selector";
import { CartButton } from "@/components/header/cart-button";
import { LogoutButton } from "@/components/header/logout-button";

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

  const { data: families, isFetching } = useGetFamilies();
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
    if (branch.GROUP_CHAIN === "L'ARTIGIANO") {
      router.push("/products/LARTIGIANO");
    } else {
      router.push("/");
    }
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
        <Logo pathname={pathname} clientData={clientData} />
        {!isFetching && (
          <>
            {pathname !== "/stores" && (
              <>
                <MobileDrawer
                  drawerOpen={drawerOpen}
                  onDrawerOpenChange={setDrawerOpen}
                  currentBranch={currentBranch}
                  clientData={clientData}
                  isPending={isPending}
                  onBranchChange={handleBranchChange}
                  onLogout={handleLogout}
                />

                <div className="flex flex-1 min-w-0 overflow-x-auto">
                  <ProductCategoriesNav
                    families={families}
                    shouldShow={
                      currentBranch?.GROUP_CHAIN !== "L'ARTIGIANO" &&
                      pathname !== "/"
                    }
                  />
                </div>
              </>
            )}

            <div className="flex items-center sm:gap-2 md:gap-4 min-w-0">
              {pathname !== "/stores" && (
                <>
                  <BranchSelector
                    currentBranch={currentBranch}
                    clientData={clientData}
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
                variant="both"
                pathname={pathname}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
