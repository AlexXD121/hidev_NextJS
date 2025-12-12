import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/Sidebar";
import { CallDialog } from "@/components/chat/CallDialog";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header: visible only on mobile/tablet to not double-stack with sidebar on desktop */}
                    <header className="md:hidden flex items-center p-4 border-b">
                        <MobileNav />
                        <span className="font-bold ml-4">WhatsApp Biz</span>
                    </header>

                    <main className="flex-1 overflow-y-auto w-full relative">
                        {children}
                    </main>
                </div>
                <CallDialog />
            </div>
        </AuthGuard>
    );
}
