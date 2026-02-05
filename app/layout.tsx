import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "../components/query-provider";
import { Toaster } from "react-hot-toast";
import React from "react";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  title: "E-order Beta",
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
        suppressHydrationWarning
        className={cn(
          "bg-backround dark:bg-zinc-900 text-foreground antialiased",
          "min-h-screen flex flex-col",
        )}
      >
        <QueryProvider>
          <AppShell>{children}</AppShell>

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
              position: "top-center",
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
