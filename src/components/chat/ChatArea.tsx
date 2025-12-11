"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreVertical, Paperclip, Phone, Send, Video, Image as ImageIcon } from "lucide-react"
import { useChatStore } from "@/store/useChatStore"
import { MessageBubble } from "./MessageBubble"

export function ChatArea() {
    const { selectedChatId, chats, messages, sendMessage, receiveMessage } = useChatStore()
    const [inputText, setInputText] = useState("")
    const [isSimulatingResponse, setIsSimulatingResponse] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const selectedChat = chats.find(c => c.id === selectedChatId)
    const currentMessages = selectedChatId ? messages[selectedChatId] || [] : []

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [currentMessages, selectedChatId])

    const handleSend = () => {
        if (!inputText.trim() || !selectedChatId) return

        sendMessage(selectedChatId, inputText)
        setInputText("")

        // Simulation: Echo response
        if (!isSimulatingResponse) {
            setIsSimulatingResponse(true)
            setTimeout(() => {
                const responseMessage = {
                    id: (Date.now() + 1).toString(),
                    chatId: selectedChatId,
                    senderId: selectedChatId, // sender is the contact
                    text: `Echo: You said "${inputText}"`,
                    timestamp: new Date().toISOString(),
                    status: 'read' as const,
                    type: 'text' as const
                }
                receiveMessage(selectedChatId, responseMessage)
                setIsSimulatingResponse(false)
            }, 1500)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-muted/5">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-muted-foreground">Select a chat to start messaging</h3>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-6 bg-background">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={selectedChat.contact.avatar} />
                        <AvatarFallback>{selectedChat.contact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">{selectedChat.contact.name}</h3>
                        <span className="text-xs text-muted-foreground">
                            {isSimulatingResponse ? "Typing..." : "Online"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-muted/20">
                <div className="flex flex-col justify-end min-h-full">
                    {currentMessages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === 'me'} />
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-background">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file && selectedChatId) {
                                const mockUrl = URL.createObjectURL(file)
                                sendMessage(selectedChatId, 'Image Attachment', 'image', mockUrl)
                            }
                        }}
                    />
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => document.getElementById('file-upload')?.click()}>
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Input
                        placeholder="Type a message..."
                        className="flex-1"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button size="icon" className="shrink-0" onClick={handleSend}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
