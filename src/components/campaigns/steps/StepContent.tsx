"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateSelector } from "../TemplateSelector"
import { useState } from "react"

export function StepContent() {
    const { control, watch, setValue } = useFormContext()
    const message = watch("message")
    const [activeTab, setActiveTab] = useState("custom")

    const handleTemplateSelect = (templateId: string, content: string) => {
        setValue("message", content, { shouldValidate: true })
        setValue("templateId", templateId)
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Message Content</h3>
                    <p className="text-sm text-muted-foreground">Compose the message you want to send.</p>
                </div>

                <Tabs defaultValue="custom" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="custom">Write Custom</TabsTrigger>
                        <TabsTrigger value="template">Choose Template</TabsTrigger>
                    </TabsList>

                    <TabsContent value="custom" className="mt-4">
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

                    <TabsContent value="template" className="mt-4">
                        <TemplateSelector
                            onSelect={handleTemplateSelect}
                            selectedTemplateId={watch("templateId")}
                        />
                    </TabsContent>
                </Tabs>
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
