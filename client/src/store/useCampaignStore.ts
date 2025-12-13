import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campaign } from '@/types';
import { realApi } from '@/lib/api/real-api';

interface CampaignStore {
    campaigns: Campaign[];
    isLoading: boolean;

    // Actions
    fetchCampaigns: () => Promise<void>;
    createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'status' | 'sentCount' | 'deliveredCount' | 'readCount'>) => Promise<void>;
    duplicateCampaign: (id: string) => void;
    deleteCampaign: (id: string) => void;
    updateCampaignStatus: (id: string, status: Campaign['status']) => void;
    startSimulation: (id: string) => void;
    addCampaign: (campaign: Campaign) => void;
}

export const useCampaignStore = create<CampaignStore>()(
    persist(
        (set, get) => ({
            campaigns: [],
            isLoading: false,

            fetchCampaigns: async () => {
                set({ isLoading: true });
                try {
                    const campaigns = await realApi.campaigns.getCampaigns();
                    set({ campaigns, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch campaigns:', error);
                    set({ isLoading: false });
                }
            },

            createCampaign: async (campaignData) => {
                try {
                    // Backend expects full object or partial? The API expects Campaign model.
                    // We construct it here similar to mock but send to API.
                    // Actually, backend expects whatever `create_campaign` endpoint needs.
                    // It expects a Campaign object.
                    // We'll construct a temporary object to send. The ID is optional in backend model but required in Type.
                    // Let's rely on backend to assign ID if possible, but our Type requires ID.
                    // For now, let's send what we have.
                    // Actually, `realApi.campaigns.createCampaign` takes `Campaign`.
                    // We need to shape it.

                    const newCampaignPayload = {
                        ...campaignData,
                        id: "", // Let backend handle or ignore
                        status: 'draft',
                        createdAt: new Date().toISOString(),
                        sentCount: 0,
                        deliveredCount: 0,
                        readCount: 0,
                        templateId: "", // Default or handled
                        audienceIds: []
                    } as Campaign;

                    const created = await realApi.campaigns.createCampaign(newCampaignPayload);
                    set(state => ({
                        campaigns: [...state.campaigns, created]
                    }));
                } catch (error) {
                    console.error("Failed to create campaign:", error);
                }
            },

            duplicateCampaign: (id) => {
                // Client-side duplication for now as backend doesn't support it explicit yet
                const original = get().campaigns.find(c => c.id === id);
                if (!original) return;

                // We should probably call createCampaign API here too effectively
                // But for now keeping local logic would desync
                // Let's try to call createCampaign with duplicated data
                // Destructure to safely remove ID and other system fields
                const { id: _oldId, createdAt: _oldCreated, ...rest } = original;

                const duplicatedPayload = {
                    ...rest,
                    // Do not include 'id' field at all, let backend generate it
                    name: `${original.name} (Copy)`,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                    sentCount: 0,
                    deliveredCount: 0,
                    readCount: 0
                } as Campaign;

                realApi.campaigns.createCampaign(duplicatedPayload).then(created => {
                    set(state => ({
                        campaigns: [...state.campaigns, created]
                    }));
                }).catch(e => console.error("Duplicate failed", e));
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

            // Kept for compatibility
            addCampaign: (campaign) => {
                set(state => ({ campaigns: [campaign, ...state.campaigns] }));
            },

            startSimulation: (id) => {
                // Simulation logic kept local for demo purposes
                const campaign = get().campaigns.find(c => c.id === id)
                if (!campaign || campaign.status === 'completed') return

                get().updateCampaignStatus(id, 'sending')

                const interval = setInterval(() => {
                    const current = get().campaigns.find(c => c.id === id)
                    if (!current || current.status !== 'sending') {
                        clearInterval(interval)
                        return
                    }

                    const newSent = Math.min(current.sentCount + Math.floor(Math.random() * 5) + 1, current.totalContacts || 100)
                    const newDelivered = Math.min(current.deliveredCount + Math.floor(Math.random() * 4), newSent)
                    const newRead = Math.min(current.readCount + Math.floor(Math.random() * 3), newDelivered)

                    const updatedStats = {
                        sentCount: newSent,
                        deliveredCount: newDelivered,
                        readCount: newRead
                    };

                    set(state => ({
                        campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...updatedStats } : c)
                    }));

                    if (newSent >= (current.totalContacts || 100)) {
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
