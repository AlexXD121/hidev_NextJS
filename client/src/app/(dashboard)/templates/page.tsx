"use client"

import TemplatesList from "@/components/templates/TemplatesList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export default function TemplatesPage() {
    return (
        <ScrollArea className="h-full w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
                        <p className="text-muted-foreground">Manage your WhatsApp message templates</p>
                    </div>
                </div>

                <TemplatesList />
            </motion.div>
        </ScrollArea>
    );
}
