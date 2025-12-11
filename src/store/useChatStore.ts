import { create } from 'zustand'
import { ChatSession, Message } from '@/types'
import { MOCK_CHATS } from '@/lib/mockData'

interface ChatState {
    selectedChatId: string | null
    chats: ChatSession[]
    messages: Record<string, Message[]>
    setSelectedChatId: (id: string | null) => void
    sendMessage: (chatId: string, text: string, type?: 'text' | 'image', mediaUrl?: string) => void
    receiveMessage: (chatId: string, message: Message) => void
}

const initialMessages: Record<string, Message[]> = {}
MOCK_CHATS.forEach(chat => {
    if (chat.lastMessage) {
        initialMessages[chat.id] = [chat.lastMessage]
    } else {
        initialMessages[chat.id] = []
    }
})

export const useChatStore = create<ChatState>((set, get) => ({
    selectedChatId: null,
    chats: MOCK_CHATS,
    messages: initialMessages,

    setSelectedChatId: (id) => set((state) => {
        // When opening a chat, mark as read (reset unread count)
        const updatedChats = state.chats.map(chat =>
            chat.id === id ? { ...chat, unreadCount: 0 } : chat
        )
        return { selectedChatId: id, chats: updatedChats }
    }),

    sendMessage: (chatId, text, type = 'text', mediaUrl) => set((state) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            chatId,
            senderId: 'me',
            text,
            timestamp: new Date().toISOString(),
            status: 'sent',
            type,
            mediaUrl
        }

        const chatMessages = state.messages[chatId] || []

        // Update chat list preview
        const updatedChats = state.chats.map((chat) =>
            chat.id === chatId
                ? { ...chat, lastMessage: newMessage, unreadCount: 0 } // Sent messages don't add check count
                : chat
        )

        return {
            chats: updatedChats,
            messages: { ...state.messages, [chatId]: [...chatMessages, newMessage] }
        }
    }),

    receiveMessage: (chatId, message) => set((state) => {
        const chatMessages = state.messages[chatId] || []

        // Only increment unread if we are NOT currently looking at this chat
        const isChatActive = state.selectedChatId === chatId

        const updatedChats = state.chats.map((chat) =>
            chat.id === chatId
                ? {
                    ...chat,
                    lastMessage: message,
                    unreadCount: isChatActive ? 0 : chat.unreadCount + 1
                }
                : chat
        )

        return {
            chats: updatedChats,
            messages: { ...state.messages, [chatId]: [...chatMessages, message] }
        }
    })
}))
