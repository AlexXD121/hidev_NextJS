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
            {/* Sidebar Wrapper: 30% on Desktop, Full on Mobile (if no chat selected) */}
            <div className={`h-full w-full lg:w-[30%] border-r bg-background ${selectedChatId ? "hidden lg:block" : "block"}`}>
                <ChatSidebar />
            </div>

            {/* Chat Area Wrapper: 70% on Desktop, Full on Mobile (if chat selected) */}
            <div className={`flex-1 h-full lg:w-[70%] ${selectedChatId ? "block" : "hidden lg:block"}`}>
                <ChatArea />
            </div>
        </div>
    )
}
