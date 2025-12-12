import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ReactQueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalErrorBoundary } from "@/components/ui/error-boundary"

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
};

export const viewport = {
  themeColor: "#25D366",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
  shrinkToFit: "no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen bg-background text-foreground overflow-hidden`}
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
            </GlobalErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
