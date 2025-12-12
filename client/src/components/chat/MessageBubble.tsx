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
            "flex w-full mb-2",
            isMe ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[70%] px-3 py-1.5 rounded-lg text-sm shadow-sm relative group",
                isMe ? "bg-[var(--bubble-out)] text-foreground rounded-tr-none" : "bg-[var(--bubble-in)] text-foreground rounded-tl-none",
                // Tail pseudo-elements
                isMe ?
                    "after:content-[''] after:absolute after:top-0 after:-right-[8px] after:w-0 after:h-0 after:border-[8px] after:border-t-[var(--bubble-out)] after:border-l-[var(--bubble-out)] after:border-r-transparent after:border-b-transparent after:rounded-tr-lg"
                    :
                    "before:content-[''] before:absolute before:top-0 before:-left-[8px] before:w-0 before:h-0 before:border-[8px] before:border-t-[var(--bubble-in)] before:border-r-[var(--bubble-in)] before:border-l-transparent before:border-b-transparent before:rounded-tl-lg"
            )}>
                {message.type === 'image' && message.mediaUrl ? (
                    <div className="mb-1 rounded-lg overflow-hidden">
                        <img src={message.mediaUrl} alt="attachment" className="max-w-xs h-auto object-cover" />
                    </div>
                ) : (
                    <p className="mr-14 pb-1 text-[14px] leading-relaxed">{message.text}</p>
                )}

                <div className={cn(
                    "float-right flex items-center gap-1 text-[11px] ml-2 -mt-1",
                    "text-muted-foreground/80"
                )}>
                    <span>{format(new Date(message.timestamp), "HH:mm")}</span>
                    {isMe && (
                        <span className={cn(
                            message.status === 'read' ? "text-[#53bdeb]" : "text-muted-foreground"
                        )}>
                            {message.status === 'sent' && <Check className="h-3 w-3" />}
                            {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                            {message.status === 'read' && <CheckCheck className="h-3 w-3" />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
