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
                // Determine if we should show loading spinner (only on first empty load)
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

                    // Replace optimistic message with real one
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
                    // Mark as failed in UI (simplified here by not removing it yet, just log)
                }
            },

            startChat: (contact: Contact) => {
                const state = get();
                // Check if we already have a chat with this contact
                // Assumption: chat.contact.id or chat.id relates to contact in a known way. 
                // Usually chat.contact.id would match contact.id.
                const existingChat = state.chats.find(c => c.contact.id === contact.id);

                if (existingChat) {
                    get().selectChat(existingChat.id);
                } else {
                    // Optimistically create a new chat session
                    // In a real app, you might POST /chats first. 
                    // Here we'll mock the ID format or assume backend handles it on first message.
                    // For UI flow, we need a valid-looking chat object.
                    // Let's assume the chat ID is "chat-{contactId}" or similar if we control it,
                    // or generate a temp one.
                    const newChatId = `chat-${contact.id}`;

                    const newChat: ChatSession = {
                        id: newChatId,
                        contactId: contact.id, // Add missing property
                        contact: contact,
                        unreadCount: 0,
                        lastMessage: undefined, // No message yet
                        status: 'active'
                    };

                    set(state => ({
                        chats: [newChat, ...state.chats],
                        selectedChatId: newChatId
                    }));

                    // IMPORTANT: If backend requires explicit chat creation, do it here.
                    // For now, we assume implicit creation on first message or this local state is enough until refresh.
                }
            },

            pollMessages: () => {
                // Simple polling mechanism
                get().fetchChats();
                const selectedId = get().selectedChatId;
                if (selectedId) {
                    get().fetchMessages(selectedId);
                }
            },

            // Keeping receiveMessage and setTyping for WebSocket or local simulation if needed
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
