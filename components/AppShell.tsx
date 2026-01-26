"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}

      <main className="mx-auto w-full max-w-6xl py-2 px-3 flex-1">
        {children}
      </main>

      {!isLoginPage && <Footer />}
    </>
  );
}
