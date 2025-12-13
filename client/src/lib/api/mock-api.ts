import { ApiAdapter, AuthApi, UsersApi, ContactsApi, ChatApi, CampaignsApi, TemplatesApi, DashboardApi } from "./api";
import {
    MOCK_CONTACTS,
    MOCK_CHATS,
    MOCK_MSG_HISTORY,
    MOCK_CAMPAIGNS,
    MOCK_TEMPLATES,
    CURRENT_USER
} from "../mockData";
import { apiService } from "../api-service";
import { User, Contact, ChatSession, Message, Campaign, Template } from "@/types";

// Helper for delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

class MockAuthApi implements AuthApi {
    async login(email: string): Promise<{ user: User; token: string }> {
        await delay();
        // Mock simple login
        if (!email) throw new Error("Email required");
        return {
            user: CURRENT_USER,
            token: "mock-jwt-token-" + Date.now()
        };
    }

    async register(name: string, email: string, password?: string): Promise<{ user: User; token: string }> {
        await delay();
        return {
            user: { ...CURRENT_USER, name, email },
            token: "mock-jwt-token-" + Date.now()
        };
    }

    async logout(): Promise<void> {
        await delay(200);
        // No-op for mock
    }

    async getCurrentUser(): Promise<User | null> {
        await delay(200);
        return CURRENT_USER;
    }
}

class MockContactsApi implements ContactsApi {
    private contacts = [...MOCK_CONTACTS];

    async getContacts(): Promise<Contact[]> {
        await delay();
        return [...this.contacts];
    }

    async getContact(id: string): Promise<Contact | null> {
        await delay(200);
        return this.contacts.find(c => c.id === id) || null;
    }

    async createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
        await delay();
        const newContact = {
            ...contact,
            id: `c${Date.now()}`,
            lastActive: new Date().toISOString()
        };
        this.contacts.push(newContact);
        return newContact;
    }

    async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
        await delay();
        const index = this.contacts.findIndex(c => c.id === id);
        if (index === -1) throw new Error("Contact not found");

        this.contacts[index] = { ...this.contacts[index], ...updates };
        return this.contacts[index];
    }

    async deleteContact(id: string): Promise<void> {
        await delay();
        this.contacts = this.contacts.filter(c => c.id !== id);
    }

    async bulkDeleteContacts(ids: string[]): Promise<void> {
        await delay();
        this.contacts = this.contacts.filter(c => !ids.includes(c.id));
    }
}

class MockChatApi implements ChatApi {
    private chats = [...MOCK_CHATS];
    private messages = { ...MOCK_MSG_HISTORY };

    async getChats(): Promise<ChatSession[]> {
        await delay();
        return [...this.chats];
    }

    async getChat(id: string): Promise<ChatSession | null> {
        await delay(200);
        return this.chats.find(c => c.id === id) || null;
    }

    async getMessages(chatId: string): Promise<Message[]> {
        await delay(300);
        return this.messages[chatId] || [];
    }

    async sendMessage(chatId: string, text: string, type: 'text' | 'image' | 'document' | 'template' = 'text', mediaUrl?: string): Promise<Message> {
        await delay();
        const newMessage: Message = {
            id: `m${Date.now()}`,
            chatId,
            senderId: 'me',
            text,
            timestamp: new Date().toISOString(),
            status: 'sent',
            type,
            mediaUrl
        };

        if (!this.messages[chatId]) {
            this.messages[chatId] = [];
        }
        this.messages[chatId].push(newMessage);

        // Update last message in chat
        const chatIndex = this.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
            this.chats[chatIndex] = {
                ...this.chats[chatIndex],
                lastMessage: newMessage,
                status: 'active'
            };
        }

        return newMessage;
    }

    async markAsRead(chatId: string): Promise<void> {
        await delay(100);
        const chatIndex = this.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
            this.chats[chatIndex] = {
                ...this.chats[chatIndex],
                unreadCount: 0
            };
        }
    }
}

