"use client"

import { Search, MoreVertical, MessageSquarePlus, CircleDashed, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatStore } from "@/store/useChatStore"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { NewChatDialog } from "@/components/chat/NewChatDialog"

export function ChatSidebar() {
    const { chats, selectedChatId, selectChat, fetchChats, pollMessages } = useChatStore()
    const [searchQuery, setSearchQuery] = useState("")

    // Initial fetch and polling setup
    useEffect(() => {
        fetchChats();

        const interval = setInterval(() => {
            pollMessages();
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [fetchChats, pollMessages]);

    const filteredChats = chats.filter(chat =>
        chat.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full border-r border-[#e9edef] dark:border-[#2f3b43] bg-background w-full md:w-[400px]">
            {/* Header */}
            <div className="h-16 px-4 py-2 bg-secondary flex items-center justify-between shrink-0">
                <Avatar className="cursor-pointer">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>ME</AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2 text-[#54656F] dark:text-[#aebac1]">
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <CircleDashed className="h-5 w-5" />
                    </Button>

                    <NewChatDialog>
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                            <MessageSquarePlus className="h-5 w-5" />
                        </Button>
                    </NewChatDialog>

                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-2 border-b border-[#e9edef] dark:border-[#2f3b43] bg-background">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#54656F] dark:text-[#aebac1]" />
                        <Input
                            placeholder="Search or start new chat"
                            className="pl-10 h-9 bg-secondary border-none rounded-lg text-sm placeholder:text-[#54656F] dark:placeholder:text-[#aebac1] focus-visible:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 text-[#54656F] dark:text-[#aebac1]">
                        <Filter className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1 bg-background">
                <div className="flex flex-col">
                    {filteredChats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => selectChat(chat.id)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 w-full text-left transition-colors border-b border-[#f0f2f5] dark:border-[#2A3942] hover:bg-[#f0f2f5] dark:hover:bg-[#202C33]",
                                selectedChatId === chat.id && "bg-[#f0f2f5] dark:bg-[#202C33]"
                            )}
                        >
                            <div className="relative">
                                <Avatar className="h-12 w-12 shrink-0">
                                    <AvatarImage src={chat.contact.avatar} />
                                    <AvatarFallback>{chat.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {chat.status === 'active' && (
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background ring-1 ring-background" />
                                )}
                            </div>

                            <div className="flex-1 overflow-hidden min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-normal text-[17px] text-[#111B21] dark:text-[#E9EDEF] truncate">
                                        {chat.contact.name}
                                    </span>
                                    {chat.lastMessage && (
                                        <span className={cn(
                                            "text-xs shrink-0 ml-2",
                                            chat.unreadCount > 0 ? "text-[#008069] dark:text-[#00A884] font-medium" : "text-[#667781] dark:text-[#8696A0]"
                                        )}>
                                            {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: false })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-[#667781] dark:text-[#8696A0] truncate pr-2">
                                        {chat.lastMessage?.text || "Click to start chatting"}
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <span className="bg-[#25D366] text-white text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shrink-0">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}

                    {/* Archived Hint (Visual Only) */}
                    <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <span className="flex items-center gap-1"><CircleDashed className="h-3 w-3" /> Your personal messages are end-to-end encrypted</span>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
