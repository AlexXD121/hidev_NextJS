"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";

export function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r w-64 bg-background">
                <div className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Main navigation sidebar for the application</SheetDescription>
                </div>
                <Sidebar isMobile onClose={() => setOpen(false)} className="flex h-full w-full border-none shadow-none" />
            </SheetContent>
        </Sheet>
    );
}
