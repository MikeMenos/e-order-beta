"use client";

import { appStore } from "@/stores/appStore";
import { usePathname } from "next/navigation";
import { BranchInfo } from "@/components/header/branch-info";

export default function Footer() {
  const pathname = usePathname();
  const { currentBranch } = appStore();

  return (
    <>
      {/* Fixed branch info for mobile on home page */}
      {(pathname === "/" || pathname === "/cart") && currentBranch && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-1px_4px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-2">
            <BranchInfo branch={currentBranch} showLabel={true} />
          </div>
        </div>
      )}

      <footer className="w-full h-14 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-sm text-zinc-500">
        © 2026 E-order App. All rights reserved.
      </footer>
    </>
  );
}
