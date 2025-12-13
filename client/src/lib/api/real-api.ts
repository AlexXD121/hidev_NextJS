import {
    ApiAdapter,
    AuthApi,
    UsersApi,
    ContactsApi,
    ChatApi,
    CampaignsApi,
    TemplatesApi,
    DashboardApi
} from "./api";
import { apiClient } from "./axios-client";
import {
    User,
    Contact,
    ChatSession,
    Message,
    Campaign,
    Template
} from "@/types";
import { DashboardStats } from "../api-service";

// --- Auth ---
const auth: AuthApi = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },
    // New Register Implementation
    register: async (name, email, password) => {
        const response = await apiClient.post('/auth/register', {
            name,
            email,
            password
        });
        return response.data;
    },
    logout: async () => { },
    getCurrentUser: async () => null
};

// --- Contacts ---
const contacts: ContactsApi = {
    getContacts: async () => {
        const response = await apiClient.get('/contacts/');
        return response.data;
    },
    getContact: async (id) => {
        const all = await apiClient.get('/contacts/');
        return all.data.find((c: Contact) => c.id === id) || null;
    },
    createContact: async (contact) => {
        const response = await apiClient.post('/contacts/', contact);
        return response.data;
    },
    updateContact: async (id, updates) => {
        return { id, ...updates } as Contact;
    },
    deleteContact: async (id) => {
        await apiClient.delete(`/contacts/${id}`);
    },
    bulkDeleteContacts: async (ids) => {
        await Promise.all(ids.map(id => apiClient.delete(`/contacts/${id}`)));
    }
};

// --- Chat ---
const chat: ChatApi = {
    getChats: async () => {
        const response = await apiClient.get('/chats');
        return response.data;
    },
    getChat: async (id) => {
        const all = await apiClient.get('/chats');
        return all.data.find((c: ChatSession) => c.id === id) || null;
    },
    getMessages: async (chatId) => {
        const response = await apiClient.get(`/chats/${chatId}/messages`);
        return response.data;
    },
    sendMessage: async (chatId, text, type = 'text', mediaUrl) => {
        const payload = {
            chatId,
            senderId: 'me',
            text,
            type,
            mediaUrl,
            status: 'sent',
        };
        const response = await apiClient.post(`/chats/${chatId}/messages`, payload);
        return response.data;
    },
    markAsRead: async (chatId) => { }
};

// --- Campaigns ---
const campaigns: CampaignsApi = {
    getCampaigns: async () => {
        const response = await apiClient.get('/campaigns/');
        return response.data;
    },
    createCampaign: async (campaign) => {
        const response = await apiClient.post('/campaigns/', campaign);
        return response.data;
    },
    updateCampaign: async (id, updates) => ({ id, ...updates } as Campaign),
    deleteCampaign: async (id) => { },
    duplicateCampaign: async (id) => ({} as Campaign)
};

// --- Templates (Mock) ---
const templates: TemplatesApi = {
    getTemplates: async () => [],
    createTemplate: async (t) => t as Template,
    updateTemplate: async (id, t) => ({ id, ...t } as Template),
    deleteTemplate: async () => { }
}

// --- Dashboard (Mock) ---
const dashboard: DashboardApi = {
    getStats: async () => ({
        totalContacts: 1250,
        activeCampaigns: 5,
        messagesSent: 15430,
        responseRate: 24,
        activeChats: 12,
        sentCampaigns: 89
    }),
    getChartData: async () => [],
    getRecentActivity: async () => []
}

// --- Users ---
const users: UsersApi = {
    getProfile: async () => {
        const response = await apiClient.get('/users/me');
        return response.data;
    },
    updateProfile: async (data: { name: string; email: string }) => {
        const response = await apiClient.put('/users/me', data);
        return response.data;
    }
};

export const realApi: ApiAdapter = {
    auth,
    users,
    contacts,
    chat,
    campaigns,
    templates,
    dashboard
};
