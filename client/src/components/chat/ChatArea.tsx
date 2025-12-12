"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreVertical, Paperclip, Search, Smile, Mic, Plus, MessageSquare } from "lucide-react"
import { useChatStore } from "@/store/useChatStore"
import { useCallStore } from "@/store/useCallStore"
import { MessageBubble } from "./MessageBubble"
import { TemplateSelector } from "@/components/templates/TemplateSelector"
import { Template, TemplateComponent } from "@/types"

export function ChatArea() {
    const { selectedChatId, chats, messages, sendMessage, receiveMessage, typingIndicators } = useChatStore()
    const { startCall } = useCallStore()
    const [inputText, setInputText] = useState("")
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
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }
    const [isTemplateOpen, setIsTemplateOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            // In a real app, upload to storage here. 
            // We'll simulate a URL using URL.createObjectURL
            const fakeUrl = URL.createObjectURL(file)
            sendMessage(selectedChatId!, "Photo", "image", fakeUrl)

            // Allow selecting same file again
            e.target.value = ''
        }
    }

    const handleTemplateSelect = (template: Template) => {
        // Option 1: Auto-send
        // sendMessage(selectedChatId!, template.body, 'template')

        // Option 2: Fill input (better for checking params)
        // Safe access to body using component search only
        const bodyComponent = template.components?.find(c => c.type === 'BODY' && 'text' in c) as { type: 'BODY', text: string } | undefined
        const text = bodyComponent?.text || "Template"
        setInputText(text)
        setIsTemplateOpen(false)
    }

    if (!selectedChat) {
        // ... (existing empty state)
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#222e35] h-full border-b-[6px] border-[#25D366]">
                <div className="text-center max-w-[560px] px-8">
                    <div className="mx-auto mb-10">
                        {/* Placeholder for WA logo */}
                        <div className="w-[320px] h-[200px] mx-auto flex items-center justify-center text-muted-foreground/20">
                            <MessageSquare className="w-20 h-20" />
                        </div>
                    </div>
                    <h1 className="text-[32px] font-light text-[#41525d] dark:text-[#e9edef] mb-5">
                        WhatsApp Business Dashboard
                    </h1>
                    <p className="text-[#667781] dark:text-[#8696A0] text-sm leading-6 mb-8">
                        Select a chat to start messaging, or create a new campaign.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-full active-chat-container bg-[#efeae2] dark:bg-[#0b141a]">
            {/* Header */}
            <div className="h-16 px-4 py-2 border-b border-[#e9edef] dark:border-[#2f3b43] bg-secondary flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-3 cursor-pointer">
                    <Avatar>
                        <AvatarImage src={selectedChat.contact.avatar} />
                        <AvatarFallback>{selectedChat.contact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <h3 className="font-medium text-base text-[#111B21] dark:text-[#E9EDEF] leading-tight">
                            {selectedChat.contact.name}
                        </h3>
                        <span className="text-xs text-[#667781] dark:text-[#8696A0] truncate">
                            {selectedChatId && typingIndicators[selectedChatId] ?
                                <span className="text-[#008069] dark:text-[#00A884] font-bold">typing...</span>
                                : "click here for contact info"
                            }
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[#54656F] dark:text-[#aebac1]">
                    <Search className="h-5 w-5 cursor-pointer" />
                    <MoreVertical className="h-5 w-5 cursor-pointer" />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden relative bg-chat">
                <ScrollArea className="h-full px-8 md:px-[5%]" type="always">
                    <div className="flex flex-col justify-end min-h-full py-4 pb-2">
                        {currentMessages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === 'me'} />
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="min-h-[62px] px-4 py-2 bg-secondary border-t border-[#e9edef] dark:border-[#2f3b43] flex items-center gap-2 shrink-0 z-10">
                <Button variant="ghost" size="icon" className="text-[#54656F] dark:text-[#8696A0] shrink-0" onClick={() => setIsTemplateOpen(true)}>
                    <Smile className="h-6 w-6" />
                </Button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                />
                <Button variant="ghost" size="icon" className="text-[#54656F] dark:text-[#8696A0] shrink-0" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-6 w-6" />
                </Button>

                <div className="flex-1 mx-2">
                    <Input
                        placeholder="Type a message"
                        className="w-full bg-white dark:bg-[#2A3942] border-none rounded-lg px-4 py-3 text-[15px] focus-visible:ring-0 placeholder:text-[#667781] dark:placeholder:text-[#8696A0]"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {inputText.trim() ? ( // Show Send button only when typing
                    <Button size="icon" className="shrink-0 text-[#54656F] dark:text-[#8696A0] hover:bg-transparent" onClick={handleSend} variant="ghost">
                        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24"><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path></svg>
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" className="text-[#54656F] dark:text-[#8696A0] shrink-0">
                        <Mic className="h-6 w-6" />
                    </Button>
                )}
            </div>

            <TemplateSelector
                open={isTemplateOpen}
                onOpenChange={setIsTemplateOpen}
                onSelect={handleTemplateSelect}
            />
        </div>
    )
}
