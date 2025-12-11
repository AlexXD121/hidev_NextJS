"use client"

import { ChatSidebar } from "./ChatSidebar"
import { ChatArea } from "./ChatArea"

export function ChatLayout() {
    return (
        <div className="flex h-full bg-background overflow-hidden relative">
            <ChatSidebar />
            <ChatArea />
        </div>
    )
}
