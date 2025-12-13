import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Template } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

interface TemplatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: Template | null;
}

export function TemplatePreviewModal({ isOpen, onClose, template }: TemplatePreviewModalProps) {
    const [params, setParams] = useState<Record<string, string>>({});

    // Reset params when template changes
    useEffect(() => {
        setParams({});
    }, [template]);

    if (!template) return null;

    const bodyComponent = template.components.find(c => c.type === "BODY");
    const headerComponent = template.components.find(c => c.type === "HEADER");
    const footerComponent = template.components.find(c => c.type === "FOOTER");
    const buttonsComponent = template.components.find(c => c.type === "BUTTONS");

    // Extract variables from body text (e.g. {{1}}, {{2}})
    const variables = useMemo(() => {
        if (!bodyComponent || !('text' in bodyComponent)) return [];
        const matches = bodyComponent.text.match(/\{\{\d+\}\}/g);
        if (!matches) return [];
        // Unique variables sorted
        return Array.from(new Set(matches)).sort();
    }, [bodyComponent]);

    const handleParamChange = (variable: string, value: string) => {
        setParams(prev => ({ ...prev, [variable]: value }));
    };

    // Helper to render body text with replaced variables
    const renderPreviewText = (text: string) => {
        const parts = text.split(/(\{\{\d+\}\})/g);
        return parts.map((part, index) => {
            if (part.match(/\{\{\d+\}\}/)) {
                const val = params[part];
                return (
                    <span key={index} className={val ? "font-semibold text-black dark:text-white" : "text-gray-400"}>
                        {val || part}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-zinc-950 flex flex-col md:flex-row gap-0 p-0 overflow-hidden">

                {/* Left Side: Inputs */}
                <div className="w-full md:w-1/2 p-6 border-r flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span>{template.name}</span>
                        </DialogTitle>
                        <DialogDescription>
                            Customize your message
                        </DialogDescription>
                    </DialogHeader>

                    {variables.length > 0 ? (
                        <div className="flex-1 overflow-auto space-y-4 py-2">
                            <div className="text-sm font-medium text-muted-foreground mb-2">Parameters</div>
                            {variables.map(variable => (
                                <div key={variable} className="grid gap-1.5">
                                    <Label htmlFor={variable} className="text-xs">{variable}</Label>
                                    <Input
                                        id={variable}
                                        placeholder={`Value for ${variable}`}
                                        value={params[variable] || ''}
                                        onChange={(e) => handleParamChange(variable, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No parameters to fill for this template.
                        </div>
                    )}

                    <div className="mt-auto pt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={() => { console.log('Using template with params:', params); onClose(); }}>Use Template</Button>
                    </div>
                </div>

                {/* Right Side: Preview */}
                <div className="w-full md:w-1/2 bg-[#F0F2F5] dark:bg-[#0b141a] p-6 flex flex-col items-center justify-center relative bg-opacity-90">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />

                    <div className="w-full max-w-[300px] z-10 flex flex-col gap-2">
                        <div className="text-center pb-4">
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">Live Preview</Badge>
                        </div>

                        <div className="bg-white dark:bg-[#1f2c34] rounded-lg shadow-sm overflow-hidden relative rounded-tl-none">
                            {/* Header */}
                            {headerComponent && (
                                <div className="w-full relative">
                                    {headerComponent.format === 'IMAGE' && headerComponent.mediaUrl && (
                                        <div className="relative h-40 w-full bg-gray-200 dark:bg-gray-700">
                                            <Image
                                                src={headerComponent.mediaUrl}
                                                alt="Header"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    {headerComponent.format === 'TEXT' && headerComponent.text && (
                                        <div className="p-4 pb-2 font-bold text-lg text-gray-900 dark:text-gray-100">
                                            {headerComponent.text}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Body */}
                            <div className="p-3 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                {bodyComponent && 'text' in bodyComponent && renderPreviewText(bodyComponent.text)}
                            </div>

                            {/* Footer */}
                            {footerComponent && (
                                <div className="px-3 pb-3 text-xs text-gray-500 dark:text-gray-400">
                                    {'text' in footerComponent && footerComponent.text}
                                </div>
                            )}

                            {/* Timestamp */}
                            <div className="px-3 pb-2 text-[10px] text-right text-gray-400 dark:text-gray-500">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        {/* Buttons */}
                        {buttonsComponent && 'buttons' in buttonsComponent && (
                            <div className="flex flex-col gap-2">
                                {buttonsComponent.buttons.map((btn: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-[#1f2c34] text-[#00a884] dark:text-[#00a884] text-center py-2.5 rounded-lg shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a3942] transition-colors flex items-center justify-center gap-2">
                                        {btn.type === 'URL' && <span className="text-lg">↗</span>}
                                        {btn.type === 'PHONE_NUMBER' && <span className="text-lg">📞</span>}
                                        {btn.type === 'QUICK_REPLY' && <span className="text-lg">↩</span>}
                                        {btn.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
