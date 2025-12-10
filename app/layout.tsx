import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "../components/query-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "react-hot-toast";
import React from "react";

export const metadata: Metadata = {
  title: "Ergastirio Manager",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn( 
          "bg-zinc-50  dark:bg-zinc-900 text-foreground antialiased",
          "min-h-screen flex flex-col"
        )}
      >
        <QueryProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl px-4 py-6 flex-1">
            {children}
          </main>

          <Footer />

          <Toaster
            toastOptions={{
              success: {
                duration: 3000,
                style: { padding: "1rem" },
              },
              error: {
                duration: 3000,
                style: { padding: "1rem" },
              },
              position: "bottom-center",
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
