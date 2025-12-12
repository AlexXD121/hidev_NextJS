import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Template } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface TemplatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: Template | null;
}

export function TemplatePreviewModal({ isOpen, onClose, template }: TemplatePreviewModalProps) {
    if (!template) return null;

    // Helper to render body text with highlighted variables
    const renderBodyWithVariables = (text: string) => {
        const parts = text.split(/(\{\{\d+\}\})/g);
        return parts.map((part, index) => {
            if (part.match(/\{\{\d+\}\}/)) {
                return (
                    <span key={index} className="bg-yellow-100 text-yellow-800 px-1 rounded mx-0.5 font-medium border border-yellow-200">
                        {part}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const headerComponent = template.components.find(c => c.type === "HEADER");
    const bodyComponent = template.components.find(c => c.type === "BODY");
    const footerComponent = template.components.find(c => c.type === "FOOTER");
    const buttonsComponent = template.components.find(c => c.type === "BUTTONS");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-white dark:bg-zinc-950">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>{template.name}</span>
                        <Badge variant={
                            template.status === 'approved' ? 'default' :
                                template.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                            {template.status}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Language: {template.language} • Category: {template.category}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 bg-[#E5DDD5] dark:bg-[#0b141a] p-4 rounded-lg min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden bg-opacity-90">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />

                    <div className="w-full max-w-[320px] bg-white dark:bg-[#1f2c34] rounded-lg shadow-sm z-10 overflow-hidden relative">
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
                            {bodyComponent && 'text' in bodyComponent && renderBodyWithVariables(bodyComponent.text)}
                        </div>

                        {/* Footer */}
                        {footerComponent && (
                            <div className="px-3 pb-3 text-xs text-gray-500 dark:text-gray-400">
                                {'text' in footerComponent && footerComponent.text}
                            </div>
                        )}

                        {/* Timestamp */}
                        <div className="px-3 pb-2 text-[10px] text-right text-gray-400 dark:text-gray-500">
                            12:00 PM
                        </div>
                    </div>

                    {/* Buttons */}
                    {buttonsComponent && 'buttons' in buttonsComponent && (
                        <div className="w-full max-w-[320px] mt-2 flex flex-col gap-2 z-10">
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

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button>Use Template</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
