"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

export default function Header() {
  const pathname = usePathname();
  const { clientData, branchNumber } = appStore();

  const currentBranch = clientData?.data.find(
    (item) => item.BRANCH === branchNumber
  );

  const { data: families } = useGetFamilies();
  const { data } = useGetCart({
    trdr: currentBranch?.TRDR,
    branch: branchNumber,
  });

  if (pathname === "/login") return null;

  const handleBranchChange = (id: string) => {
    // TODO: σύνδεσε το με context / state / query param
    console.log("Change branch to:", id);
  };

  const handleLogout = () => {
    // TODO: βάλε εδώ την πραγματική logout λογική (auth, redirect κτλ)
    console.log("Logout clicked");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-black/80 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* LEFT: Logo + Families */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="hidden sm:inline text-lg font-semibold">
            Ergastirio Manager
          </span>
        </Link>

        {/* Families navigation */}
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

        {/* RIGHT: Logout, Cart, Store dropdown */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Επιλογή καταστήματος</DropdownMenuLabel>
              {clientData?.data.map((branch) => (
                <DropdownMenuItem
                  key={branch.BRANCH}
                  onClick={() => handleBranchChange(branch.BRANCH)}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{branch.NAME}</span>
                    <span className="text-xs text-slate-500">
                      {branch.ADDRESS}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>

            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 sm:px-3"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">
                    Κατάστημα
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

          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
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
