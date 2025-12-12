import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, Message } from '@/types';
import { MOCK_CHATS, MOCK_MSG_HISTORY } from '@/lib/mockData';

interface ChatState {
    selectedChatId: string | null;
    chats: ChatSession[];
    messages: Record<string, Message[]>;
    isLoading: boolean;
    searchQuery: string;
    typingIndicators: Record<string, boolean>;

    // Actions
    selectChat: (chatId: string) => void;
    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, text: string, type?: 'text' | 'image' | 'document' | 'template', mediaUrl?: string) => void;
    receiveMessage: (chatId: string, message: Message) => void;
    setTyping: (chatId: string, isTyping: boolean) => void;
    setSearchQuery: (query: string) => void;
}

// Auto-response generator
const getAutoResponse = (userMessage: string): string => {
    const responses = [
        "Thanks for the update!",
        "Can you send more details?",
        "I'll get back to you shortly.",
        "That sounds great!",
        "Let me check on that for you.",
        "Perfect, I understand.",
        "Could you clarify that?",
        "I appreciate your patience."
    ];
    
    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! How can I help you today?";
    }
    if (lowerMessage.includes('thank')) {
        return "You're welcome!";
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Let me get you the pricing information.";
    }
    
    // Random response for other messages
    return responses[Math.floor(Math.random() * responses.length)];
};

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            selectedChatId: null,
            chats: MOCK_CHATS,
            messages: MOCK_MSG_HISTORY,
            isLoading: false,
            searchQuery: '',
            typingIndicators: {},

            selectChat: (chatId) => {
                set({ selectedChatId: chatId });
                get().fetchMessages(chatId);
                // Mark as read immediately when selected
                set(state => ({
                    chats: state.chats.map(c =>
                        c.id === chatId ? { ...c, unreadCount: 0 } : c
                    )
                }));
            },

            fetchChats: async () => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                set({ isLoading: false });
            },

            fetchMessages: async (chatId) => {
                // If already loaded for this chat, don't re-fetch
                if (get().messages[chatId]) return;

                // Simulate loading messages
                await new Promise(resolve => setTimeout(resolve, 300));
                set(state => ({
                    messages: {
                        ...state.messages,
                        [chatId]: []
                    }
                }));
            },

            sendMessage: (chatId, text, type = 'text', mediaUrl) => {
                // Add user message immediately
                const newMessage: Message = {
                    id: `msg-${Date.now()}`,
                    chatId,
                    senderId: 'me',
                    text,
                    timestamp: new Date().toISOString(),
                    status: 'sent',
                    type,
                    mediaUrl
                };

                set(state => ({
                    messages: {
                        ...state.messages,
                        [chatId]: [...(state.messages[chatId] || []), newMessage]
                    },
                    chats: state.chats.map(c =>
                        c.id === chatId ? { ...c, lastMessage: newMessage, status: 'active' } : c
                    )
                }));

                // Simulate auto-response
                setTimeout(() => {
                    get().setTyping(chatId, true);
                    
                    setTimeout(() => {
                        get().setTyping(chatId, false);
                        get().receiveMessage(chatId, {
                            id: `msg-${Date.now()}`,
                            chatId,
                            senderId: chatId.replace('chat', 'c'), // Convert chatId to contactId
                            text: getAutoResponse(text),
                            timestamp: new Date().toISOString(),
                            status: 'delivered',
                            type: 'text'
                        });
                    }, Math.random() * 2000 + 1000); // 1-3 seconds typing
                }, Math.random() * 2000 + 2000); // 2-4 seconds delay
            },

            receiveMessage: (chatId, message) => {
                set(state => {
                    const chatMessages = state.messages[chatId] || [];
                    if (chatMessages.some(m => m.id === message.id)) return state;

                    return {
                        messages: {
                            ...state.messages,
                            [chatId]: [...chatMessages, message]
                        },
                        chats: state.chats.map(c => {
                            if (c.id === chatId) {
                                return {
                                    ...c,
                                    lastMessage: message,
                                    unreadCount: state.selectedChatId === chatId ? 0 : (c.unreadCount || 0) + 1,
                                    status: 'active'
                                };
                            }
                            return c;
                        })
                    };
                });
            },

            setTyping: (chatId, isTyping) => {
                set(state => ({
                    typingIndicators: {
                        ...state.typingIndicators,
                        [chatId]: isTyping
                    }
                }));
            },

            setSearchQuery: (query) => set({ searchQuery: query }),
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                chats: state.chats,
                messages: state.messages
            })
        }
    )
);
