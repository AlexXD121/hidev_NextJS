import { MobileNav } from "@/components/layout/mobile-nav";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // FORCE UPDATE: Ensuring no Sidebar here.
    return (
        <div className="flex flex-col h-full">
            {/* Mobile Header - Visible only on mobile */}
            <div className="md:hidden flex items-center mb-6">
                <MobileNav />
                <span className="font-bold ml-4">WhatsApp Biz</span>
            </div>

            {/* Page Content */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
