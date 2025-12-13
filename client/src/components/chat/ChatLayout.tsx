"use client"

import { useEffect } from "react"
import { ChatSidebar } from "./ChatSidebar"
import { ChatArea } from "./ChatArea"
import { useChatStore } from "@/store/useChatStore"

export function ChatLayout() {
    const { connectSocket, disconnectSocket } = useChatStore()

    useEffect(() => {
        // Initialize WebSocket connection
        connectSocket()

        // Cleanup on unmount
        return () => {
            disconnectSocket()
        }
    }, [connectSocket, disconnectSocket])

    return (
        <div className="flex h-full w-full bg-background overflow-hidden relative">
            <ChatSidebar />
            <ChatArea />
        </div>
    )
}
