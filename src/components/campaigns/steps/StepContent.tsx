"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateSelector } from "@/components/templates/TemplateSelector"
import { useState } from "react"
import { Template } from "@/types"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function StepContent() {
    const { control, watch, setValue } = useFormContext()
    const message = watch("message")
    const [activeTab, setActiveTab] = useState("custom")
    const [isTemplateOpen, setIsTemplateOpen] = useState(false)

    const handleTemplateSelect = (template: Template) => {
        const text = (template.components?.find(c => c.type === 'BODY' && 'text' in c) as any)?.text || ""
        setValue("message", text, { shouldValidate: true })
        setValue("templateId", template.id)
        setIsTemplateOpen(false)
        setActiveTab("custom") // Switch back to see the preview
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Message Content</h3>
                    <p className="text-sm text-muted-foreground">Compose the message you want to send.</p>
                </div>

                <div className="flex gap-4 mb-4">
                    <Button
                        variant={activeTab === 'custom' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('custom')}
                        className="flex-1"
                    >
                        Custom Message
                    </Button>
                    <Button
                        variant={activeTab === 'template' ? 'default' : 'outline'}
                        onClick={() => setIsTemplateOpen(true)}
                        className="flex-1"
                    >
                        <FileText className="mr-2 h-4 w-4" /> Pick Template
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsContent value="custom" className="mt-0">
                        <FormField
                            control={control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message Body</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your message here..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>

                <TemplateSelector
                    open={isTemplateOpen}
                    onOpenChange={setIsTemplateOpen}
                    onSelect={handleTemplateSelect}
                />
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">Preview</h3>
                <Card className="p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover min-h-[300px] flex items-center justify-center">
                    <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm max-w-[80%] rounded-tl-none relative">
                        <p className="text-sm whitespace-pre-wrap">{message || "Your message will appear here..."}</p>
                        <span className="text-[10px] text-muted-foreground block text-right mt-1">12:00 PM</span>
                    </div>
                </Card>
            </div>
        </div>
    )
}
