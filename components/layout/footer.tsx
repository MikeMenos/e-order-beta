"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/login") return null;
  return (
    <footer className="w-full h-14 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-sm text-zinc-500">
      © 2025 Ergastirion-Manager App . All rights reserved.
    </footer>
  );
}
