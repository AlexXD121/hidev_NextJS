import { ChatLayout } from "@/components/chat/ChatLayout"

export default function ChatPage() {
    return (
        <div className="h-[calc(100vh-2rem)] border rounded-xl overflow-hidden shadow-sm bg-background">
            <ChatLayout />
        </div>
    )
}
