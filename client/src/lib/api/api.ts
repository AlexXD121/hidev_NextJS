import {
    User,
    Contact,
    ChatSession,
    Message,
    Campaign,
    Template
} from "@/types";
import { DashboardStats, ChartData, ActivityItem } from "../api-service";

export interface AuthApi {
    login(email: string, password?: string): Promise<{ user: User; token: string }>;
    register(name: string, email: string, password?: string): Promise<{ user: User; token: string }>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
}

export interface ContactsApi {
    getContacts(): Promise<Contact[]>;
    getContact(id: string): Promise<Contact | null>;
    createContact(contact: Omit<Contact, 'id'>): Promise<Contact>;
    updateContact(id: string, updates: Partial<Contact>): Promise<Contact>;
    deleteContact(id: string): Promise<void>;
    bulkDeleteContacts(ids: string[]): Promise<void>;
}

export interface ChatApi {
    getChats(): Promise<ChatSession[]>;
    getChat(id: string): Promise<ChatSession | null>;
    getMessages(chatId: string): Promise<Message[]>;
    sendMessage(chatId: string, text: string, type?: 'text' | 'image' | 'document' | 'template', mediaUrl?: string): Promise<Message>;
    markAsRead(chatId: string): Promise<void>;
}

export interface CampaignsApi {
    getCampaigns(): Promise<Campaign[]>;
    createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'status' | 'sentCount' | 'deliveredCount' | 'readCount'>): Promise<Campaign>;
    updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign>;
    deleteCampaign(id: string): Promise<void>;
    duplicateCampaign(id: string): Promise<Campaign>;
}

export interface TemplatesApi {
    getTemplates(): Promise<Template[]>;
    createTemplate(template: Omit<Template, 'id' | 'status' | 'lastUpdated' | 'usageCount'>): Promise<Template>;
    updateTemplate(id: string, updates: Partial<Template>): Promise<Template>;
    deleteTemplate(id: string): Promise<void>;
}

export interface DashboardApi {
    getStats(): Promise<DashboardStats>;
    getChartData(range: string): Promise<ChartData[]>;
    getRecentActivity(): Promise<ActivityItem[]>;
}

export interface UsersApi {
    getProfile(): Promise<User>;
    updateProfile(data: { name: string; email: string }): Promise<User>;
}

export interface ApiAdapter {
    auth: AuthApi;
    users: UsersApi;
    contacts: ContactsApi;
    chat: ChatApi;
    campaigns: CampaignsApi;
    templates: TemplatesApi;
    dashboard: DashboardApi;
}
