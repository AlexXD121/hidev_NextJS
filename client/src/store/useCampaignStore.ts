import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campaign } from '@/types';
import { MOCK_CAMPAIGNS } from '@/lib/mockData';

interface CampaignStore {
    campaigns: Campaign[];
    isLoading: boolean;

    // Actions
    fetchCampaigns: () => Promise<void>;
    createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'status' | 'sentCount' | 'deliveredCount' | 'readCount'>) => void;
    duplicateCampaign: (id: string) => void;
    deleteCampaign: (id: string) => void;
    updateCampaignStatus: (id: string, status: Campaign['status']) => void;
    startSimulation: (id: string) => void;
    addCampaign: (campaign: Campaign) => void;
}

export const useCampaignStore = create<CampaignStore>()(
    persist(
        (set, get) => ({
            campaigns: MOCK_CAMPAIGNS,
            isLoading: false,

            fetchCampaigns: async () => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                set({ isLoading: false });
            },

            createCampaign: (campaignData) => {
                const newCampaign: Campaign = {
                    ...campaignData,
                    id: `cmp-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    status: 'draft',
                    sentCount: 0,
                    deliveredCount: 0,
                    readCount: 0,
                };
                
                set(state => ({
                    campaigns: [...state.campaigns, newCampaign]
                }));
            },

            duplicateCampaign: (id) => {
                const original = get().campaigns.find(c => c.id === id);
                if (!original) return;

                const duplicated: Campaign = {
                    ...original,
                    id: `cmp-${Date.now()}`,
                    name: `${original.name} (Copy)`,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                    sentCount: 0,
                    deliveredCount: 0,
                    readCount: 0
                };
                
                set(state => ({
                    campaigns: [...state.campaigns, duplicated]
                }));
            },

            deleteCampaign: (id) => {
                set(state => ({
                    campaigns: state.campaigns.filter(c => c.id !== id)
                }));
            },

            updateCampaignStatus: (id, status) => {
                set(state => ({
                    campaigns: state.campaigns.map(c => c.id === id ? { ...c, status } : c)
                }));
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

            // In a real app, we would sync with backend here
            // For now, we just update local state

            if (newSent >= current.totalContacts && newDelivered >= current.totalContacts) {
                get().updateCampaignStatus(id, 'completed')
                clearInterval(interval)
            }
        }, 1000)
    }
        }),
        {
            name: 'campaigns-storage',
            partialize: (state) => ({
                campaigns: state.campaigns
            })
        }
    )
);
