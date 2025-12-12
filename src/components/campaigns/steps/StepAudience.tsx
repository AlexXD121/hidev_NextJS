
"use client"

import { useState, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { Search, UserPlus, Filter, FileSpreadsheet, Download, RefreshCw, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MOCK_CONTACTS } from "@/lib/mockData"
import { CampaignFormValues } from "@/lib/validators/campaign"
import { Contact } from "@/types"
import { toast } from "sonner"

export function StepAudience() {
    const { watch, setValue, getValues } = useFormContext()
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
        const allSelected = allIds.every(id => recipients.includes(id))

        if (allSelected) {
            setValue("recipients", recipients.filter((id: string) => !allIds.includes(id)), { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        } else {
            const newRecipients = Array.from(new Set([...recipients, ...allIds]))
            setValue("recipients", newRecipients, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        }
    }

    const handleToggleContact = (contactId: string) => {
        const current = getValues("recipients") || []
        const isSelected = current.includes(contactId)

        let newRecipients
        if (isSelected) {
            newRecipients = current.filter((id: string) => id !== contactId)
        } else {
            newRecipients = [...current, contactId]
        }

        setValue("recipients", newRecipients, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    }

    const [isImportOpen, setIsImportOpen] = useState(false)
    const [sheetUrl, setSheetUrl] = useState("")
    const [isImporting, setIsImporting] = useState(false)

    const handleSheetImport = async () => {
        if (!sheetUrl) return

        setIsImporting(true)
        // Simulate parsing delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Mock imported contacts
        const newContacts = MOCK_CONTACTS.slice(0, 5) // Simulating 5 contacts found
        const currentRecipients = getValues("recipients") || []

        // Add new unique contacts
        const defaults = currentRecipients.filter((r: string) => !newContacts.find(nc => nc.id === r))
        setValue("recipients", [...defaults, ...newContacts.map(c => c.id)])

        setIsImporting(false)
        setIsImportOpen(false)
        setSheetUrl("")

        toast.success("Contacts Imported", {
            description: `Successfully imported ${newContacts.length} contacts from Google Sheet.`
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Select Audience</h3>
                    <p className="text-sm text-muted-foreground">
                        Choose contacts or import from external sources.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                import from Sheets
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Import from Google Sheets</DialogTitle>
                                <DialogDescription>
                                    Paste your published Google Sheet URL below. Ensure the first column contains phone numbers.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Sheet URL</Label>
                                    <Input
                                        placeholder="https://docs.google.com/spreadsheets/d/..."
                                        value={sheetUrl}
                                        onChange={(e) => setSheetUrl(e.target.value)}
                                    />
                                </div>
                                <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground">
                                    <p className="font-medium mb-1">Requirements:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Sheet must be "Published to Web" or publicly Viewable</li>
                                        <li>Header row is required</li>
                                        <li>"Phone" column is mandatory</li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                                <Button onClick={handleSheetImport} disabled={!sheetUrl || isImporting}>
                                    {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isImporting ? "Importing..." : "Import Contacts"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                </div>
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

            <div className="space-y-2">
                <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                    {filteredContacts.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">No contacts found.</div>
                    ) : (
                        filteredContacts.map((contact) => {
                            const isChecked = recipients.includes(contact.id)
                            return (
                                <div
                                    key={contact.id}
                                    className="flex flex-row items-center space-x-3 space-y-0 p-4 hover:bg-muted/50 cursor-pointer"
                                    onClick={() => handleToggleContact(contact.id)}
                                >
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            checked={isChecked}
                                            className="pointer-events-none"
                                        />
                                    </div>
                                    <div className="flex-1 select-none">
                                        <div className="font-medium">{contact.name}</div>
                                        <div className="text-xs text-muted-foreground">{contact.phone} • {contact.tags.join(", ")}</div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                        Selected: {recipients.length} / {MOCK_CONTACTS.length}
                    </div>
                </div>
            </div>
        </div>
    )
}
