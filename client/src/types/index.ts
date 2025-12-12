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

export interface Template {
    id: string;
    name: string;
    language: string;
    status: "approved" | "pending" | "rejected";
    category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
    components: TemplateComponent[];
    lastUpdated: string; // ISO Date string
    usageCount?: number;
}

export type TemplateComponent =
    | { type: "HEADER"; format: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT"; text?: string; mediaUrl?: string }
    | { type: "BODY"; text: string; example?: { body_text: string[][] } }
    | { type: "FOOTER"; text: string }
    | { type: "BUTTONS"; buttons: TemplateButton[] };

export interface TemplateButton {
    type: "QUICK_REPLY" | "PHONE_NUMBER" | "URL";
    text: string;
    phoneNumber?: string;
    url?: string;
}

