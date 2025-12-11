import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 md:pl-64 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 border-b bg-white dark:bg-slate-950">
                    <MobileNav />
                    <span className="font-bold ml-4">WhatsApp Biz</span>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
