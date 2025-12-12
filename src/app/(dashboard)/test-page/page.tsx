"use client"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function TestPage() {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
        <div className="p-8">
            <h1>Test Page</h1>
            <div className="mt-4 border p-4">
                <h2>Calendar Props Test</h2>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date()}
                    initialFocus
                />
            </div>
        </div>
    )
}
