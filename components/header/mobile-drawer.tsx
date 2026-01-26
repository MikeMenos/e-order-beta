"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { LogOut, Menu } from "lucide-react";
import { IStoreInfo } from "@/lib/interfaces";
import { BranchInfo } from "./branch-info";

interface MobileDrawerProps {
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  currentBranch: IStoreInfo | undefined;
  clientData: { data: IStoreInfo[] } | undefined;
  isPending: boolean;
  onBranchChange: (branch: IStoreInfo) => void;
  onLogout: () => void;
}

export function MobileDrawer({
  drawerOpen,
  onDrawerOpenChange,
  currentBranch,
  clientData,
  isPending,
  onBranchChange,
  onLogout,
}: MobileDrawerProps) {
  return (
    <Drawer open={drawerOpen} onOpenChange={onDrawerOpenChange}>
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
        <div className="px-4 pb-4">
          {clientData && clientData.data.length > 1 && (
            <>
              <DrawerHeader>
                <DrawerTitle>Επιλογή καταστήματος</DrawerTitle>
              </DrawerHeader>

              <nav className="flex flex-col gap-4">
                {clientData.data.map((branch) => {
                  const isActive = branch.BRANCH === currentBranch?.BRANCH;

                  return (
                    <Button
                      key={branch.BRANCH}
                      type="button"
                      variant="ghost"
                      className={`w-full justify-start ${
                        isActive
                          ? "bg-primary rounded-full text-white hover:bg-primary py-5"
                          : ""
                      }`}
                      disabled={isActive || isPending}
                      onClick={async () => {
                        await onBranchChange(branch);
                        onDrawerOpenChange(false);
                      }}
                    >
                      <BranchInfo branch={branch} isActive={isActive} />
                    </Button>
                  );
                })}
              </nav>
            </>
          )}
        </div>

        <Separator />

        <DrawerFooter>
          <Button
            variant="outline"
            className="w-full bg-red-500 text-white hover:bg-red-600 hover:text-white"
            onClick={() => {
              onDrawerOpenChange(false);
              onLogout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Αποσύνδεση
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
