import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, Message, Contact } from '@/types';
import { realApi } from '@/lib/api/real-api';

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
    sendMessage: (chatId: string, text: string, type?: 'text' | 'image' | 'document' | 'template', mediaUrl?: string) => Promise<void>;
    startChat: (contact: Contact) => void;
    pollMessages: () => void;
    receiveMessage: (chatId: string, message: Message) => void;
    setTyping: (chatId: string, isTyping: boolean) => void;
    setSearchQuery: (query: string) => void;

    // WebSocket
    socket: WebSocket | null;
    connectSocket: () => void;
    disconnectSocket: () => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            selectedChatId: null,
            chats: [],
            messages: {},
            isLoading: false,
            searchQuery: '',
            typingIndicators: {},
            socket: null,

            selectChat: (chatId) => {
                set({ selectedChatId: chatId });
                get().fetchMessages(chatId);
                // Mark as read locally
                set(state => ({
                    chats: state.chats.map(c =>
                        c.id === chatId ? { ...c, unreadCount: 0 } : c
                    )
                }));
            },

            fetchChats: async () => {
                if (get().chats.length === 0) {
                    set({ isLoading: true });
                }
                try {
                    const chats = await realApi.chat.getChats();
                    set({ chats, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch chats:', error);
                    set({ isLoading: false });
                }
            },

            fetchMessages: async (chatId) => {
                try {
                    const messages = await realApi.chat.getMessages(chatId);
                    set(state => ({
                        messages: {
                            ...state.messages,
                            [chatId]: messages
                        }
                    }));
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                }
            },

            sendMessage: async (chatId, text, type = 'text', mediaUrl) => {
                // Optimistic update
                const tempId = `temp-${Date.now()}`;
                const newMessage: Message = {
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
                        [chatId]: [...(state.messages[chatId] || []), newMessage]
                    },
                    chats: state.chats.map(c =>
                        c.id === chatId ? { ...c, lastMessage: newMessage, status: 'active' } : c
                    )
                }));

                try {
                    const sentMessage = await realApi.chat.sendMessage(chatId, text, type, mediaUrl);

                    set(state => ({
                        messages: {
                            ...state.messages,
                            [chatId]: state.messages[chatId].map(m => m.id === tempId ? sentMessage : m)
                        },
                        chats: state.chats.map(c =>
                            c.id === chatId ? { ...c, lastMessage: sentMessage } : c
                        )
                    }));
                } catch (error) {
                    console.error('Failed to send message:', error);
                }
            },

            startChat: (contact: Contact) => {
                const state = get();
                const existingChat = state.chats.find(c => c.contact.id === contact.id);

                if (existingChat) {
                    get().selectChat(existingChat.id);
                } else {
                    const newChatId = `chat-${contact.id}`;
                    const newChat: ChatSession = {
                        id: newChatId,
                        contactId: contact.id,
                        contact: contact,
                        unreadCount: 0,
                        lastMessage: undefined,
                        status: 'active'
                    };

                    set(state => ({
                        chats: [newChat, ...state.chats],
                        selectedChatId: newChatId
                    }));
                }
            },

            receiveMessage: (chatId, message) => {
                set(state => {
                    // Avoid duplicates
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

            // --- WebSocket Actions ---
            pollMessages: () => {
                console.warn("pollMessages is deprecated. Use WebSocket instead.");
            },

            connectSocket: () => {
                const { socket } = get();
                if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
                    return; // Already connected
                }

                // URL logic: default to localhost:8000 if not specified (adjust for Vercel if needed)
                const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000/api/ws/dashboard_client";

                console.log("🔌 Connecting to WebSocket:", wsUrl);
                const ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    console.log("✅ WebSocket Connected");
                };

                ws.onmessage = (event) => {
                    try {
                        const message: Message = JSON.parse(event.data);
                        console.log("📩 WS Message:", message);
                        get().receiveMessage(message.chatId, message);
                    } catch (e) {
                        console.error("Error parsing WS message:", e);
                    }
                };

                ws.onclose = () => {
                    console.log("❌ WebSocket Disconnected");
                    set({ socket: null });
                };

                ws.onerror = (error) => {
                    console.error("WebSocket Error:", error);
                };

                set({ socket: ws });
            },

            disconnectSocket: () => {
                const { socket } = get();
                if (socket) {
                    socket.close();
                    set({ socket: null });
                }
            }
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
