"use client"

import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MOCK_CONTACTS } from "@/lib/mockData"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"

export function StepAudience() {
    const { control, watch, setValue } = useFormContext()
    const [searchQuery, setSearchQuery] = useState("")
    const recipients = watch("recipients") || []

    const filteredContacts = useMemo(() => {
        return MOCK_CONTACTS.filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone.includes(searchQuery) ||
            contact.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [searchQuery])

    const handleSelectAll = () => {
        const allIds = filteredContacts.map(c => c.id)
        // If all currently filtered are selected, deselect them. Otherwise, select all.
        const allSelected = allIds.every(id => recipients.includes(id))

        if (allSelected) {
            setValue("recipients", recipients.filter((id: string) => !allIds.includes(id)))
        } else {
            // Add unique IDs
            const newRecipients = Array.from(new Set([...recipients, ...allIds]))
            setValue("recipients", newRecipients)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Select Audience</h3>
                <p className="text-sm text-muted-foreground">Who should receive this campaign?</p>
            </div>

            <div className="flex gap-4 items-center">
                <Input
                    placeholder="Search by name, phone, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleSelectAll}>
                    {filteredContacts.every(c => recipients.includes(c.id)) && filteredContacts.length > 0 ? "Deselect Filtered" : "Select Filtered"}
                </Button>
            </div>

            <FormField
                control={control}
                name="recipients"
                render={() => (
                    <FormItem>
                        <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                            {filteredContacts.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground text-sm">No contacts found.</div>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <FormField
                                        key={contact.id}
                                        control={control}
                                        name="recipients"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={contact.id}
                                                    className="flex flex-row items-center space-x-3 space-y-0 p-4 hover:bg-muted/50 cursor-pointer"
                                                    onClick={() => {
                                                        const checked = field.value?.includes(contact.id)
                                                        checked
                                                            ? field.onChange(field.value?.filter((val: string) => val !== contact.id))
                                                            : field.onChange([...(field.value || []), contact.id])
                                                    }}
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(contact.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...(field.value || []), contact.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value: string) => value !== contact.id
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <div className="flex-1">
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            <div className="font-medium">{contact.name}</div>
                                                            <div className="text-xs text-muted-foreground">{contact.phone} • {contact.tags.join(", ")}</div>
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))
                            )}
                        </div>
                        <FormMessage />
                        <div className="text-xs text-muted-foreground text-right">
                            Selected: {recipients.length} / {MOCK_CONTACTS.length}
                        </div>
                    </FormItem>
                )}
            />
        </div>
    )
}
