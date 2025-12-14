"use client"

import { useEffect } from "react"
import { ChatSidebar } from "./ChatSidebar"
import { ChatArea } from "./ChatArea"
import { useChatStore } from "@/store/useChatStore"

export function ChatLayout() {
    const { connectSocket, disconnectSocket, selectedChatId } = useChatStore()

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
            <div className={`h-full w-full lg:w-80 border-r bg-background ${selectedChatId ? "hidden lg:flex" : "flex"}`}>
                <ChatSidebar />
            </div>
            <div className={`flex-1 h-full ${!selectedChatId ? "hidden lg:flex" : "flex"}`}>
                <ChatArea />
            </div>
        </div>
    )
}
