"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onLogout: () => void;
  variant?: "mobile" | "desktop" | "both";
  pathname?: string;
}

export function LogoutButton({
  onLogout,
  variant = "both",
  pathname,
}: LogoutButtonProps) {
  const showMobile =
    variant === "mobile" || variant === "both"
      ? pathname === "/" || pathname === "/stores"
      : false;
  const showDesktop = variant === "desktop" || variant === "both";

  return (
    <>
      {showMobile && (
        <Button
          variant="outline"
          size="sm"
          className="md:hidden bg-red-500 text-white hover:bg-red-600 hover:text-white"
          onClick={onLogout}
        >
          <LogOut className="mr-1 h-4 w-4" />
          Αποσύνδεση
        </Button>
      )}

      {showDesktop && (
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex bg-red-500 text-white hover:bg-red-600 hover:text-white"
          onClick={onLogout}
        >
          <LogOut className="mr-1 h-4 w-4" />
          Αποσύνδεση
        </Button>
      )}
    </>
  );
}
