"use client"

import { useFormContext } from "react-hook-form"
import { format } from "date-fns"
import { MOCK_CONTACTS } from "@/lib/mockData"

export function StepPreview() {
    const { getValues } = useFormContext()
    const values = getValues()

    const recipientCount = values.recipients?.length || 0
    const recipientNames = values.recipients?.map((id: string) => MOCK_CONTACTS.find(c => c.id === id)?.name).slice(0, 3).join(", ")

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Review & Launch</h3>
                <p className="text-sm text-muted-foreground">Double check everything before starting the campaign.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase">Details</h4>
                        <p><span className="font-medium">Name:</span> {values.name}</p>
                        <p><span className="font-medium">Goal:</span> {values.goal}</p>
                        <p><span className="font-medium">Scheduled:</span> {values.scheduledDate ? format(values.scheduledDate, "PPP") : "Immediate"}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase">Audience</h4>
                        <p><span className="font-medium">Total Recipients:</span> {recipientCount}</p>
                        {recipientCount > 0 && <p className="text-sm text-muted-foreground">Including: {recipientNames} {recipientCount > 3 && `and ${recipientCount - 3} others`}</p>}
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase">Message Content</h4>
                    <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
                        {values.message}
                    </div>
                </div>
            </div>
        </div>
    )
}
