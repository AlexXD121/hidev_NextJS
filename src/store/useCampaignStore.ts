import { create } from 'zustand';
import { Campaign } from '@/types';
import { api } from '@/lib/api/client';

interface CampaignStore {
    campaigns: Campaign[];
    isLoading: boolean;

    // Actions
    fetchCampaigns: () => Promise<void>;
    createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'status' | 'sentCount' | 'deliveredCount' | 'readCount'>) => Promise<void>;
    duplicateCampaign: (id: string) => Promise<void>;
    deleteCampaign: (id: string) => Promise<void>;
    updateCampaignStatus: (id: string, status: Campaign['status']) => Promise<void>;
    startSimulation: (id: string) => void; // Keeps simulation logic for now, or could move to API
    addCampaign: (campaign: Campaign) => void; // Keep for backward compatibility if needed, or remove
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
    campaigns: [],
    isLoading: false,

    fetchCampaigns: async () => {
        set({ isLoading: true });
        try {
            const campaigns = await api.campaigns.getCampaigns();
            set({ campaigns, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
            set({ isLoading: false });
        }
    },

    createCampaign: async (campaignData) => {
        set({ isLoading: true });
        try {
            const newCampaign = await api.campaigns.createCampaign(campaignData);
            set(state => ({
                campaigns: [...state.campaigns, newCampaign],
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to create campaign", error);
            set({ isLoading: false });
        }
    },

    duplicateCampaign: async (id) => {
        set({ isLoading: true });
        try {
            const duplicated = await api.campaigns.duplicateCampaign(id);
            set(state => ({
                campaigns: [...state.campaigns, duplicated],
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to duplicate campaign", error);
            set({ isLoading: false });
        }
    },

    deleteCampaign: async (id) => {
        set({ isLoading: true });
        try {
            await api.campaigns.deleteCampaign(id);
            set(state => ({
                campaigns: state.campaigns.filter(c => c.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to delete campaign", error);
            set({ isLoading: false });
        }
    },

    updateCampaignStatus: async (id, status) => {
        // Optimistic
        set(state => ({
            campaigns: state.campaigns.map(c => c.id === id ? { ...c, status } : c)
        }));
        try {
            await api.campaigns.updateCampaign(id, { status });
        } catch (error) {
            console.error("Failed to update status", error);
        }
    },

    // Kept for compatibility but should rely on createCampaign
    addCampaign: (campaign) => {
        set(state => ({ campaigns: [campaign, ...state.campaigns] }));
    },

    startSimulation: (id) => {
        const campaign = get().campaigns.find(c => c.id === id)
        if (!campaign || campaign.status === 'completed') return

        // Set to sending
        get().updateCampaignStatus(id, 'sending')

        const interval = setInterval(() => {
            const current = get().campaigns.find(c => c.id === id)
            if (!current || current.status !== 'sending') {
                clearInterval(interval)
                return
            }

            const newSent = Math.min(current.sentCount + Math.floor(Math.random() * 5) + 1, current.totalContacts)
            const newDelivered = Math.min(current.deliveredCount + Math.floor(Math.random() * 4), newSent)
            const newRead = Math.min(current.readCount + Math.floor(Math.random() * 3), newDelivered)

            // Local update for simulation effect
            // In real app, we would polling API or use Websocket
            const updatedStats = {
                sentCount: newSent,
                deliveredCount: newDelivered,
                readCount: newRead
            };

            set(state => ({
                campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...updatedStats } : c)
            }));

            // Sync with backend occasionally or at end? 
            // For now, we update backend at every step (might be too frequent for real app)
            api.campaigns.updateCampaign(id, updatedStats).catch(console.error);

            if (newSent >= current.totalContacts && newDelivered >= current.totalContacts) {
                get().updateCampaignStatus(id, 'completed')
                clearInterval(interval)
            }
        }, 1000)
    }
}));
