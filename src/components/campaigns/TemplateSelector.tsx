"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_TEMPLATES } from "@/lib/mockData"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TemplateSelectorProps {
    onSelect: (templateId: string, content: string) => void
    selectedTemplateId?: string
}

export function TemplateSelector({ onSelect, selectedTemplateId }: TemplateSelectorProps) {

    return (
        <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_TEMPLATES.map((template) => {
                    const bodyComponent = template.components.find(c => c.type === 'BODY');
                    const content = bodyComponent && 'text' in bodyComponent ? bodyComponent.text : '';

                    return (
                        <Card
                            key={template.id}
                            className={`p-4 cursor-pointer transition-all hover:border-primary ${selectedTemplateId === template.id ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => onSelect(template.id, content)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-sm">{template.name}</h4>
                                <Badge variant={template.category === 'MARKETING' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                                    {template.category}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                                {content}
                            </p>
                            <Button size="sm" variant="outline" className="w-full text-xs h-8">
                                {selectedTemplateId === template.id ? "Selected" : "Use Template"}
                            </Button>
                        </Card>
                    );
                })}
            </div>
        </ScrollArea>
    )
}
