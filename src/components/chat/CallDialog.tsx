"use client"

import { useEffect, useState } from "react"
import { useCallStore } from "@/store/useCallStore"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function CallDialog() {
    const { activeCall, endCall } = useCallStore()
    const [callDuration, setCallDuration] = useState(0)

    useEffect(() => {
        if (activeCall.startTime) {
            const interval = setInterval(() => {
                setCallDuration(Math.floor((Date.now() - activeCall.startTime!.getTime()) / 1000))
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [activeCall.startTime])

    if (!activeCall.type) return null

    return (
        <Dialog open={!!activeCall.type} onOpenChange={() => endCall()}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center space-y-4 p-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24 animate-pulse">
                            <AvatarFallback className="text-2xl">
                                {activeCall.contactName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping" />
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-semibold">
                            {activeCall.type === 'video' ? 'Video' : 'Voice'} Call
                        </h3>
                        <p className="text-muted-foreground">
                            Calling {activeCall.contactName}...
                        </p>
                        {callDuration > 0 && (
                            <p className="text-sm text-muted-foreground mt-2">
                                {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                            </p>
                        )}
                    </div>

                    <Button 
                        variant="destructive" 
                        onClick={endCall}
                        className="w-full"
                    >
                        End Call
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}