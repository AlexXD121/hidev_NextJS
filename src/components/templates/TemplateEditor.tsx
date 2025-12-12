"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTemplatesStore } from "@/store/useTemplatesStore";
import { Template } from "@/types";
import { Plus, Trash2, Eye } from "lucide-react";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

const templateSchema = z.object({
    name: z.string().min(1, "Name is required").regex(/^[a-z0-9_]+$/, "Name must be lowercase alphanumeric with underscores"),
    category: z.enum(["MARKETING", "UTILITY", "AUTHENTICATION"]),
    language: z.string().min(1, "Language is required"),
    headerType: z.enum(["NONE", "TEXT", "IMAGE", "VIDEO", "DOCUMENT"]),
    headerText: z.string().optional(),
    headerMediaUrl: z.string().optional(),
    bodyText: z.string().min(1, "Body text is required"),
    footerText: z.string().optional(),
    buttonsType: z.enum(["NONE", "QUICK_REPLY", "CTA"]),
    buttons: z.array(z.object({
        type: z.enum(["QUICK_REPLY", "PHONE_NUMBER", "URL"]),
        text: z.string().min(1, "Button text is required"),
        phoneNumber: z.string().optional(),
        url: z.string().optional()
    })).optional()
});

interface TemplateEditorProps {
    isOpen: boolean;
    onClose: () => void;
    existingTemplate?: Template | null;
}

