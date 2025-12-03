import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "../components/query-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "react-hot-toast";

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
      <body
        className={cn(
          "bg-background text-foreground antialiased",
          "flex flex-col"
        )}
      >
        <QueryProvider>
          <Header />
          <div className="max-w-9xl mx-auto">{children}</div>
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
