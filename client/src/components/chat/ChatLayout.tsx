"use client"


import { ChatSidebar } from "./ChatSidebar"
import { ChatArea } from "./ChatArea"
import { useChatStore } from "@/store/useChatStore"

export function ChatLayout() {
    const { selectedChatId } = useChatStore()



    return (
        <div className="flex h-full w-full bg-background overflow-hidden relative">
            {/* 
              Mobile Behavior:
              - If NO chat selected: Show Sidebar (w-full).
              - If Chat selected: Hide Sidebar.
              
              Desktop/Tablet Behavior (md+):
              - Always show Sidebar (w-[35%] or w-[30%]).
            */}
            <div className={`h-full w-full md:w-[35%] lg:w-[30%] border-r bg-background 
                ${selectedChatId ? "hidden md:block" : "block"}
            `}>
                <ChatSidebar />
            </div>

            {/* 
              Mobile Behavior:
              - If NO chat selected: Hide Chat Area.
              - If Chat selected: Show Chat Area (w-full).
              
              Desktop/Tablet Behavior (md+):
              - Always show Chat Area (w-[65%] or w-[70%]).
            */}
            <div className={`flex-1 h-full md:w-[65%] lg:w-[70%] 
                ${selectedChatId ? "block" : "hidden md:block"}
            `}>
                <ChatArea />
            </div>
        </div>
    )
}
