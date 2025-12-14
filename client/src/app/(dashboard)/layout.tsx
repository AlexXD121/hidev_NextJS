"use client";

import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/Sidebar";
import { CallDialog } from "@/components/chat/CallDialog";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useChatStore } from "@/store/useChatStore";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isChatPage = pathname === "/chat" || pathname?.startsWith("/chat/");
    const { connectSocket, disconnectSocket } = useChatStore();

    React.useEffect(() => {
        connectSocket();
        return () => disconnectSocket();
    }, [connectSocket, disconnectSocket]);

    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header: visible only on mobile/tablet to not double-stack with sidebar on desktop */}
                    <header className={cn("lg:hidden flex items-center p-4 border-b", isChatPage && "hidden")}>
                        <MobileNav />
                        <span className="font-bold ml-4">WhatsApp Business Dashboard</span>
                    </header>

                    <main className={cn(
                        "flex-1 w-full relative",
                        isChatPage ? "overflow-hidden" : "overflow-y-auto"
                    )}>
                        {children}
                    </main>
                </div>
                <CallDialog />
            </div>
        </AuthGuard>
    );
}
