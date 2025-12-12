export interface User {
    id: string;
    name: string;
    avatar: string;
    role: "admin" | "agent";
    email: string;
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    tags: string[];
    lastActive: string; // ISO Date string
    avatar?: string;
    email?: string;
}

export interface Message {
    id: string;
    chatId: string;
    senderId: string; // "me" or contactId
    text: string;
    timestamp: string;
    status: "sent" | "delivered" | "read";
    type: "text" | "image" | "template" | "video" | "document";
    mediaUrl?: string;
}

export interface ChatSession {
    id: string;
    contactId: string;
    contact: Contact;
    lastMessage: Message;
    unreadCount: number;
    status: "active" | "archived";
}

export interface Campaign {
    id: string;
    name: string;
    status: "draft" | "scheduled" | "sent" | "sending" | "completed" | "failed";
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    totalContacts: number;
    createdAt: string;
    templateName?: string;
    templateId?: string;
    goal?: string;
    scheduledDate?: Date;
}
