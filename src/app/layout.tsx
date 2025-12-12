import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ReactQueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhatsApp Business Dashboard",
  description: "Manage your WhatsApp campaigns and chats",
  manifest: "/manifest.json",
  themeColor: "#25D366",
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};

import { ThemeProvider } from "@/components/theme-provider"
import { GlobalErrorBoundary } from "@/components/ui/error-boundary"

/* ... imports ... */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen bg-background text-foreground overflow-hidden`}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalErrorBoundary>
              {children}
              <Toaster />
            </GlobalErrorBoundary>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
