"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTemplatesStore } from "@/store/useTemplatesStore"
import { FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Template } from "@/types"

interface TemplateSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (template: Template) => void;
}

export function TemplateSelector({ open, onOpenChange, onSelect }: TemplateSelectorProps) {
    const { templates, fetchTemplates } = useTemplatesStore();
    const [search, setSearch] = useState("");

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen);
        if (newOpen && templates.length === 0) fetchTemplates();
    }

    const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select Template</DialogTitle>
                    <DialogDescription>
                        Choose a template to send.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search templates..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                        {filtered.map((template, index) => (
                            <div
                                key={template.id || index}
                                className="p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                                onClick={() => {
                                    onSelect(template);
                                    onOpenChange(false);
                                }}
                            >
                                <div className="font-medium text-sm flex justify-between">
                                    <span>{template.name}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{template.category.toLowerCase()}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {template.components.find(c => c.type === 'BODY' && 'text' in c)?.text}
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm py-8">
                                No templates found.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
