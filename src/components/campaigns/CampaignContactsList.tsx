"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Contact } from "@/types"
import { MOCK_CONTACTS } from "@/lib/mockData"
import { useMemo } from "react"
import { Check, CheckCheck, Clock } from "lucide-react"

interface CampaignContactsListProps {
    totalContacts: number
    sentCount: number
    deliveredCount: number
    readCount: number
}

// Generate deterministic random statuses based on counts
function generateStatuses(contacts: Contact[], sent: number, delivered: number, read: number) {
    return contacts.map((contact, index) => {
        let status: 'pending' | 'sent' | 'delivered' | 'read' = 'pending'

        // Simple logic to distribute statuses
        // This is just a visual mock. In reality, we'd have a separate relation table.
        if (index < read) status = 'read'
        else if (index < delivered) status = 'delivered'
        else if (index < sent) status = 'sent'

        return { ...contact, status }
    })
}

export function CampaignContactsList({ totalContacts, sentCount, deliveredCount, readCount }: CampaignContactsListProps) {

    const contactsWithStatus = useMemo(() => {
        // Mocking a subset of contacts for this campaign
        // In real app, we would fetch from API
        const campaignContacts = MOCK_CONTACTS.slice(0, totalContacts)
        return generateStatuses(campaignContacts, sentCount, deliveredCount, readCount)
    }, [totalContacts, sentCount, deliveredCount, readCount])

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Contact Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contactsWithStatus.map((contact) => (
                        <TableRow key={contact.id}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {contact.status === 'read' && (
                                        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                                            <CheckCheck className="w-3 h-3 mr-1" /> Read
                                        </Badge>
                                    )}
                                    {contact.status === 'delivered' && (
                                        <Badge variant="secondary">
                                            <CheckCheck className="w-3 h-3 mr-1" /> Delivered
                                        </Badge>
                                    )}
                                    {contact.status === 'sent' && (
                                        <Badge variant="outline">
                                            <Check className="w-3 h-3 mr-1" /> Sent
                                        </Badge>
                                    )}
                                    {contact.status === 'pending' && (
                                        <Badge variant="outline" className="text-muted-foreground border-dashed">
                                            <Clock className="w-3 h-3 mr-1" /> Pending
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-xs">
                                {contact.status !== 'pending' ? '12:30 PM' : '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                    {contactsWithStatus.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No contacts in this campaign.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