class MockCampaignsApi implements CampaignsApi {
    private campaigns = [...MOCK_CAMPAIGNS];

    async getCampaigns(): Promise<Campaign[]> {
        await delay();
        return [...this.campaigns];
    }

    async createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'status' | 'sentCount' | 'deliveredCount' | 'readCount'>): Promise<Campaign> {
        await delay();
        const newCampaign: Campaign = {
            ...campaignData,
            id: `cmp${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'scheduled',
            sentCount: 0,
            deliveredCount: 0,
            readCount: 0,
        };
        this.campaigns.push(newCampaign);
        return newCampaign;
    }

    async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
        await delay();
        const index = this.campaigns.findIndex(c => c.id === id);
        if (index === -1) throw new Error("Campaign not found");

        this.campaigns[index] = { ...this.campaigns[index], ...updates };
        return this.campaigns[index];
    }

    async deleteCampaign(id: string): Promise<void> {
        await delay();
        this.campaigns = this.campaigns.filter(c => c.id !== id);
    }

    async duplicateCampaign(id: string): Promise<Campaign> {
        await delay();
        const original = this.campaigns.find(c => c.id === id);
        if (!original) throw new Error("Campaign not found");

        const duplicated: Campaign = {
            ...original,
            id: `cmp${Date.now()}`,
            name: `${original.name} (Copy)`,
            status: 'draft',
            createdAt: new Date().toISOString(),
            sentCount: 0,
            deliveredCount: 0,
            readCount: 0
        };
        this.campaigns.push(duplicated);
        return duplicated;
    }
}

class MockTemplatesApi implements TemplatesApi {
    private templates = [...MOCK_TEMPLATES];

    async getTemplates(): Promise<Template[]> {
        await delay();
        // Since mock templates in mockData.ts might not match fully the new complex template structure,
        // we might need to map them or assume they are compatible if we updated mockData recently.
        // For now, casting as any to bypass strict checks if mockData is simple.
        // But ideally we should ensure types match.
        // The mockData.ts templates are simple objects. The Template type is complex.
        // We will enhance them on the fly if needed or just return them.
        return this.templates as any as Template[];
    }

    async createTemplate(templateData: Omit<Template, 'id' | 'status' | 'lastUpdated' | 'usageCount'>): Promise<Template> {
        await delay();
        const newTemplate: Template = {
            ...templateData,
            id: `tpl${Date.now()}`,
            status: 'pending',
            lastUpdated: new Date().toISOString(),
            usageCount: 0
        };
        this.templates.push(newTemplate as any);
        return newTemplate;
    }

    async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
        await delay();
        const index = this.templates.findIndex(t => t.id === id);
        if (index === -1) throw new Error("Template not found");

        this.templates[index] = { ...this.templates[index], ...updates, lastUpdated: new Date().toISOString() } as any;
        return this.templates[index] as any as Template;
    }

    async deleteTemplate(id: string): Promise<void> {
        await delay();
        this.templates = this.templates.filter(t => t.id !== id);
    }
}

class MockDashboardApi implements DashboardApi {
    async getStats() {
        return apiService.fetchDashboardStats();
    }

    async getChartData(range: string) {
        return apiService.fetchChartData();
    }

    async getRecentActivity() {
        return apiService.fetchRecentActivity();
    }
}

class MockUsersApi implements UsersApi {
    async getProfile(): Promise<User> {
        await delay();
        return CURRENT_USER;
    }
    async updateProfile(data: { name: string; email: string }): Promise<User> {
        await delay();
        return { ...CURRENT_USER, ...data };
    }
}

export class MockApiService implements ApiAdapter {
    auth = new MockAuthApi();
    users = new MockUsersApi();
    contacts = new MockContactsApi();
    chat = new MockChatApi();
    campaigns = new MockCampaignsApi();
    templates = new MockTemplatesApi();
    dashboard = new MockDashboardApi();
}
