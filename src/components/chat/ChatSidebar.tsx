"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useChatStore } from "@/store/useChatStore"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export function ChatSidebar() {
    const { chats, selectedChatId, setSelectedChatId } = useChatStore()

    return (
        <div className="flex flex-col h-full border-r bg-muted/10 w-full md:w-[320px] lg:w-[360px]">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search or start new chat"
                        className="pl-9 bg-background"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50",
                                selectedChatId === chat.id && "bg-muted"
                            )}
                        >
                            <Avatar>
                                <AvatarImage src={chat.contact.avatar} />
                                <AvatarFallback>{chat.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium truncate">{chat.contact.name}</span>
                                    {chat.lastMessage && (
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: false })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="text-sm text-muted-foreground truncate w-[180px]">
                                        {chat.lastMessage?.text || "No messages yet"}
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                            {chat.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
