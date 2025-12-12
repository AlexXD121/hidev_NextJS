"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { TemplateSelector } from "@/components/templates/TemplateSelector"
import { Textarea } from "@/components/ui/textarea"

export function StepDetails() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Campaign Details</h3>
                <p className="text-sm text-muted-foreground">Give your campaign a name and define its goal.</p>
            </div>

            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Summer Sale 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="goal"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Campaign Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a goal" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="promotional">Promotional</SelectItem>
                                <SelectItem value="newsletter">Newsletter</SelectItem>
                                <SelectItem value="update">Product Update</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="scheduledDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Scheduled Date (Optional)</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Message Content</FormLabel>
                        <FormControl>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={field.value?.type === 'template' ? 'default' : 'outline'}
                                        onClick={() => field.onChange({ ...field.value, type: 'template' })}
                                    >
                                        Use Template
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={field.value?.type === 'custom' ? 'default' : 'outline'}
                                        onClick={() => field.onChange({ ...field.value, type: 'custom' })}
                                    >
                                        Custom Message
                                    </Button>
                                </div>

                                {field.value?.type === 'template' ? (
                                    <div className="border p-4 rounded-md">
                                        <p className="text-sm text-muted-foreground mb-2">Select a template for your campaign.</p>
                                        <TemplateSelector
                                            onSelect={(template) => {
                                                const body = template.components.find(c => c.type === 'BODY' && 'text' in c);
                                                field.onChange({
                                                    type: 'template',
                                                    templateId: template.id,
                                                    text: body && 'text' in body ? body.text : ''
                                                });
                                            }}
                                        />
                                        {field.value?.text && (
                                            <div className="mt-4 p-3 bg-muted rounded text-sm">
                                                {field.value.text}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Textarea
                                        placeholder="Type your message here..."
                                        className="min-h-[150px]"
                                        value={field.value?.text || ''}
                                        onChange={(e) => field.onChange({ type: 'custom', text: e.target.value })}
                                    />
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

