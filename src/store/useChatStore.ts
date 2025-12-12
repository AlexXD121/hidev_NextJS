import { create } from 'zustand';
import { ChatSession, Message } from '@/types';
import { api } from '@/lib/api/client';

interface ChatState {
    selectedChatId: string | null;
    chats: ChatSession[];
    messages: Record<string, Message[]>;
    isLoading: boolean;
    searchQuery: string;

    // Actions
    selectChat: (chatId: string) => void;
    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, text: string, type?: 'text' | 'image' | 'document' | 'template', mediaUrl?: string) => Promise<void>;
    receiveMessage: (chatId: string, message: Message) => void;
    setSearchQuery: (query: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    selectedChatId: null,
    chats: [],
    messages: {},
    isLoading: false,
    searchQuery: '',

    selectChat: (chatId) => {
        set({ selectedChatId: chatId });
        get().fetchMessages(chatId);
        // Mark as read immediately when selected
        api.chat.markAsRead(chatId).then(() => {
            set(state => ({
                chats: state.chats.map(c =>
                    c.id === chatId ? { ...c, unreadCount: 0 } : c
                )
            }));
        });
    },

    fetchChats: async () => {
        set({ isLoading: true });
        try {
            const chats = await api.chat.getChats();
            set({ chats, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch chats", error);
            set({ isLoading: false });
        }
    },

    fetchMessages: async (chatId) => {
        // If already loaded for this chat, don't re-fetch unless forced (optimization)
        if (get().messages[chatId]) return;

        try {
            const msgs = await api.chat.getMessages(chatId);
            set(state => ({
                messages: {
                    ...state.messages,
                    [chatId]: msgs
                }
            }));
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    },

    sendMessage: async (chatId, text, type = 'text', mediaUrl) => {
        try {
            // Optimistic update
            const tempId = `temp-${Date.now()}`;
            const optimisitcMsg: Message = {
                id: tempId,
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
                    [chatId]: [...(state.messages[chatId] || []), optimisitcMsg]
                },
                // Update last message in chat list
                chats: state.chats.map(c =>
                    c.id === chatId ? { ...c, lastMessage: optimisitcMsg, status: 'active' } : c
                )
            }));

            // Actual API call
            const sentMsg = await api.chat.sendMessage(chatId, text, type, mediaUrl);

            // Replace optimistic message with real one
            set(state => ({
                messages: {
                    ...state.messages,
                    [chatId]: state.messages[chatId].map(m => m.id === tempId ? sentMsg : m)
                },
                chats: state.chats.map(c =>
                    c.id === chatId ? { ...c, lastMessage: sentMsg } : c
                )
            }));

        } catch (error) {
            console.error("Failed to send message", error);
        }
    },

    receiveMessage: (chatId, message) => {
        set(state => {
            // Only add if not already present (dedup)
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

    setSearchQuery: (query) => set({ searchQuery: query }),
}));
