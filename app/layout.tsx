import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "../components/query-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Ergastirio Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background text-foreground antialiased", "flex flex-col")}>
        <QueryProvider>
          <Header />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
