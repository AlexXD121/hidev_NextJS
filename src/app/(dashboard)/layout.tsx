import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/Sidebar";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // FORCE UPDATE: Ensuring no Sidebar here.
    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-background text-foreground">
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* Mobile Header - Visible only on mobile */}
                    <div className="md:hidden flex items-center p-4 border-b">
                        <MobileNav />
                        <span className="font-bold ml-4">WhatsApp Biz</span>
                    </div>

                    {/* Scrollable Page Content */}
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