export function TemplateEditor({ isOpen, onClose, existingTemplate }: TemplateEditorProps) {
    const { addTemplate, updateTemplate } = useTemplatesStore();
    const [previewOpen, setPreviewOpen] = useState(false);

    // Transform existing template to form values if present
    const defaultValues = existingTemplate ? {
        name: existingTemplate.name,
        category: existingTemplate.category,
        language: existingTemplate.language,
        headerType: existingTemplate.components.find(c => c.type === 'HEADER')?.format || "NONE",
        headerText: existingTemplate.components.find(c => c.type === 'HEADER')?.text || "",
        headerMediaUrl: existingTemplate.components.find(c => c.type === 'HEADER')?.mediaUrl || "",
        bodyText: existingTemplate.components.find(c => c.type === 'BODY' && 'text' in c)?.text || "",
        footerText: existingTemplate.components.find(c => c.type === 'FOOTER' && 'text' in c)?.text || "",
        buttonsType: existingTemplate.components.some(c => c.type === 'BUTTONS')
            ? (existingTemplate.components.find(c => c.type === 'BUTTONS') as any).buttons[0].type === 'QUICK_REPLY' ? "QUICK_REPLY" : "CTA"
            : "NONE",
        buttons: existingTemplate.components.find(c => c.type === 'BUTTONS')
            ? (existingTemplate.components.find(c => c.type === 'BUTTONS') as any).buttons
            : []
    } : {
        name: "",
        category: "MARKETING",
        language: "en_US",
        headerType: "NONE",
        headerText: "",
        headerMediaUrl: "",
        bodyText: "",
        footerText: "",
        buttonsType: "NONE",
        buttons: []
    };

    const form = useForm<z.infer<typeof templateSchema>>({
        resolver: zodResolver(templateSchema),
        defaultValues: defaultValues as any
    });

    const onSubmit = (values: z.infer<typeof templateSchema>) => {
        const components: any[] = [];

        // Build components array
        if (values.headerType !== "NONE") {
            components.push({
                type: "HEADER",
                format: values.headerType,
                text: values.headerType === "TEXT" ? values.headerText : undefined,
                mediaUrl: values.headerType !== "TEXT" ? values.headerMediaUrl || "https://placehold.co/600x400/png?text=Header" : undefined
            });
        }

        components.push({
            type: "BODY",
            text: values.bodyText
        });

        if (values.footerText) {
            components.push({
                type: "FOOTER",
                text: values.footerText
            });
        }

        if (values.buttonsType !== "NONE" && values.buttons && values.buttons.length > 0) {
            components.push({
                type: "BUTTONS",
                buttons: values.buttons
            });
        }

        const templateData = {
            name: values.name,
            category: values.category,
            language: values.language,
            components
        };

        if (existingTemplate) {
            updateTemplate(existingTemplate.id, templateData);
        } else {
            addTemplate(templateData);
        }

        onClose();
        form.reset();
    };

    const previewTemplate: Template = {
        id: "preview",
        name: form.watch("name") || "Untitled",
        category: form.watch("category"),
        language: form.watch("language"),
        status: "pending",
        lastUpdated: new Date().toISOString(),
        components: [
            ...(form.watch("headerType") !== "NONE" ? [{
                type: "HEADER" as const,
                format: form.watch("headerType") as any,
                text: form.watch("headerText") || "",
                mediaUrl: form.watch("headerMediaUrl") || "https://placehold.co/600x400/png?text=Header"
            }] : []),
            { type: "BODY", text: form.watch("bodyText") || "" },
            ...(form.watch("footerText") ? [{ type: "FOOTER" as const, text: form.watch("footerText") || "" }] : []),
            ...(form.watch("buttonsType") !== "NONE" && (form.watch("buttons")?.length || 0) > 0 ? [{
                type: "BUTTONS" as const,
                buttons: form.watch("buttons")!
            }] : [])
        ]
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{existingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
                    <DialogDescription>
                        Define your template content, variables, and buttons.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. welcome_message" {...field} />
                                        </FormControl>
                                        <FormDescription>Lowercase, numbers, underscores only.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MARKETING">Marketing</SelectItem>
                                                <SelectItem value="UTILITY">Utility</SelectItem>
                                                <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Tabs defaultValue="body" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="header">Header</TabsTrigger>
                                <TabsTrigger value="body">Body</TabsTrigger>
                                <TabsTrigger value="footer">Footer</TabsTrigger>
                                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                            </TabsList>

                            <TabsContent value="header" className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="headerType"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Header Type</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="NONE" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">None</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="TEXT" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Text</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="IMAGE" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Image</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.watch("headerType") === "TEXT" && (
                                    <FormField
                                        control={form.control}
                                        name="headerText"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Header Text</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter header text" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </TabsContent>

                            <TabsContent value="body" className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="bodyText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Body Text</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter your message text. Use {{1}}, {{2}} for variables."
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Example: Hello {"{{1}}"}, welcome to {"{{2}}"}.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="footer" className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="footerText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Footer Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter footer text (optional)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="buttons" className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="buttonsType"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Buttons Type</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={(val: string) => {
                                                        field.onChange(val);
                                                        // Reset buttons when type changes
                                                        if (val === "NONE") form.setValue("buttons", []);
                                                        else if (val === "QUICK_REPLY") form.setValue("buttons", [{ type: "QUICK_REPLY", text: "" }]);
                                                        else if (val === "CTA") form.setValue("buttons", [{ type: "URL", text: "", url: "" }]);
                                                    }}
                                                    defaultValue={field.value}
                                                    className="flex flex-row space-x-4"
                                                >
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="NONE" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">None</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="QUICK_REPLY" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Quick Reply</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="CTA" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Call to Action</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>

                                        </FormItem>
                                    )}
                                />

                                {form.watch("buttonsType") !== "NONE" && (
                                    <div className="space-y-3">
                                        <FormLabel>Button Definitions</FormLabel>
                                        <div className="flex gap-2">
                                            {form.watch("buttons")?.map((btn, index) => (
                                                <div key={index} className="flex-1 space-y-2 p-3 border rounded-md">
                                                    <Input
                                                        placeholder="Button Text"
                                                        value={btn.text}
                                                        onChange={(e) => {
                                                            const newButtons = [...(form.watch("buttons") || [])];
                                                            newButtons[index].text = e.target.value;
                                                            form.setValue("buttons", newButtons);
                                                        }}
                                                    />
                                                    {btn.type === "URL" && (
                                                        <Input
                                                            placeholder="https://example.com"
                                                            value={btn.url}
                                                            onChange={(e) => {
                                                                const newButtons = [...(form.watch("buttons") || [])];
                                                                newButtons[index].url = e.target.value;
                                                                form.setValue("buttons", newButtons);
                                                            }}
                                                        />
                                                    )}
                                                    {/* Add more inputs for other types as needed */}
                                                </div>
                                            ))}
                                            {form.watch("buttonsType") === "QUICK_REPLY" && (form.watch("buttons")?.length || 0) < 3 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const current = form.watch("buttons") || [];
                                                        form.setValue("buttons", [...current, { type: "QUICK_REPLY", text: "" }]);
                                                    }}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-between pt-4 border-t">
                            <Button type="button" variant="secondary" onClick={() => setPreviewOpen(true)}>
                                <Eye className="mr-2 h-4 w-4" /> Preview
                            </Button>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit">Save Template</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>

            <TemplatePreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                template={previewTemplate}
            />
        </Dialog>
    );
}
