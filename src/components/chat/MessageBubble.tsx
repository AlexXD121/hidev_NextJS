"use client"

import { cn } from "@/lib/utils"
import { Message } from "@/types"
import { format } from "date-fns"
import { Check, CheckCheck } from "lucide-react"

interface MessageBubbleProps {
    message: Message
    isMe: boolean
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
    return (
        <div className={cn(
            "flex w-full mb-4",
            isMe ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[70%] px-4 py-2 rounded-lg text-sm shadow-sm relative group",
                isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white dark:bg-zinc-800 border rounded-tl-none"
            )}>
                {message.type === 'image' && message.mediaUrl ? (
                    <div className="mb-1 rounded-lg overflow-hidden">
                        <img src={message.mediaUrl} alt="attachment" className="max-w-xs h-auto object-cover" />
                    </div>
                ) : (
                    <p className="mr-8">{message.text}</p>
                )}

                <div className={cn(
                    "absolute bottom-1 right-2 flex items-center gap-1 text-[10px]",
                    isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                    <span>{format(new Date(message.timestamp), "HH:mm")}</span>
                    {isMe && (
                        <span>
                            {message.status === 'sent' && <Check className="h-3 w-3" />}
                            {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                            {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-300" />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
